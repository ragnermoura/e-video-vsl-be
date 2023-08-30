const MetricaController = require('../controllers/metricasController')

const routes = require('express').Router()

routes.get('/:id_video', MetricaController.getMetricas)
module.exports = routes