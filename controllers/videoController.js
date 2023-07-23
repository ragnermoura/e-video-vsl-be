const Video = require('../models/tb_videos');
const fs = require('fs')
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

const streamingVideo = async (req, res, next) => {

const range = req.headers.range;
const {id_video} = req.params
if(!range){
  return res.status(400).json({message: 'É necessário o envio do range'})
}
if(!id_video){
  return res.status(400).json({message: 'É necessário o envio do id do video'})
}

const videos = await Video.findOne({
  where: {
    id_video
  }
});
if (!videos) {
  return res.status(404).send({ mensagem: 'videos não encontrados' });
}


const videoPath = videos.video
const videoSize = fs.statSync(videoPath).size
console.log(videoSize)

const CHUNK_SIZE = 10**6

const start = Number(range.replace(/\D/g, ""))
const end = Math.min(start + CHUNK_SIZE, videoSize -1)

const contentLength = end - start + 1

const headers = {
  "Content-Range": `bytes ${start}-${end}/${videoSize}`,
  "Accept-Ranges": "bytes",
  "Content-Length": contentLength,
  "Content-Type": "video/mp4" 
}

res.writeHead(206, headers)

const videoStream = fs.createReadStream(videoPath, {start, end});

videoStream.pipe(res)


}
// Cadastra um novo Video
const cadastrarVideos = async (req, res, next) => {
  try {
    const { id, cor, textInferior, textSuperior , corBarra, corText} = req.body

    if(!id){
      return res.status(422).json({
        success: false,
        message: 'O id é um campo obrigatório'
      })
    }

    if(!cor){
      return res.status(422).json({
        success: false,
        message: 'A cor é um campo obrigatório'
      })
    }
    if(!corBarra){
      return res.status(422).json({
        success: false,
        message: 'A cor da barra é um campo obrigatório'
      })
    }
    if(!corText){
      return res.status(422).json({
        success: false,
        message: 'A cor é um campo obrigatório'
      })
    }

   

    const { filename, originalname } = req.file
        console.log(originalname.split('.mp4').join(''))
    const video = {
      id_user: id, 
      video: `public/videos/${filename}`,
      cor,
      nomeVideo: originalname.split('.mp4').join(''),
      textSuperior,
      textInferior,
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

const updateVideos = async (req, res, next) => {
  try {
    const { id_video, cor, textInferior, textSuperior , corBarra, corText} = req.body

    if(!cor){
      return res.status(422).json({
        success: false,
        message: 'A cor é um campo obrigatório'
      })
    }
    if(!corBarra){
      return res.status(422).json({
        success: false,
        message: 'A cor é um campo obrigatório'
      })
    }
    if(!corText){
      return res.status(422).json({
        success: false,
        message: 'A cor é um campo obrigatório'
      })
    }

   

    const { filename } = req.file
        
    const video = {
      cor,
      textSuperior,
      textInferior,
      corBar: corBarra,
      thumb: `https://api.evideovsl.com.br/thumbs/${filename}`,
      corText: corText,
    }
    console.log('body', video)
    const novoVideo = await Video.update(video, {
      where: {
        id_video: id_video
      }
    });
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
      thumb: `https://api.evideovsl.com.br/thumbs/${filename}`
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
  updateVideos,
  excluirVideo,
  uploadImage,
  obterVideoPorId,
  streamingVideo
};