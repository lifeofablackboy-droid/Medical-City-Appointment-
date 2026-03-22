import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Register International Patient/Appointment
router.post('/register-international', async (req, res) => {
    try {
        const { firstName, lastName, country, passport, specialty, arrivalDate } = req.body;
        
        if (!firstName || !lastName || !country || !passport) {
            return res.status(400).json({ error: 'Missing required details.' });
        }

        const appointmentId = await db.appointments.create({
            firstName, 
            lastName, 
            country, 
            passport, 
            specialty, 
            arrivalDate
        });

        res.status(201).json({ 
            success: true, 
            message: 'Appointment booking request successfully saved to Database!',
            appointmentId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all appointments (Admin)
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await db.appointments.findAll();
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
