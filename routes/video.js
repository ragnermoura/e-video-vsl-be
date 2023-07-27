const routes = require('express').Router()

const { ListObjectsCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const VideoController = require('../controllers/videoController')
const s3Client = require('../helpers/awsS3')
const { imageUpload } = require('../helpers/img-upload')
const { videoUpload } = require('../helpers/video-upload')
const Plano = require('../models/tb_planos')
const Assinatura_User = require('../models/tb_user_assinatura')
const Video = require('../models/tb_videos')

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

const upload = videoUpload.single('video')
routes.get('/get/:id_user', VideoController.obterVideoPorIdUser)
routes.post('/get-aws', handleAwsS3)
routes.get('/get-by-id/:id_video', VideoController.obterVideoPorId)
routes.post('/upload-video', upload , VideoController.cadastrarVideos)
routes.patch('/upload-image/:id_video', imageUpload.single('thumb'), VideoController.uploadImage)
routes.patch('/upload/:id_video', imageUpload.single('thumb'), VideoController.updateVideos)
routes.get('/streaming/:id_video', VideoController.streamingVideo)
module.exports = routes