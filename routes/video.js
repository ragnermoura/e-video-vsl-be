const routes = require('express').Router()

const VideoController = require('../controllers/videoController')
const { imageUpload } = require('../helpers/img-upload')
const { videoUpload } = require('../helpers/video-upload')


routes.get('/get/:id_user', VideoController.obterVideoPorIdUser)
routes.get('/get-by-id/:id_video', VideoController.obterVideoPorId)
routes.post('/upload-video', videoUpload.single('video'), VideoController.cadastrarVideos)
routes.patch('/upload-image/:id_video', imageUpload.single('thumb'), VideoController.uploadImage)
module.exports = routes