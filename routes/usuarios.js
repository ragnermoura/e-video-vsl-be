require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
require("dotenv").config();
const Usuario = require('../models/tb_usuarios');
const { imageUpload} = require("../helpers/img-upload");

router.get('/', async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll();
    return res.status(200).send({ response: usuarios });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.get('/:id_user', async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id_user);
    if (!usuario) {
      return res.status(404).send({ mensagem: 'Usuário não encontrado.' });
    }
    return res.status(200).send({ response: usuario });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.delete('/delete', async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.body.id_user);
    if (!usuario) {
      return res.status(404).send({ mensagem: 'Usuário não encontrado.' });
    }
    await usuario.destroy();
    return res.status(202).send({ mensagem: 'Usuário excluído com sucesso!' });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});


router.patch('/:id_user', async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id_user);
    if (!usuario) {
      return res.status(404).send({ mensagem: 'Usuário não encontrado.' });
    }
    usuario.nome = req.body.nome;
    usuario.sobrenome = req.body.sobrenome;
    usuario.email = req.body.email;
    usuario.senha = senhaHash;
    usuario.cpf = req.body.cpf;
    usuario.id_nivel = req.body.nivel;
    usuario.id_status = req.body.status;
    usuario.avatar = req.file.filename;

    await usuario.save();

    return res.status(200).send({ mensagem: 'Usuário atualizado com sucesso.', response: usuario });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});
router.post("/cadastro", imageUpload.single('imagem'), async (req, res, next) => {
  try {
    const usuario = await Usuario.findOne({
      where: { email: req.body.email },
    });

    if (usuario) {
      return res.status(409).send({
        mensagem:
          "Email já cadastrado, por favor insira um email diferente!",
      });
    }

    const senhaHash = await bcrypt.hash(req.body.senha, 10);

    const novoUsuario = await Usuario.create({
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      email: req.body.email,
      senha: senhaHash,
      cpf: req.body.cpf,
      id_nivel: req.body.nivel,
      id_status: req.body.status,
      avatar: req.file.filename,
    });

    const response = {
      dados: {
        mensagem: "Usuário cadastrado com sucesso",
        usuarioCriado: {
          id_user: novoUsuario.id_user,
          nome: novoUsuario.nome,
          sobrenome: novoUsuario.sobrenome,
          email: novoUsuario.email,
          nivel: novoUsuario.id_nivel,
          request: {
            tipo: "GET",
            descricao: "Pesquisa um usuário",
          },
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error });
  }
});
  

  (module.exports = router);
