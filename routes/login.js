require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/tb_usuario");

router.post("/", async (req, res, next) => {
  await Usuario.findOne({ where: { email: req.body.email } })
    .then( async user => {
      if (!user) {
        return res.status(401).send({
          mensagem: "Falha na autenticação.",
        });
      }
      bcrypt.compare(req.body.senha, user.senha, async (err, result) => {
        if (err) {
          return res.status(401).send({ mensagem: "Falha na autenticação." });
        }
        if (result) {
          const token = jwt.sign(
            {
              id_user: user.id_user,
              nome: user.nome,
              sobrenome: user.sobrenome,
              email: user.email,
              nivel: user.nivel,
              status: user.status,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "6h",
            }
          );

      return res.status(200).send({
        success: true,
        mensagem: "Autenticado com sucesso!",
        token: token,
        user_id: user.id_user,
        name: user?.nome
      });
  }
        return res.status(401).send({ mensagem: "Falha na autenticação." });
      });
    })
    .catch(error => {
      return res.status(500).send({ error: error });
    });
});

module.exports = router;