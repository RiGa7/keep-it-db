  import dotenv from 'dotenv';

dotenv.config();

import express from 'express';

import cors from 'cors';

import pg from 'pg';

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';



const { Pool } = pg;

const app = express();

const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET || 'keepit_fallback_secret';



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



// ─── Auth Middleware ────────────────────────────────────────────────────────



function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access token required' });



    try {

        const user = jwt.verify(token, JWT_SECRET);

        req.user = user;

        next();

    } catch {

        return res.status(403).json({ error: 'Invalid or expired token' });

    }

}



// ----------- Auth Routes ------

// Register

app.post('/auth/register', async (req, res) => {

    const { name, email, password, security_question, security_answer } = req.body;



    if (!name || !email || !password || !security_question || !security_answer) {

        return res.status(400).json({ error: 'All fields are required' });

    }



    try {

        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

        if (existing.rows.length > 0) {

            return res.status(409).json({ error: 'Email already in use' });

        }



        const passwordHash = await bcrypt.hash(password, 12);

        const answerHash = await bcrypt.hash(security_answer.trim().toLowerCase(), 12);



        const { rows } = await pool.query(

            `INSERT INTO users (name, email, password_hash, security_question, security_answer_hash)

             VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email`,

            [name, email, passwordHash, security_question, answerHash]

        );



        const user = rows[0];

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });



        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (err) {

        console.error('Register error:', err);

        res.status(500).json({ error: 'Server error' });

    }

});



// Login

app.post('/auth/login', async (req, res) => {

    const { email, password } = req.body;



    if (!email || !password) {

        return res.status(400).json({ error: 'Email and password are required' });

    }



    try {

        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (rows.length === 0) {

            return res.status(401).json({ error: 'Invalid email or password' });

        }



        const user = rows[0];

        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {

            return res.status(401).json({ error: 'Invalid email or password' });

        }



        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (err) {

        console.error('Login error:', err);

        res.status(500).json({ error: 'Server error' });

    }

});



// Forgot password — step 1: get security question for email

app.post('/auth/forgot-password/question', async (req, res) => {

    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });



    try {

        const { rows } = await pool.query('SELECT security_question FROM users WHERE email = $1', [email]);

        if (rows.length === 0) {

            return res.status(404).json({ error: 'No account found with this email' });

        }

        res.json({ security_question: rows[0].security_question });

    } catch (err) {

        console.error('Forgot password error:', err);

        res.status(500).json({ error: 'Server error' });

    }

});



// Forgot password — step 2: verify answer and reset password

app.post('/auth/forgot-password/reset', async (req, res) => {

    const { email, security_answer, new_password } = req.body;



    if (!email || !security_answer || !new_password) {

        return res.status(400).json({ error: 'All fields are required' });

    }



    try {

        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (rows.length === 0) {

            return res.status(404).json({ error: 'No account found with this email' });

        }



        const user = rows[0];

        const answerValid = await bcrypt.compare(security_answer.trim().toLowerCase(), user.security_answer_hash);

        if (!answerValid) {

            return res.status(401).json({ error: 'Incorrect security answer' });

        }



        const newHash = await bcrypt.hash(new_password, 12);

        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, user.id]);



        res.json({ message: 'Password reset successfully' });

    } catch (err) {

        console.error('Reset password error:', err);

        res.status(500).json({ error: 'Server error' });

    }

});



// ─── Notes Routes (protected) ───────────────────────────────────────────────



app.get('/notes', authenticateToken, async (req, res) => {

    try {

        const { rows } = await pool.query(

            'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',

            [req.user.id]

        );

        res.json(rows);

    } catch (err) {

        console.error('Error in GET /notes:', err);

        res.status(500).json({ error: 'Server error', details: err.message });

    }

});



app.post('/notes', authenticateToken, async (req, res) => {

    const { title, content, label, label_color } = req.body;

    try {

        const { rows } = await pool.query(

            'INSERT INTO notes (title, content, label, label_color, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',

            [title, content, label || null, label_color || null, req.user.id]

        );

        const newNote = rows[0];

        if (newNote.label) {

            await pool.query(

                'UPDATE notes SET label_color = $1 WHERE user_id = $2 AND label = $3',

                [newNote.label_color, req.user.id, newNote.label]

            );

        }

        res.json(newNote);

    } catch (err) {

        console.error(err);

        res.status(500).json({ error: 'Server error' });

    }

});



app.put('/notes/:id', authenticateToken, async (req, res) => {

    const { id } = req.params;

    const { title, content, label, label_color } = req.body;

    try {

        const { rows } = await pool.query(

            'UPDATE notes SET title = $1, content = $2, label = $3, label_color = $4 WHERE id = $5 AND user_id = $6 RETURNING *',

            [title, content, label || null, label_color || null, id, req.user.id]

        );

        if (rows.length === 0) return res.status(404).json({ error: 'Note not found' });

        const updatedNote = rows[0];

        if (updatedNote.label) {

            await pool.query(

                'UPDATE notes SET label_color = $1 WHERE user_id = $2 AND label = $3',

                [updatedNote.label_color, req.user.id, updatedNote.label]

            );

        }

        res.json(updatedNote);

    } catch (err) {

        console.error(err);

        res.status(500).json({ error: 'Server error' });

    }

});



app.delete('/notes/:id', authenticateToken, async (req, res) => {

    const { id } = req.params;

    try {

        await pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [id, req.user.id]);

        res.status(204).end();

    } catch (err) {

        console.error(err);

        res.status(500).json({ error: 'Server error' });

    }

});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));