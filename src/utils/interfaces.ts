import { Request as ExpressRequest } from 'express';
import { Role } from '@prisma/client'


export interface User {
    id?: number,
    username?: string,
    email?: string,
    role?: Role,
    createdAt?: any,
    lastActivity?: any,
}

export interface Request extends ExpressRequest {
    user: User
}
