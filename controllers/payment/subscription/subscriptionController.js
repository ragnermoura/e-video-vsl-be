const Assinatura_User = require("../../../models/tb_user_assinatura");
const Usuario = require("../../../models/tb_usuario");

require("dotenv").config();

module.exports = class SubscriptionsController {
  static async CreateSubscription(req, res) {
      try {

        const { id_plano, metodoPagamento, celular, id_user, documento, cartao, id_plano_sistema } = req.body
    
        if(!id_plano){
            return res.status(422).json({
                success: false,
                message: 'o Plano é necessário'
            })
        }
        
        if(!metodoPagamento){
            return res.status(422).json({
                success: false,
                message: 'o método de pagamento é necessário'
            })
        }
        if(!documento){
            return res.status(422).json({
                success: false,
                message: 'o documento é necessário'
            })
        }

        if(!celular && metodoPagamento == 'credit_card'){
            return res.status(422).json({
                success: false,
                message: 'o numero de celular é necessário'
            })
        }

        
        if(!id_user){
            return res.status(422).json({
                success: false,
                message: 'o id do usuário é necessário'
            })
        }

        const user = await Usuario.findOne({
            where: {
                id_user
            }
        })

        let phone = celular?.split(' ')?.join('')
        const phones = metodoPagamento == 'credit_card' ? {
            mobile_phone: {
                country_code: phone?.slice(0,2),
                area_code: phone?.slice(2,4),
                number: phone?.slice(4)
            }
        } : null
        const type = documento ? 'individual' : null
        const document = documento

        const validate = cartao?.validade?.split('/')

        const card = metodoPagamento == 'credit_card' ? {
            number: cartao?.number,
            holder_name: cartao?.holder,
            exp_month: validate[0],
            exp_year: validate[1],
            cvv: cartao?.cvv,
            type: 'credit',
            billing_address: cartao?.address
        } : null

    const body = {
        plan_id: id_plano,
        customer: {
            name: `${user?.nome} ${user?.sobrenome}`,
            email:`${user?.email}`,
            document,
            phones,
            type,
        },
        payment_method: metodoPagamento,
        card,
        increments: [],
        discounts: [],
        metadata: {},
        boleto_due_days: 3,
        installments: 1

    }

    

    
    const reqAssinatura = await fetch('https://api.pagar.me/core/v5/subscriptions', {
        method: 'POST',
        headers: {
            accept: 'application/json',
    'content-type': 'application/json',
    'Authorization': `Basic ${Buffer.from(process.env.PAGARME_API_KEY + ':').toString('base64')}`
        },
        body: JSON.stringify(body)
    })

    
    const newAssinatura = await reqAssinatura?.json()


if(newAssinatura?.status === 'active'){

    await Assinatura_User.create({
        id_user,
        id_assinatura: newAssinatura?.id,
        id_plano: newAssinatura?.plan?.id,
        id_plano_sistema 
        
    })
    
    res.status(200).json({
        success: true,
        message: 'Assinatura criada com sucesso',
        assinatura: newAssinatura
    })
} else {
    res.status(400).json({
        success: false,
        message: 'Não foi possível efetuar a transação',
        err: error
    })
}
} catch (error) {
        console.log(error)
    res.status(400).json({
        success: false,
        message: 'Houve um erro na transação',
        err: error
    })
    return
}
  }
};
