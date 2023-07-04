const  Videos  = require('../models/tb_videos');

// Obtém todos os status
const obterVideos = async (req, res, next) => {
  try {
    const videos = await Videos.findAll();
    return res.status(200).send({ response: videos });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Obtém um Video por ID
const obterVideoPorIdUser = async (req, res, next) => {
  try {
    const videos = await Videos.findByPk(req.params.id_user);
    if (!videos) {
      return res.status(404).send({ mensagem: 'Status não encontrado' });
    }
    return res.status(200).send({ response: videos });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
// Cadastra um novo Video
const cadastrarVideos = async (req, res, next) => {
  try {
    const novoVideo = await Status.create(req.body);
    return res.status(201).send({
      mensagem: 'Video cadastrado com sucesso!',
      video: novoVideo.video,
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Edita um video existente
const editarVideo = async (req, res, next) => {
  try {
    const videos = await Videos.findByPk(req.body.id_video);
    if (!videos) {
      return res.status(404).send({ mensagem: 'Video não encontrado' });
    }
    await videos.update(req.body);
    return res.status(200).send({
      mensagem: 'Dados do Video atualizados com sucesso!',
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Exclui um video existente
const excluirVideo = async (req, res, next) => {
  try {
    const videos = await Videos.findByPk(req.body.id_video);
    if (!videos) {
      return res.status(404).send({ mensagem: 'Videos não encontrado' });
    }
    await videos.destroy();
    return res.status(202).send({
      mensagem: 'Videos excluído com sucesso!',
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  obterVideos,
  obterVideoPorIdUser,
  cadastrarVideos,
  editarVideo,
  excluirVideo,
};