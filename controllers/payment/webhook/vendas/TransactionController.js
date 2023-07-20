const Transacao = require("../../../../schemas/transacao")

module.exports = class TransactionController{

    static async create (req, res) {

        const data = req.body

        const body = {
            contact: {
                id: data?.contact?.id,
                name: data?.contact?.name,
                email: data?.contact?.email,
            },
            id_transaction: data?.id,
            transaction_status: data?.status,
            invoice: {
                invoice_id: data?.invoice?.id,
                invoice_status: data?.invoice?.status,
        
        
            },
            subscription: {
                id: data?.subscription?.id,
                name: data?.subscription?.name,
                last_status:  data?.subscription?.last_status
            }
        }

        try {
            
            const newTransaction = new Transacao(body)


            await newTransaction.save()

            res.status(200).json({
                success: true,
                message: 'dados recebidos com sucesso',
            })
            
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

}