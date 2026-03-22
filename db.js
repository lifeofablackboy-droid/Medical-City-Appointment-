import fs from 'fs/promises';
import { existsSync } from 'fs';

const DB_PATH = './medical_city_db.json';

export async function initDb() {
    if (!existsSync(DB_PATH)) {
        await fs.writeFile(DB_PATH, JSON.stringify({
            users: [],
            appointments: []
        }, null, 2));
        console.log('Robust JSON Database initialized successfully.');
    }
}

async function readDb() {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
}

async function writeDb(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// Pure JS ORM mimicking typical database structures
export const db = {
    users: {
        async findOne(query) {
            const data = await readDb();
            const keys = Object.keys(query);
            return data.users.find(u => keys.every(k => u[k] === query[k]));
        },
        async create(user) {
            const data = await readDb();
            const newUser = { 
                id: Date.now(), 
                ...user, 
                role: 'patient',
                created_at: new Date().toISOString() 
            };
            data.users.push(newUser);
            await writeDb(data);
            return newUser.id;
        }
    },
    appointments: {
        async findAll() {
            const data = await readDb();
            // Return newest first
            return data.appointments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        },
        async create(appointment) {
            const data = await readDb();
            const newAppt = { 
                id: Date.now(), 
                status: 'Pending', 
                ...appointment, 
                created_at: new Date().toISOString() 
            };
            data.appointments.push(newAppt);
            await writeDb(data);
            return newAppt.id;
        }
    }
};
