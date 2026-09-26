const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');

const authRoutes = require('./routes/auth');
const cursosRoutes = require('./routes/cursos');

const app = express();
app.use(express.json());

// Pool de conexión a PostgreSQL para manejar sesiones
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://usuario:password@localhost:5432/mibase'
});

// Configuración de Sesiones guardadas en PostgreSQL (Sobreviven al reinicio del servidor)
app.use(session({
  store: new pgSession({
    pool: pgPool,
    tableName: 'session', 
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'secreto_sesion',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } 
}));

// Montar Rutas
app.use('/auth', authRoutes);
app.use('/cursos', cursosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});