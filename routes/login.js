require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/tb_usuarios");

router.post("/", (req, res, next) => {
  Usuario.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (!user) {
        return res.status(401).send({
          mensagem: "Falha na autenticação.",
        });
      }
      bcrypt.compare(req.body.senha, user.senha, (err, result) => {
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
              senha: user.senha,
              id_nivel: user.id_nivel,
              id_status: user.id_status,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "6h",
            }
          );

          return res.status(200).send({
            mensagem: "Autenticado com sucesso!",
            token: token,
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