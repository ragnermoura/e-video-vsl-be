const plan = require('./plano')
const subscription = require('./subscription')
const rotaLogin = require('./login')
const usuario = require('./usuarios')
const videosRoutes = require('./video')
const metricasRoutes = require('./metricas')
const webhookRoutes = require('./webhook')

const router = require("express").Router();

router.use('/plan', plan)
router.use('/subscription', subscription)
router.use('/login',rotaLogin)
router.use('/usuario',usuario)
router.use('/videos', videosRoutes)
router.use('/metricas', metricasRoutes)
router.use('/webhook', webhookRoutes)

module.exports = router