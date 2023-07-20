const { Schema, SchemaType } = require('mongoose')
const mongoose = require('../db/mongoose')

const Assinatura = mongoose.model('Assinatura', new Schema({
   id: String,
   name: String,
   last_status: String,
   last_transaction: {
    id_transaction: String,
    status_transaction: String,
   },
   contact: {
    id: String,
    name: String,
    email: String,
},
product: {
    id_product: String,
    internal_id: String,
    name_product: String
}
}))

module.exports = Assinatura