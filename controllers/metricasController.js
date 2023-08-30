const Metrica = require("../models/tb_metrica")

module.exports = class MetricaController{


    static async getMetricas(req,res) {


        const { id_video } =  req.params


        try {

            const CountPlay = await Metrica.findAndCountAll({
                where:{
                    id_video,
                    play: 1
                }
            })
            
            const CountView = await Metrica.findAndCountAll({
                where:{
                    id_video,
                    view: 1
                }
            })
            const CountUniquePlay = await Metrica.findAndCountAll({
                where:{
                    id_video,
                    uniquePlay: 1
                }
            })
            
            const CountUniqueView = await Metrica.findAndCountAll({
                where:{
                    id_video,
                    uniqueView: 1
                }
            })

            return res.status(200).json({

                success: true,
                plays: CountPlay?.count,
                views: CountView?.count,
                unique_plays: CountUniquePlay?.count,
                unique_views: CountUniqueView?.count,


            })
            
        } catch (error) {
            
            console.log('err', error)

            return res.status(500).json({
                success: false,
                message: 'Houve um erro ao puxar a informação',
                err: error
            })
        }


    }

}