const express = require("express");
const Nivel = require("../models/tb_nivel");

const obterNiveis = async (req, res, next) => {
  try {
    const niveis = await Nivel.findAll();
    return res.status(200).send({ response: niveis });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const obterNivelPorId = async (req, res, next) => {
  try {
    const nivel = await Nivel.findByPk(req.params.id_nivel);
    if (!nivel) {
      return res.status(404).send({ mensagem: "Nível não encontrado." });
    }
    return res.status(200).send({ response: nivel });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const excluirNivel = async (req, res, next) => {
  try {
    const nivel = await Nivel.findByPk(req.body.id_nivel);
    if (!nivel) {
      return res.status(404).send({ mensagem: "Nível não encontrado." });
    }
    await nivel.destroy();
    return res.status(202).send({ mensagem: "Nível excluído com sucesso!" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const cadastrarNivel = async (req, res, next) => {
  try {
    const novo = await Nivel.create({
      label: req.body.nivel,
      descricao: req.body.descricao,
    });

    const response = {
      dados: {
        mensagem: "Nível Cadastrado com sucesso",
        nivelCriado: {
          id_nivel: novo.id_nivel,
          label: novo.nivel,
          descricao: novo.descricao,
          request: {
            tipo: "GET",
            descricao: "Pesquisa um nivel",
          },
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error });
  }
};

const editarNivel = async (req, res, next) => {
  try {
    const nivel = await Nivel.findByPk(req.body.id_nivel);
    if (!nivel) {
      return res.status(404).send({ mensagem: "Nível não encontrado." });
    }
    nivel.nivel = req.body.nivel;
    await nivel.save();

    const response = {
      mensagem: "Nível atualizado com sucesso",
      nivelAtualizado: {
        id_nivel: nivel.id_nivel,
        label: nivel.nivel,
        request: {
          tipo: "GET",
          descricao: "Pesquisa um nível",
          url: `${req.protocol}://${req.get("host")}/nivel/${nivel.id_nivel}`,
        },
      },
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  obterNiveis,
  obterNivelPorId,
  excluirNivel,
  cadastrarNivel,
  editarNivel,
};  