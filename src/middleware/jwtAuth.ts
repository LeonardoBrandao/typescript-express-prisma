import { verifyJWT } from "../auth/jwt";
import { Response, NextFunction } from "express";
import { HttpStatusCode as status } from '../utils/httpStatusCodes';
import { PrismaClient } from '@prisma/client'
import { Request } from "../utils/interfaces";

/**
 * Middleware to authorize requests to the API
 * 
 * If the request is to a public URL, just call next
 * 
 * Else, the function will get the "Authentication" header value and validate the JWT
 * If the JWT is valid, a user property will be set in the request object (eg. req.user)
 * 
 * 
 * @param publicUrls List of url's that don't need a valid JWT to be called
 */
export function jwtMiddleware(options: { publicUrls: string[] }) {
    return async function (req: Request, res: Response, next: NextFunction) {
        if (options.publicUrls.includes(req.path)) {
            return next()
        }

        try {
            const token = req.get("Authorization").split('Bearer ')
            const payload = verifyJWT(token[1])

            // invalid header value or bad JWT
            if (token[0] !== "" || !token[1]) {
                throw new Error("Unauthorized request or bad/missing JWT");
            }

            // jwt is valid
            const prisma = new PrismaClient({ log: ['query'] })
            const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, email: true, role: true } })
            console.log({ user })
            req.user = user
            return next()

        } catch (error) {
            return res.status(status.Unauthorized).send({ message: 'Unauthorized request or bad/missing JWT' })
        }

    }
}