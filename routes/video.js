const routes = require('express').Router()

const { ListObjectsCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const VideoController = require('../controllers/videoController')
const s3Client = require('../helpers/awsS3')
const { imageUpload } = require('../helpers/img-upload')
const { videoUpload } = require('../helpers/video-upload')
const Plano = require('../models/tb_planos')
const Assinatura_User = require('../models/tb_user_assinatura')
const Video = require('../models/tb_videos')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')

const handleAwsS3 = async(req, res ) => { 

  const bucketName = 'evideovsl'
const {text} = req.body
  const params = {
    Bucket: "evideovsl", // The name of the bucket. For example, 'sample-bucket-101'.
    Key: "sample_upload.txt", // The name of the object. For example, 'sample_upload.txt'.
    Body: `${text|| 'olá mundo'}`, // The content of the object. For example, 'Hello world!".
  };

  const listObjParams = {Bucket: bucketName}

/* 
  await s3Client.send(new ListObjectsCommand(listObjParams)).then((data ) => {
    console.log('Objetos no bucket', data)
    return res.status(200).json({data})
  }) .catch((error) => {
    console.error("Error:", error);
  }); */

  try {
    const results = await s3Client.send(new PutObjectCommand(params));
    console.log(
        "Successfully created " +
        params.Key +
        " and uploaded it to " +
        params.Bucket +
        "/" +
        params.Key
    );
    return res.status(200).json({results}); // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }


 }

 async function uploadImageToS3(imageData, req) {
  try {
    const params = {
      Bucket: "evideovsl", 
      Key:  `${req.file.key.split('.mp4').join('')}_frame.jpg`,
      Body: imageData,
      ACL: 'public-read'
    };

    await s3Client.send(new PutObjectCommand(params));
    console.log('Imagem enviada com sucesso para o Amazon S3!');
  } catch (error) {
    console.error('Erro ao enviar a imagem para o Amazon S3:', error);
  }
}
 
 
 const handleSavePrint = async (req, res, next) => {
  try {
    console.log('salvando print')
    const videoS3Path = `https://evideovsl.s3.sa-east-1.amazonaws.com/${req.file.key.split(' ').join('+')}`;
    const imageData = await new Promise((resolve, reject) => {
      ffmpeg(videoS3Path)
        .screenshots({
          count: 1,
          timestamps: ['00:00:00'], // Timestamp do frame inicial
          filename: 'image.jpg',
        })
        .on('error', (err) => {
          console.error('Erro ao extrair o frame inicial:', err);
          reject(err);
        })
        .on('end', () => {
          console.log('Extração do frame inicial concluída!');
          // Leitura do arquivo de imagem extraído em memória
          const fileContent = fs.readFileSync('image.jpg');
          resolve(fileContent);
        });
    });

    // Chama a função para enviar a imagem para o S3
    await uploadImageToS3(imageData, req);

    fs.unlinkSync('image.jpg');
    next()
    // Apaga o arquivo de imagem temporário após o envio para o S3
  } catch (error) {
    console.error('Erro durante o processo:', error);
  }
}


const verifyVideoUser = async(req,res,next) => {
    const {id_user} = req.params
    const data = await Video?.findAll({where: {
      id_user: id_user
    }})

    res.status(200).json({success: true, message: 'seus videos', video: data})
}

const upload = videoUpload.single('video')
routes.get('/get/:id_user', VideoController.obterVideoPorIdUser)
routes.post('/get-aws', handleAwsS3)
routes.get('/get-by-id/:id_video', VideoController.obterVideoPorId)
routes.post('/upload-video/:id_user', /* verifyVideoUser, */  upload, handleSavePrint,VideoController.cadastrarVideos)
routes.patch('/upload-image/:id_video', imageUpload.single('thumb'), VideoController.uploadImage)
routes.patch('/upload/:id_video', VideoController.updateVideos)
routes.delete('/delete/:id_video', VideoController.excluirVideo)
routes.get('/streaming/:id_video', VideoController.streamingVideo)
module.exports = routes