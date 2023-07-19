const routes = require('express').Router()

const VideoController = require('../controllers/videoController')
const { imageUpload } = require('../helpers/img-upload')
const { videoUpload } = require('../helpers/video-upload')
const Plano = require('../models/tb_planos')
const Assinatura_User = require('../models/tb_user_assinatura')
const Video = require('../models/tb_videos')


routes.get('/get/:id_user', VideoController.obterVideoPorIdUser)
routes.get('/get-by-id/:id_video', VideoController.obterVideoPorId)
routes.post('/upload-video',  videoUpload.single('video'), VideoController.cadastrarVideos)
routes.patch('/upload-image/:id_video', imageUpload.single('thumb'), VideoController.uploadImage)
routes.patch('/upload/:id_video', imageUpload.single('thumb'), VideoController.updateVideos)
module.exports = routes