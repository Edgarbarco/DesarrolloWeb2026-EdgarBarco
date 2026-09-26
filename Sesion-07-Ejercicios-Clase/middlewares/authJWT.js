const jwt = require('jsonwebtoken');

const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Acceso no autorizado: Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_jwt');
    req.usuario = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};

module.exports = authJWT;
