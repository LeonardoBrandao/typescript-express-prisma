import { Response } from 'express'
import { Request } from "../utils/interfaces";
import { PrismaClient, Prisma, User as PrismaUser } from '@prisma/client'
import { HttpStatusCode as status } from '../utils/httpStatusCodes';
import { hashPassword } from '../auth/password';
import { User } from '../utils/interfaces';

const prisma = new PrismaClient({ log: ['query'] })

export async function GetUser(req: Request, res: Response) {
    const user: User = req.user
    return res.status(status.Ok).send(user)
}

export async function GetAllUsers(req: Request, res: Response) {
    const users: User[] = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
        }
    })
    return res.status(status.Ok).send(users)
}

export async function GetUserById(req: Request, res: Response) {
    const { id } = req.params
    const user: User = await prisma.user.findUnique({
        where: {
            id: parseInt(id)
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
        }
    })
    if (user === null) {
        return res.status(status.NotFound).send({ message: "user not found" })
    }
    return res.status(status.Ok).send(user)
}

export async function CreateUser(req: Request, res: Response) {
    const { username, email, password, role } = req.body
    const hash = await hashPassword(password)
    try {
        let user: PrismaUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hash,
                role,
            }
        })
        delete user.password
        return res.status(status.Created).send({ message: 'user created', user })
    } catch (error) {
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return res.status(status.BadRequest).send({ message: "email already exists" })
            }
        }
        return res.status(status.InternalServerError).send({ message: "unknown error" })
    }
}

export async function UpdateUser(req: Request, res: Response) {
    const { id, username, email, password, role } = req.body
    let user: PrismaUser = await prisma.user.update({
        where: { id },
        data: {
            username,
            email,
            password,
            role
        }
    })

    // remove user password from response
    delete user.password

    return res.status(status.Ok).send(user)
}

export async function DeleteUser(req: Request, res: Response) {
    const { id } = req.body
    await prisma.user.delete({
        where: { id },
    })
    return res.status(status.Ok).send({ message: "user deleted successfully" })
}


// export async function GetUserWithCalendars(req: Request, res: Response) {
//     const { id } = req.params
//     const userWithCalendars = await prisma.user.findUnique({
//         where: {
//             id: parseInt(id)
//         },
//         include: {
//             calendars: true,
//         }
//     })
//     if (userWithCalendars === null) {
//         return res.status(status.NotFound).send({ message: "user not found" })
//     }

//     // remove user password from response
//     delete userWithCalendars.password

//     return res.status(status.Ok).send(userWithCalendars)
// }


// /**
// * Links a calendar to a user.

// * If calendar does not exist, create it first and then link it
// **/
// export async function UpdateUserCalendars(req: Request, res: Response) {
//     const { id, calendar } = req.body
//     let user: PrismaUser = await prisma.user.update({
//         where: { id },
//         data: {
//             calendars: {
//                 connectOrCreate: {
//                     create: {
//                         name: calendar.name
//                     },
//                     where: {
//                         id: calendar.id
//                     }
//                 }
//             }
//         },
//         include: {
//             calendars: true
//         }
//     })

//     // remove user password from response
//     delete user.password

//     return res.status(status.Ok).send(user)
// }
