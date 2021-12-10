import express, { Response } from 'express'
import { Login } from './controllers/auth';
import { CreateCalendar, DeleteCalendar, GetAllCalendars, GetCalendarById, UpdateCalendar } from './controllers/calendar';
import { CreateUser, DeleteUser, GetAllUsers, GetUserById, GetUserWithCalendars, UpdateUser, UpdateUserCalendars } from './controllers/user';

const router = express.Router();

router
    // public routes
    .get('/healthcheck', async (_, res: Response) => {
        return res.status(200).send('OK');
    })
    .post('/login', Login)
    // user routes
    .get('/users', GetAllUsers)
    .get('/user/:id', GetUserById)
    .post('/user', CreateUser)
    .put('/user', UpdateUser)
    .delete('/user', DeleteUser)
    .get('/user/:id/calendar', GetUserWithCalendars)
    .put('/user/calendar', UpdateUserCalendars)

    // calendar routes
    .get('/calendars', GetAllCalendars)
    .get('/calendar/:id', GetCalendarById)
    .post('/calendar', CreateCalendar)
    .put('/calendar', UpdateCalendar)
    .delete('/calendar', DeleteCalendar)


export default router;