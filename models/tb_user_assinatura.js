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
    id_assinatura: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    id_plano: {
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

Assinatura_User.belongsTo(Plano, {
  foreignKey: 'id_plano_sistema',
  constraints: true,
  foreignKeyConstraint: 'id_plano_sistema',

})

module.exports = Assinatura_User;
