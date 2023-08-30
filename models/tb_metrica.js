const { Sequelize, DataTypes } = require("sequelize");
const conn = require("../db/conn");
const Video = require("./tb_videos");

const Metrica = conn.define(
  "tb_metrica",
  {
    id_metrica: {
      type: DataTypes.STRING(),
      defaultValue: DataTypes.UUIDV4(),
      allowNull: false,
      primaryKey: true,
    },
    view: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      require: false,
    },
    uniqueView: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      require: false,
    },
    play: {
         type: DataTypes.BOOLEAN, 
         defaultValue: false, 
         require: false 
        },
    uniquePlay: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      require: false,
    },
  },
  { freezeTableName: true }
);

Metrica.belongsTo(Video, {
  foreignKey: "id_video",
  constraints: true,
  foreignKeyConstraint: "id_video",
});

module.exports = Metrica;
