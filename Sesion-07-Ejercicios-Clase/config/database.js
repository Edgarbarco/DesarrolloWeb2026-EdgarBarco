const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://usuario:password@localhost:5432/mibase',
  {
    logging: false
  }
);

module.exports = sequelize;
