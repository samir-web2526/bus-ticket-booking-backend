import { Request } from 'express';

export interface IRequestUser extends Omit<Request, 'user'> {
    user?: {
        id: string;
        email: string;
        role: string;
        [key: string]: any;
    };
}
