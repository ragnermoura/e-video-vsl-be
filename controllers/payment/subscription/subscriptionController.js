const { Client, SubscriptionsController: SubscriptionC, PlansController } = require("pargamesdk");
require("dotenv").config();

module.exports = class SubscriptionsController {
  static async CreateSubscription(req, res) {
      try {

        const { id_plano, metodoPagamento, card, customer } = req.body
        

        if(!id_plano){
            return res.status(422).json({
                success: false,
                message: 'o id_plano é necessário'
            })
        }

        if(!metodoPagamento){
            return res.status(422).json({
                success: false,
                message: 'o método de pagamento é necessário'
            })
        }
        
        if(!card){
            return res.status(422).json({
                success: false,
                message: 'o cartão é necessário'
            })
        }

        const client = new Client({
            timeout: 0,
            basicAuthUserName: process.env.PAGARME_API_KEY,
      basicAuthPassword: "",
    });
    
    const Plan = new PlansController(client)

   const {result: plan} = await Plan.getPlan(id_plano)

    const Subscription = new SubscriptionC(client)
    
    const clientAddress = {
        street: 'Rua Nove de Julho',
        number: '378',
        zipCode:  '13231130',
        neighborhood: 'Vila Imape',
        city: 'Campo Limpo Paulista',
        state: 'SP',
        country: 'BR',
        complement: '',
        metadata: '',
        line1: '378, Rua Nove de Julho, Vila Imape',
        line2: 'casa 2',
        metadata: {}
    }
/* 
    const body = {
        planId: id_plano,
        customer: {
            name: 'Benjamin Yago Henrique Nogueira',
            email: 'benjamin-nogueira87@soespodonto.com.br',
            document: '62371483885',
            type: 'individual',
            address: clientAddress,
            metadata: {},
            phones: {
                mobilePhone: {
                    countryCode: '55',
                    number: '992473116',
                    areaCode:'11'
                }
            },
            code: 'lskr'
        },
        customerId: 'cus_37PxoxLsRi8onVA8',
        card: {
            number: '4000000000000093',
            holderName: 'Benjamin Yago Henrique Nogueira',
            expMonth: '12',
            expYear: '26',
            cvv: '123',
            type: 'credit',
            billingAddress: clientAddress,
            billingAddressId : '',

        },
        cardId: '',
        code: 'trl',
        paymentMethod: 'credit_card',
        billingType: plan?.billingType,
        statementDescriptor: plan?.statementDescriptor,
        description: plan?.description,
        currency: plan?.currency,
        intervalCount: plan?.intervalCount,
        interval: plan?.interval,
        pricingScheme: plan?.items[0]?.pricingScheme,
        items : [],
        shipping: {
            type: '',
            amount: 0,
            description: 'teste',
            recipientName: '', 
            recipientPhone: '',
            addressId: '',
            address: clientAddress
        },
        increments: [],
        discounts: [],
        metadata: {},
        boletoDueDays: 3,
        installments: 1

    } */

    const body = {
        plan_id: id_plano,
        customer,
        payment_method: metodoPagamento,
        card,
        increments: [],
        discounts: [],
        metadata: {},
        boletoDueDays: 3,
        installments: 1

    }

    
   /*  console.log('Buffer',Buffer.from(process.env.PAGARME_API_KEY).toString('base64'))

    
    const reqAssinatura = await fetch('https://api.pagar.me/core/v5/subscriptions', {
        method: 'POST',
        headers: {
            accept: 'application/json',
    'content-type': 'application/json',
    'Authorization': `Basic ${Buffer.from(process.env.PAGARME_API_KEY + ':').toString('base64')}`
        },
        body: JSON.stringify(body)
    })

    console.log('request',reqAssinatura)

    const newAssinatura = await reqAssinatura?.json() */

    /* const newSubscription = await Subscription.createSubscription(body)

    console.log(newSubscription) */

    res.status(200).json({
        success: true,
        message: 'Assinatura criada com sucesso',
        assinatura:  /* newAssinatura */ body
    })
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
