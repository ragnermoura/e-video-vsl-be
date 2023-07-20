const Assinatura = require("../../../../schemas/assinatura")


module.exports = class SubscribesController{

    static async create (req, res) {

        const data = req.body

        const body = {
            id: data?.id,
   last_status: data?.last_status,
   name: data?.name,
   last_transaction: {
    id_transaction: data?.last_transaction?.id,
    status_transaction: data?.last_transaction?.status,
   },
   contact: {
    id: data?.last_transaction?.contact?.id,
    name: data?.last_transaction?.contact?.name,
    email: data?.last_transaction?.contact?.email,
},
product: {
    id_product: data?.last_transaction?.product?.id,
    internal_id: data?.last_transaction?.product?.internal_id,
    name_product: data?.last_transaction?.product?.name
        }
        }


        const newSubcription = new Assinatura(body)

        await newSubcription.save()

        try {
            
            res.status(200).json({
                success: true,
                message: 'dados recebidos com sucesso',
            })
            
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

}