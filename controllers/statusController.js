const  Status  = require('../models/tb_status');

// Obtém todos os status
const obterStatus = async (req, res, next) => {
  try {
    const status = await Status.findAll();
    return res.status(200).send({ response: status });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Obtém um status por ID
const obterStatusPorId = async (req, res, next) => {
  try {
    const status = await Status.findByPk(req.params.id_status);
    if (!status) {
      return res.status(404).send({ mensagem: 'Status não encontrado' });
    }
    return res.status(200).send({ response: status });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Cadastra um novo status
const cadastrarStatus = async (req, res, next) => {
  try {
    const novoStatus = await Status.create(req.body);
    return res.status(201).send({
      mensagem: 'Status cadastrado com sucesso!',
      id_status: novoStatus.id_status,
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Edita um status existente
const editarStatus = async (req, res, next) => {
  try {
    const status = await Status.findByPk(req.body.id_status);
    if (!status) {
      return res.status(404).send({ mensagem: 'Status não encontrado' });
    }
    await status.update(req.body);
    return res.status(200).send({
      mensagem: 'Dados do status atualizados com sucesso!',
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Exclui um status existente
const excluirStatus = async (req, res, next) => {
  try {
    const status = await Status.findByPk(req.body.id_status);
    if (!status) {
      return res.status(404).send({ mensagem: 'Status não encontrado' });
    }
    await status.destroy();
    return res.status(202).send({
      mensagem: 'Status excluído com sucesso!',
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  obterStatus,
  obterStatusPorId,
  cadastrarStatus,
  editarStatus,
  excluirStatus,
};