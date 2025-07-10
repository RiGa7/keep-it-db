import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import pg from 'pg';
const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 10000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-render-url.onrender.com' 
      : 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }));
app.use(express.json());

app.get('/notes', async (req, res) => {
    try {
        console.log('Fetching notes...'); 
        const { rows } = await pool.query('SELECT * FROM notes ORDER BY created_at DESC');
        console.log('Fetched notes:', rows.length); 
        res.json(rows);
    } catch (err) {
        console.error('Error in GET /notes:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

app.post('/notes', async (req, res) => {
    const { title, content } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
            [title, content]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const { rows } = await pool.query(
            'UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *',
            [title, content, id]
        );
        if (rows.length === 0) return res.status(404).send('Note not found');
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM notes WHERE id = $1', [id]);
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));