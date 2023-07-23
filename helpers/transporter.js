const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'mail.evideovsl.com.br',
    port: 465,
    secure: true,
    auth: {
        user: 'noreply@evideovsl.com.br',
        pass: 'evideo@2030'
    },

});


module.exports = transporter