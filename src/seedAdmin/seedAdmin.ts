import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';


export async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '+1234567890',
        role: 'ADMIN',
        isVerified: true,
      },
    });

    console.log('Admin user created:', admin.email);
  } finally {
    await prisma.$disconnect();
  }
}