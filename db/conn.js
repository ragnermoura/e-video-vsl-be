const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});
try {
    sequelize.authenticate()
    console.log('Success connect');
    
} catch (error) {
    console.error(error);
}

module.exports = sequelize