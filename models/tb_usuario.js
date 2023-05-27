const { Sequelize, DataTypes } = require("sequelize");

const conn = require("../db/conn");

const nivel = require("./tb_nivel");


const Usuario = conn.define(
  "tb_usuarios",
  {
    id_user: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
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
    id_nivel: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    id_status: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);



Usuario.belongsTo(nivel, {
  foreignKey: "id_nivel",
  constraints: true,
  foreignKeyConstraint: "id_nivel",
});




module.exports = Usuario;
