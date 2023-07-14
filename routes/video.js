const routes = require('express').Router()

const VideoController = require('../controllers/videoController')
const { imageUpload } = require('../helpers/img-upload')
const { videoUpload } = require('../helpers/video-upload')
const Plano = require('../models/tb_planos')
const Assinatura_User = require('../models/tb_user_assinatura')
const Video = require('../models/tb_videos')


routes.get('/get/:id_user', VideoController.obterVideoPorIdUser)
routes.get('/get-by-id/:id_video', VideoController.obterVideoPorId)
routes.post('/upload-video', async (req, res) => {
    const { id_user,} = req.body
    
    try {

        const IdPlano = await Assinatura_User.findOne({
            where: {
                id_user
            }
        })
        
        if(!IdPlano) {
            res.status(422).json({
                success: false,
                message: 'plano não encontrado'
            })
            return
        }

        const plano = await Plano?.findOne({
            where: {
                id_plano_sistema: IdPlano?.id_plano_sistema
            }
        }) 

        const Videos = await Video?.findAndCountAll({
            where: {
                id_user
            }
        })
        
        if(Videos > plano?.limit){
            
        res.status(400).json({
        success: false,
        message: 'Não é possível ultrapassar o limite de videos',
    })
    return
        }
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
        success: false,
        message: 'Não é possível enviar o video',
        err: error
    })
    return
}

} ,  videoUpload.single('video'), VideoController.cadastrarVideos)
routes.patch('/upload-image/:id_video', imageUpload.single('thumb'), VideoController.uploadImage)
module.exports = routes