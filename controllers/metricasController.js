const Metrica = require("../models/tb_metrica")
const { Op } = require('sequelize')
module.exports = class MetricaController{


    static async getMetricas(req,res) {


        const { id_video } =  req.params

        const { inicio, fim } = req.query

        console.log('datas', inicio, fim)

        const start = new Date(inicio)
        const end = new Date(fim)
        const adjustedEnd = new Date(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59, 999);
        adjustedEnd.setUTCMilliseconds(adjustedEnd.getUTCMilliseconds() - adjustedEnd.getTimezoneOffset() * 60 * 1000);
        
        try {

            const allData = await Metrica.findAll({
                where:{
                    id_video,
                    createdAt: {
                        [Op.gte]: start,
                        [Op.lte]: adjustedEnd
                    }
                }
            })
            const CountPlay = await Metrica.findAndCountAll({
                where:{
                    id_video,
                    play: 1,
                    createdAt: {
                        [Op.gte]: start,
                        [Op.lte]: adjustedEnd
                    }
                }
            })
            
            const CountView = await Metrica.findAndCountAll({
                where:{
                    id_video,
                    view: 1,
                    createdAt: {
                        [Op.gte]: start,
                        [Op.lte]: adjustedEnd
                    }
                }
            })
            const CountUniquePlay = await Metrica.findAndCountAll({
                where:{
                    id_video,
                    uniquePlay: 1,
                    createdAt: {
                        [Op.gte]: start,
                        [Op.lte]: adjustedEnd
                    }
                }
            })
            
            const CountUniqueView = await Metrica.findAndCountAll({
                where:{
                    id_video,
                    uniqueView: 1,
                    createdAt: {
                        [Op.gte]: start,
                        [Op.lte]: adjustedEnd
                    }
                }
            })

            return res.status(200).json({

                success: true,
                plays: CountPlay?.count,
                views: CountView?.count,
                unique_plays: CountUniquePlay?.count,
                unique_views: CountUniqueView?.count,
                full:allData


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