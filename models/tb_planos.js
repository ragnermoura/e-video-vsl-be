const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../db/conn");

const Plano = conn.define(
  "plano",
  {
    id_plano_sistema: {
      type: DataTypes.STRING(),
      defaultValue: DataTypes.UUIDV4(),
      allowNull: false,
      primaryKey: true,
    },
    id_plano_pagarme: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    nome_plano: {
        type: DataTypes.STRING(),
      allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING(),
      allowNull: false,
    },
    preco: {
        type: DataTypes.STRING(),
      allowNull: false,
    },
    limit: {
        type: DataTypes.INTEGER,
      allowNull: false,
    },
    metodos_pagamento: {
        type: DataTypes.STRING(),
      allowNull: false,
    },
    date_created: {
        type: DataTypes?.DATE(),
        defaultValue: DataTypes.NOW()
    }
  },
  { freezeTableName: true }
);

module.exports = Plano;
