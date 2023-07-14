const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../db/conn");
const usuario = require("./tb_usuario");

const Video = conn.define(
  "tb_video",
  {
    id_video: {
      type: DataTypes.STRING(),
      defaultValue: DataTypes.UUIDV4(),
      allowNull: false,
      primaryKey: true,
    },
    video: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    thumb: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    cor: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    corBar: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    corText: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  { freezeTableName: true }
);



Video.belongsTo(usuario, {
  foreignKey: "id_user",
  constraints: true,
  foreignKeyConstraint: "id_user",
});

module.exports = Video;
