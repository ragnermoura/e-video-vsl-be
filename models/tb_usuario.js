const { Sequelize, DataTypes } = require("sequelize");

const conn = require("../db/conn");
const Usuario = conn.define(
  "tb_usuarios",
  {
    id_user: {
      type: DataTypes.STRING(),
      defaultValue: DataTypes.UUIDV4(),
      allowNull: false,
      primaryKey: true,
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sobrenome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nivel: {
      type: Sequelize.STRING,
      defaultValue: 'C',
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'A',
      allowNull: true,
    },
  },
  { freezeTableName: true }
);


module.exports = Usuario;
