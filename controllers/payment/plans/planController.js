const { Client, PlansController } = require("pargamesdk");
require("dotenv").config();

module.exports = class PlanController {
  static async createNewPlan(req, res) {
    const {
      nome,
      metodos,
      free_days,
      descricao,
      descricao_extrato_cartao,
      items,
      entrega,
      parcelas,
      intervalo,
      intervalCount,
      billingDays,
      billingType,
      metadata,
      priceScheme,
      quantidade,
    } = req.body;

    if (!descricao) {
      res.status(422).json({
        success: false,
        message: "A descrição é necessária",
      });
      return;
    }
    if (!descricao_extrato_cartao) {
      res.status(422).json({
        success: false,
        message: "A descrição é necessária para aparecer no extrato do cartão",
      });
      return;
    }

    if (!intervalo) {
      res.status(422).json({
        success: false,
        message: "o intervalo de meses é necessário",
      });
      return;
    }

    if (!nome) {
      res.status(422).json({
        success: false,
        message: "O nome do plano é necessário",
      });
      return;
    }

    if (!metodos) {
      res.status(422).json({
        success: false,
        message: "Os métodos de pagamentos é necessário",
      });
      return;
    }

    if (!free_days && free_days < 1 ) {
      res.status(422).json({
        success: false,
        message: "quantidades de dias gratuitos é necessário",
      });
      return;
    }

    if (!intervalCount) {
      res.status(422).json({
        success: false,
        message:
          "Insira o intervalo de pagamento em meses, recomendado é de 1 mês",
      });
      return;
    }

    if (typeof entrega !== "boolean") {
      res.status(422).json({
        success: false,
        message: "É necessário saber se é possível fazer entrega ou não",
      });
      return;
    }

    if (!parcelas) {
      res.status(422).json({
        success: false,
        message: "É necessário saber o numero de parcelas",
      });
      return;
    }

    if (!billingType) {
      res.status(422).json({
        success: false,
        message: "Escolha entre pagamento pré-pago, pós-pago ou dia exato",
        valoresPossiveis:
          "Os valores possíveis são prepaid, postpaid e exact_day",
      });
      return;
    }

    if (!billingDays && billingType === "exact_day") {
      res.status(422).json({
        success: false,
        message: "selecione as datas para pagamento exato",
      });
      return;
    }

    if (typeof priceScheme !== "object") {
      res.status(422).json({
        success: false,
        message: "o Schema precisa ser um objeto",
      });
      return;
    }

    if (!priceScheme?.schemeType) {
      res.status(422).json({
        success: false,
        message: "Escolha o tipo do plano sé unidade, pacote, volume e tier",
        valoresPossiveis:
          "Os valores possíveis são unit, package, volume e tier",
      });
      return;
    }

    if (!priceScheme?.price && priceScheme?.schemeType === "unit") {
      res.status(422).json({
        success: false,
        message: "Como escolheu a opção unit selecione o preço",
      });
      return;
    }

    if (!quantidade && priceScheme?.schemeType === "unit") {
      res.status(422).json({
        success: false,
        message:
          "Como escolheu a opção unit selecione uma quantidade o máximo é 2147483647",
      });
      return;
    }

    if (!priceScheme?.priceBrackets && priceScheme?.schemeType !== "unit") {
      res.status(422).json({
        success: false,
        message:
          "Como escolheu a opção unit selecione o precisa preencher o priceBrackets",
      });
      return;
    }

    /*     const pagarmeClient = await pagarMe.client.connect({
            email: process.env.PAGARME_API_KEY,
            password: ''
        }).catch(err => console.log('error', err))
     */

    const plan = {
      name: nome,
      description: descricao,
      statementDescriptor: descricao_extrato_cartao,
      paymentMethods: metodos,
      trialPeriodDays: free_days,
      metadata: metadata === undefined ? {} : metadata,
      items: items === undefined ? [] : items,
      currency: "BRL",
      shippable: entrega,
      installments: parcelas,
      interval: intervalo,
      intervalCount,
      billingType,
      billingDays: billingDays === undefined ? [] : billingDays,
      pricingScheme: priceScheme,
      quantity: quantidade,
    };

    const client = new Client({
      timeout: 0,
      basicAuthUserName: process.env.PAGARME_API_KEY,
      basicAuthPassword: "",
    });

    const Plans = new PlansController(client);

    const plans = await Plans.createPlan(plan);

    /* 
            const newPlan = await pagarmeClient.plans.create(plan) */

    res.status(200).json({
      success: true,
      message: "Plano criado com sucesso",
      plano: plans?.result,
    });
  }
};
