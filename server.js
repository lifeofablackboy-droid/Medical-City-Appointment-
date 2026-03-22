import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

// Fallback to support the initial international patient portal
app.use('/api', patientRoutes);

app.listen(PORT, async () => {
    console.log(`Medical City Advanced Backend running on http://localhost:${PORT}`);
    try {
        // Initialize SQLite Database
        await initDb();
    } catch (err) {
        console.error('Failed to initialize database:', err);
    }
});
