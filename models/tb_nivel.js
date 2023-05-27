const { Sequelize, DataTypes } = require('sequelize');
const conn = require('../db/conn')

const Nivel = conn.define('tb_nivel', {
    id_nivel: {
    type:DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  nivel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
},{ freezeTableName: true });

module.exports = Nivel;