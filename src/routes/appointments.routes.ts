import { Router } from "express";

import { parseISO } from 'date-fns'
import AppointmentsRepository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from "../service/CreateAppointmentService";
import { getCustomRepository } from "typeorm";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();
    return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
    try {
        const { provider_id, date } = request.body;

        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentService();

        const appointment = await createAppointment.execute({
            provider_id: provider_id,
            date: parsedDate
        })

        return response.json(appointment);

    } catch (err) {
        if (err instanceof Error) {
            return response.status(400).json({ error: err.message })
        }

    }
})

export default appointmentsRouter;


