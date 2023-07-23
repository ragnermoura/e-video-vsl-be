const transporter = require("../../../../helpers/transporter")
const Assinatura = require("../../../../schemas/assinatura")
const bcrypt = require('bcrypt')
const User = require('../../../../models/tb_usuario')

module.exports = class SubscribesController{

    static async create (req, res) {

        const data = req.body

        const body = {
    id: data?.id,
     last_status: data?.last_status,
     name: data?.name,
     
     last_transaction: {
      id_transaction: data?.last_transaction?.id,
      status_transaction: data?.last_transaction?.status,
     },
     
     contact: {
      id: data?.last_transaction?.contact?.id,
      name: data?.last_transaction?.contact?.name,
      email: data?.last_transaction?.contact?.email,
},
product: {
    id_product: data?.last_transaction?.product?.id,
    internal_id: data?.last_transaction?.product?.internal_id,
    name_product: data?.last_transaction?.product?.name
        }
        }


        
        try {
            function gerarSenha(tamanho = 12) {
                const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
                let senhaAleatoria = '';
                
                for (let i = 0; i < tamanho; i++) {
                  const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
                  senhaAleatoria += caracteres.charAt(indiceAleatorio);
                }
                
                return senhaAleatoria;
              }
              
              const tamanhoSenha = 12; // Altere o tamanho da senha conforme sua preferência
              const senhaGerada = gerarSenha(tamanhoSenha);
              console.log("Senha aleatória gerada:", senhaGerada);
              
        /* 
        const newSubcription = new Assinatura(body)
        
        await newSubcription.save() */

        const userName = data?.last_transaction?.contact?.name.split(' ')
        const nomeUser =userName.shift()
        const hashedPassword = await bcrypt.hash( senhaGerada, 10);
        const user  = {
            nome: nomeUser,
            sobrenome: userName.join(' '),
            email: data?.last_transaction?.contact?.email,
            senha: hashedPassword
        }

        await User.create(user)

            transporter.sendMail({
                from: 'noreply <noreply@evideovsl.com.br>',
                to: 'vitormouracs@gmail.com',
                subject: 'Acesso a plataforma e-video',
                text: 'Acesso a plataforma e-video',
                html: `

                <h2>Olá ${nomeUser}, parabéns pela sua compra, seja bem vindo</h2>

                <p>Segue seu login e senha provisório</p>

                <ul>
                <li>email: ${data?.last_transaction?.contact?.email}</li>
                <li>senha: ${senhaGerada}</li>
                </ul>

                    `
                })

                
            
            res.status(200).json({
                success: true,
                message: 'dados recebidos com sucesso'
            })
            
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

}