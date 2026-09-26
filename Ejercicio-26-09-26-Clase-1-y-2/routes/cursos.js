const express = require('express');
const { body, validationResult } = require('express-validator');
const cursoRepository = require('../repositories/CursoRepository');
const authJWT = require('../middlewares/authJWT');
const logService = require('../services/logService');

const router = express.Router();

const validarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

// GET /cursos
router.get('/', async (req, res) => {
  try {
    const cursos = await cursoRepository.obtenerTodos();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar cursos', error: error.message });
  }
});

// POST /cursos
router.post(
  '/',
  authJWT,
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('codigo').notEmpty().withMessage('El código es obligatorio'),
    body('creditos').isInt({ min: 1 }).withMessage('Los créditos deben ser un número mayor a 0'),
    validarErrores
  ],
  async (req, res) => {
    try {
      const nuevoCurso = await cursoRepository.crear(req.body);

      // Log Fire-and-Forget (sin await)
      logService.registrarAccion(`Curso '${nuevoCurso.nombre}' (${nuevoCurso.codigo}) creado.`)
        .catch(err => {
          console.error('[Error de Log - Fire and Forget]:', err.message);
        });

      res.status(201).json(nuevoCurso);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear el curso', error: error.message });
    }
  }
);

module.exports = router;