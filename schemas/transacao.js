const { Schema, SchemaType } = require('mongoose')
const mongoose = require('../db/mongoose')

const Transacao = mongoose.model('Transacao', new Schema({
    contact: {
        id: String,
        name: String,
        email: String,
    },
    id_transaction: String,
    transaction_status: String,
    invoice: {
        invoice_id: String,
        invoice_status: String,


    },
    subscription: {
        id: String,
        name: String,
        last_status: String
    }
}))

module.exports = Transacao