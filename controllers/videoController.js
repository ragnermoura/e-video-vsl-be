const Video = require('../models/tb_videos');

// Obtém todos os status
const obterVideos = async (req, res, next) => {
  try {
    const videos = await Video.findAll();
    return res.status(200).send({ response: videos });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Obtém um Video por ID
const obterVideoPorIdUser = async (req, res, next) => {
  try {
    const { id_user } = req.params
    const videos = await Video.findAll({
      where: {
        id_user
      }
    });
    if (!videos) {
      return res.status(404).send({ mensagem: 'videos não encontrados' });
    }
    return res.status(200).send({ response: videos });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const obterVideoPorId = async (req, res, next) => {
  try {
    const { id_video } = req.params
    const videos = await Video.findOne({
      where: {
        id_video
      }
    });
    if (!videos) {
      return res.status(404).send({ mensagem: 'videos não encontrados' });
    }
    return res.status(200).send({ response: videos });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
// Cadastra um novo Video
const cadastrarVideos = async (req, res, next) => {
  try {
    const { id, cor, text , corBarra, corText} = req.body

    if(!id){
      return res.status(422).json({
        success: false,
        messsage: 'O id é um campo obrigatório'
      })
    }

    if(!cor){
      return res.status(422).json({
        success: false,
        messsage: 'A cor é um campo obrigatório'
      })
    }
    if(!corBarra){
      return res.status(422).json({
        success: false,
        messsage: 'A cor é um campo obrigatório'
      })
    }
    if(!corText){
      return res.status(422).json({
        success: false,
        messsage: 'A cor é um campo obrigatório'
      })
    }

    if(!text){
      return res.status(422).json({
        success: false,
        messsage: 'O texto é um campo obrigatório'
      })
    }

    const { filename } = req.file
        
    const video = {
      id_user: id, 
      video: `https://api.evideovsl.com.br/videos/${filename}`,
      cor,
      text,
      corBar: corBarra,
      corText: corText,
    }
    console.log('body', video)
    const novoVideo = await Video.create(video);
    return res.status(201).send({
      success: true,
      mensagem: 'Video cadastrado com sucesso!',
      video: novoVideo,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: error.message });
  }
};

const uploadImage = async (req, res, next) => {
  const { id_video } = req.params

    const { filename } = req.file
    const update = {
      thumb: `http://localhost:3000/thumbs/${filename}`
    }
    await Video.update(update, {
      where: {
        id_video
      }
    })

    return res.status(201).send({
      success: true,
      mensagem: 'Imagem cadastrada com sucesso!',
    });

}

// Edita um video existente
const editarVideo = async (req, res, next) => {
  try {
    const videos = await Video.findByPk(req.body.id_video);
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
    const videos = await Video.findByPk(req.body.id_video);
    if (!videos) {
      return res.status(404).send({ mensagem: 'Video não encontrado' });
    }
    await videos.destroy();
    return res.status(202).send({
      mensagem: 'Video excluído com sucesso!',
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
  uploadImage,
  obterVideoPorId
};