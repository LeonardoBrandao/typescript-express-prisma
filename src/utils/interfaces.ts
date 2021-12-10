import { Request as ExpressRequest } from 'express';

export interface User {
        id: number,
        email: string,
        role: string 
}

export interface Request extends ExpressRequest {
    user: User
}
