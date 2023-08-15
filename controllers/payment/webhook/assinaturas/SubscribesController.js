const transporter = require("../../../../helpers/transporter")
const Assinatura = require("../../../../schemas/assinatura")
const bcrypt = require('bcrypt')
const User = require('../../../../models/tb_usuario')
const Assinatura_User = require("../../../../models/tb_user_assinatura")
const { Op } = require("sequelize")

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
        
        const newSubcription = new Assinatura(body)
        
        await newSubcription.save()

        const userName = data?.last_transaction?.contact?.name.split(' ')
        const nomeUser =userName.shift()
        const hashedPassword = await bcrypt.hash('h$7PQU!JV', 10);
        const user  = {
            nome: nomeUser,
            sobrenome: userName.join(' '),
            email: data?.last_transaction?.contact?.email,
            senha: hashedPassword
        }
        
        const userCreated = await User.create(user)
        
                const user_assinatura = { 
                      id_user:  userCreated?.id_user,
                      plano: data?.name,
                      nome_plano: data?.last_transaction?.product?.name,
                    nome_plano_marketPlace: data?.last_transaction?.product?.marketplace_name,
                }
                await Assinatura_User.create(user_assinatura)
                
            transporter.sendMail({
                from: 'Evideo <noreply@evideovsl.com.br>',
                to:`${data?.last_transaction?.contact?.email}`,
                subject: 'Acesso a plataforma e-video',
                text: 'Acesso a plataforma e-video',
                html: `

                <h2>Olá ${nomeUser}, parabéns pela sua compra, seja bem vindo</h2>

                <p>Segue seu login e senha provisório</p>

                <ul>
                <li>URL de acesso: https://app.evideovsl.com.br/</li>
                <li>email: ${data?.last_transaction?.contact?.email}</li>
                <li>senha: h$7PQU!JV</li>
                </ul>

                    `
                })

                
            
            res.status(200).json({
                success: true,
                message: 'dados recebidos com sucesso'
            })
            
        } catch (error) {
            console.log('err', error)
            res.status(500).json({ message: error })
        }
    }

    static async newPassword (req, res){

        const { email, senha } = req.body

        if(!email){
            return res.status(422).json({
                success: false,
                message: 'O email é requerido'
            })
        }
        
        if(!senha){
            return res.status(422).json({
                success: false,
                message: 'O email é requerido'
            })
        }

        const hashedPassword = await bcrypt.hash( senha, 10);

        const user = await User.findOne({
            where: {
                email: email
            }
        }) 

        await User.update({
            senha: hashedPassword
        }, {
            where: {
                id_user: user?.id_user
            }
        })


        await transporter.sendMail({
            from: 'Evideo <noreply@evideovsl.com.br>',
            to:`${email}`,
            subject: 'Acesso a plataforma e-video',
            text: 'Acesso a plataforma e-video',
            html: `

            <h2>Olá ${user?.nome}, seu acesso chegou</h2>

            <p>Segue seu login e senha provisório</p>

            <ul>
            <li>URL de acesso: https://app.evideovsl.com.br/</li>
            <li>email: ${email}</li>
            <li>senha: ${senha}</li>
            </ul>

                `
            })




 /* function gerarSenha() {
                const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
                let senhaAleatoria = '';
                
                for (let i = 0; i < 12; i++) {
                  const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
                  senhaAleatoria += caracteres.charAt(indiceAleatorio);
                }
                
                return senhaAleatoria;
              }
              
        user?.map(async item => {
           
              
             
              const senhaGerada = gerarSenha();
            const hashedPassword = await bcrypt.hash( senhaGerada, 10);
            console.log('senha',senhaGerada )

            await User.update({
                senha: hashedPassword
            }, {
                where: {
                    id_user : item?.id_user
                }
            })
        

                        
           await transporter.sendMail({
                from: 'Evideo <noreply@evideovsl.com.br>',
                to:`${item?.email}`,
                subject: 'Acesso a plataforma e-video',
                text: 'Acesso a plataforma e-video',
                html: `

                <h2>Olá ${item?.nome}, parabéns pela sua compra, seja bem vindo</h2>

                <p>Segue seu login e senha provisório</p>

                <ul>
                <li>URL de acesso: https://app.evideovsl.com.br/</li>
                <li>email: ${item?.email}</li>
                <li>senha: ${senhaGerada}</li>
                </ul>

                    `
                })

        }
            )
 */
        
            res.status(200).json({
            success: true,
            message: 'dados',
            data: user
        })

    }

}