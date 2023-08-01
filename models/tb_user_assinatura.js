const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../db/conn");
const usuario = require("./tb_usuario");
const Plano = require("./tb_planos");

const Assinatura_User = conn.define(
  "usuario_assinatura",
  {
    id_usuario_assinatura: {
      type: DataTypes.STRING(),
      defaultValue: DataTypes.UUIDV4(),
      allowNull: false,
      primaryKey: true,
    },
  plano: {
    type: DataTypes.STRING(),
    allowNull: false
  },
    nome_plano: {
        type: DataTypes.STRING(),
      allowNull: false,
    },
    nome_plano_marketPlace: {
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



Assinatura_User.belongsTo(usuario, {
  foreignKey: "id_user",
  constraints: true,
  foreignKeyConstraint: "id_user",
});

module.exports = Assinatura_User;
