const Curso = require('../models/curso');

class CursoRepository {
  async obtenerTodos() {
    return await Curso.findAll();
  }

  async crear(datos) {
    return await Curso.create(datos);
  }
}

module.exports = new CursoRepository();