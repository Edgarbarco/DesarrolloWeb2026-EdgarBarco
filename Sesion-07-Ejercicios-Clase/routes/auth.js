const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();

router.post('/registro', async (req, res) => {
  try {
    const { email, password } = req.body;
    const passwordHasheada = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      email,
      password: passwordHasheada
    });

    res.status(201).json({ mensaje: 'Usuario registrado con éxito', id: usuario.id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'secreto_jwt',
      { expiresIn: '1h' }
    );

    res.json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
});

module.exports = router;