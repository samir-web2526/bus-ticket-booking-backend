import status from "http-status";
import { Stripe } from "stripe";
import { BookingStatus, PaymentStatus } from "../../../generated/enums";
import { prisma } from "../../../lib/prisma";
import stripe from "../../../lib/stripe";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../../config/env";
import { paginationHelper } from "../../sharedfile";

const initializePayment = async (bookingId: string, userId: string) => {
  // 1. Find the booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      bookingSeats: {
        include: { seat: true },
      },
      schedule: {
        include: {
          bus: true,
          route: true,
        },
      },
      payment: true,
    },
  });

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found.");
  }

  // 2. Verify ownership
  if (booking.userId !== userId) {
    throw new AppError(status.FORBIDDEN, "You are not authorized to pay for this booking.");
  }

  // 3. Check booking status
  if (booking.status !== BookingStatus.PENDING) {
    throw new AppError(status.BAD_REQUEST, "Only pending bookings can be paid.");
  }

  // 4. Check if payment already exists and is paid
  if (booking.payment && booking.payment.status === PaymentStatus.PAID) {
    throw new AppError(status.BAD_REQUEST, "Payment already completed for this booking.");
  }

  // 5. If there's already a pending payment session, return its URL
  if (booking.payment && booking.payment.status === PaymentStatus.UNPAID) {
    try {
      const existingSession = await stripe.checkout.sessions.retrieve(
        booking.payment.stripeSessionId
      );
      if (existingSession.status === "open" && existingSession.url) {
        return {
          checkoutUrl: existingSession.url,
          sessionId: existingSession.id,
        };
      }
    } catch {
      // Session expired or invalid, create a new one below
    }

    // Delete the old failed/expired payment record
    await prisma.payment.delete({
      where: { id: booking.payment.id },
    });
  }

  // 6. Build line items from booked seats
  const lineItems: any[] =
    booking.bookingSeats.map((bs) => ({
      price_data: {
        currency: "bdt",
        product_data: {
          name: `Seat ${bs.seat.number} - ${booking.schedule.bus.name}`,
          description: `${booking.schedule.route.sourceCity} → ${booking.schedule.route.destinationCity}`,
        },
        unit_amount: Math.round(bs.seat.price * 100), // Stripe expects amount in smallest currency unit (poisha)
      },
      quantity: 1,
    }));

  // 7. Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envVars.FRONTEND_URL}/payment/cancel?booking_id=${bookingId}`,
    line_items: lineItems,
    customer_email: booking.user.email,
    metadata: {
      bookingId: booking.id,
    },
  });

  // 8. Save payment record in DB
  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      stripeSessionId: session.id,
      amount: booking.totalFare,
      currency: "bdt",
      status: PaymentStatus.UNPAID,
    },
  });

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

const handleStripeWebhook = async (rawBody: Buffer, signature: string) => {
  let event: any;

  // 1. Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      envVars.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    throw new AppError(
      status.BAD_REQUEST,
      `Webhook signature verification failed: ${err.message}`
    );
  }

  // 2. Handle event types
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const bookingId = session.metadata?.bookingId;

      // ✅ bookingId না থাকলে skip করুন (stripe trigger এর test event)
      if (!bookingId) {
        console.log("⚠️ No bookingId in metadata, skipping...");
        break;
      }

      try {
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { stripeSessionId: session.id },
            data: {
              status: PaymentStatus.PAID,
              paidAt: new Date(),
            },
          });

          await tx.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.CONFIRMED },
          });
        });

        console.log(`✅ Payment confirmed for booking: ${bookingId}`);
      } catch (error: any) {
        console.error(`❌ Error updating payment/booking: ${error.message}`);
        throw error;
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as any;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        console.log(`❌ Payment expired for booking: ${bookingId}`);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return { received: true };
};

// Get payment status by booking ID
const getPaymentByBookingId = async (bookingId: string, userId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { bookingId },
    include: {
      booking: {
        include: {
          user: true,
          schedule: {
            include: {
              bus: {
                include: {
                  operator: true,
                },
              },
              route: true,
            },
          },
          bookingSeats: {
            include: {
              seat: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(status.NOT_FOUND, "Payment not found for this booking.");
  }

  const paymentData = payment as any;
  if (paymentData.booking.userId !== userId) {
    throw new AppError(status.FORBIDDEN, "You are not authorized to view this payment.");
  }

  return paymentData;
};

// Get all payments (Admin only)
const getAllPayments = async (query: any) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(query);

  const result = await prisma.payment.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
    include: {
      booking: {
        include: {
          user: true,
          schedule: {
            include: {
              bus: {
                include: {
                  operator: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const total = await prisma.payment.count();

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export const PaymentService = {
  initializePayment,
  handleStripeWebhook,
  getPaymentByBookingId,
  getAllPayments,
};
