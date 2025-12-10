// controllers/authController.js
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendEmail } from '../utils/sendEmail.js';
dotenv.config();

const SALT_ROUNDS = 10;

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    // check existing
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ message: 'Email already registered' });

    // hash password
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    // insert user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, is_verified) VALUES (?, ?, ?, ?)',
      [name, email, hashed, 0]
    );
    const userId = result.insertId;

    // send welcome email (non-blocking)
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to E-commerce App',
        html: `<p>Hi ${name},</p><p>Thanks for registering on our E-commerce app.</p>`
      });
    } catch (err) {
      console.warn('sendEmail error:', err.message);
    }

    const payload = { id: userId, name, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    return res.status(201).json({ token, user: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const [rows] = await pool.query('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    return res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getProtected = async (req, res) => {
  // example protected route:
  res.json({ user: req.user });
};
