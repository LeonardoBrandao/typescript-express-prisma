import { signJWT } from '../auth/jwt'
import { Request, Response } from 'express'
import { PrismaClient } from '.prisma/client'
import { compareHash } from '../auth/password'
import { HttpStatusCode as status } from '../utils/httpStatusCodes';

const prisma = new PrismaClient({ log: ['query'] })

export async function Login(req: Request, res: Response): Promise<object> {
    const { email, password }: { email: string, password: string } = req.body
    try {
        const user: { id: number, password: string } = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                password: true
            }
        })

        if (user === null) {
            throw new Error("user does not exist")
        }

        const match: boolean = await compareHash(password, user.password)

        if (match) {
            const token: string = signJWT({ userId: user.id })
            return res.status(status.Ok).send({ token })
        }

        // password does not match
        return res.status(status.Unauthorized).send({ message: 'Unauthorized' })

    } catch (error) {
        console.log(error)

        // cannot find user in db
        if (error.message === "user does not exist") {
            return res.status(status.Unauthorized).send({ message: 'Unauthorized' })
        }

        // catch all error
        return res.status(status.InternalServerError).send({ message: 'internal server error' })

    }
}