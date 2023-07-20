const SubscribesController = require('../controllers/payment/webhook/assinaturas/SubscribesController')
const TransactionController = require('../controllers/payment/webhook/vendas/TransactionController')

const routes = require('express').Router()


routes.post('/transaction/receive', TransactionController.create)
routes.post('/subscription/receive', SubscribesController.create)

module.exports = routes 