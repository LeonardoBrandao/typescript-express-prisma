import { Response } from 'express'
import { Request } from "../utils/interfaces";
import { PrismaClient, Prisma, Calendar } from '@prisma/client'
import { HttpStatusCode as status } from '../utils/httpStatusCodes';

const prisma = new PrismaClient({ log: ['query'] })

export async function GetAllCalendars(req: Request, res: Response) {
    const calendars: Calendar[] = await prisma.calendar.findMany()
    return res.status(status.Ok).send(calendars)
}

export async function GetCalendarById(req: Request, res: Response) {
    const { id } = req.params
    const calendar: Calendar = await prisma.calendar.findUnique({ where: { id: parseInt(id) } })
    if (calendar === null) {
        return res.status(status.NotFound).send({ message: "calendar not found" })
    }
    return res.status(status.Ok).send(calendar)
}

export async function CreateCalendar(req: Request, res: Response) {
    const { name } = req.body
    try {
        let calendar: Calendar = await prisma.calendar.create({
            data: {
                name
            }
        })
        return res.status(status.Created).send(calendar)
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

export async function UpdateCalendar(req: Request, res: Response) {
    const { id, name } = req.body
    let calendar: Calendar = await prisma.calendar.update({
        where: { id },
        data: {
            name
        }
    })
    return res.status(status.Ok).send(calendar)
}

export async function DeleteCalendar(req: Request, res: Response) {
    const { id } = req.body
    await prisma.calendar.delete({
        where: { id },
    })
    return res.status(status.Ok).send({ message: "calendar deleted successfully" })
}