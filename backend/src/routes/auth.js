const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { generateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = generateToken(user.id);
    logger.info('User Login', { userId: user.id, email });

    res.json({ token, user: user.toJSON() });
  } catch (err) {
    logger.error('Login Error', { error: err.message });
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /users (Register) — matches the frontend contract
router.post('/', async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body.user || req.body;

    if (!name || !email || !password) {
      return res.status(422).json({ errors: ['Nome, e-mail e senha são obrigatórios.'] });
    }

    if (password !== password_confirmation) {
      return res.status(422).json({ errors: ['As senhas não coincidem.'] });
    }

    if (password.length < 6) {
      return res.status(422).json({ errors: ['A senha deve ter no mínimo 6 caracteres.'] });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(422).json({ errors: ['E-mail já está em uso.'] });
    }

    const user = await User.create({
      name,
      email,
      password_digest: password, // hook will hash it
    });

    const token = generateToken(user.id);
    logger.info('User Registered', { userId: user.id, email });

    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    logger.error('Register Error', { error: err.message });
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({ errors: err.errors.map((e) => e.message) });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
