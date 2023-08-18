const bcrypt = require("bcrypt");
const User = require("../models/tb_usuario");
const transporter = require("../helpers/transporter")

// Obtém todos os usuários
const obterUsuarios = async (req, res, next) => {
  try {
    const usuarios = await User.findAll();
    return res.status(200).send({ response: usuarios });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Obtém um usuário pelo ID
const obterUsuarioPorId = async (req, res, next) => {
  try {
    const usuario = await User.findByPk(req.params.id_user);
    if (!usuario) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }
    return res.status(200).send({ response: usuario });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Atualiza um usuário
const atualizarUsuario = async (req, res, next) => {
  try {
    const usuario = await User.findByPk(req.body.id_user);
    if (!usuario) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }
    usuario.nome = req.body.nome;
    usuario.sobrenome = req.body.sobrenome;
    usuario.email = req.body.email;
    usuario.id_nivel = req.body.nivel;
    usuario.id_status = req.body.status;
    await usuario.save();
    return res
      .status(201)
      .send({ mensagem: "Dados de usuário alterados com sucesso!" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Exclui um usuário
const excluirUsuario = async (req, res, next) => {
  try {
    const usuario = await User.findByPk(req.body.id_user);
    if (!usuario) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }
    await usuario.destroy();
    return res.status(202).send({ mensagem: "Usuário excluído com sucesso!" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Cria um novo usuário
const cadastrarUsuario = async (req, res, next) => {
  try {

 
    const { nome, sobrenome, email, senha } = req.body

    
    if (!nome) {
      res.status(422).json({
        success: false,
        message: "O nome é um campo obrigatório",
      });
      return;
    }

    if (!sobrenome) {
      res.status(422).json({
        success: false,
        message: "O sobrenome é um campo obrigatório",
      });
      return;
    }

    if (!email) {
      res.status(422).json({
        success: false,
        message: "O email é um campo obrigatório",
      });
      return;
    }

    if (!senha) {
      res.status(422).json({
        success: false,
        message: "A senha é um campo obrigatório",
      });
      return;
    }


    const usuarioExistente = await User.findOne({
      where: { email: email },
    });
    if (usuarioExistente) {
      return res
        .status(409)
        .send({
          message: "Email já cadastrado, por favor insira um email diferente!",
        });
    }
    const hashedPassword = await bcrypt.hash( senha, 10);
    const novoUsuario = await User.create({
      nome: nome,
      sobrenome: sobrenome,
      email: email,
      senha: hashedPassword,
    });

    const response = {
      success: true,
      mensagem: "Usuário cadastrado com sucesso",
      usuarioCriado: {
        id_user: novoUsuario.id_user,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        nivel: novoUsuario.id_nivel,
       
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { id_user, senhaAntiga,senha, confirmSenha } = req.body

  if(!senhaAntiga){
    res.status(422).json({message: 'A senha atual é obrigatória'})
    return
}
  if(!senha){
    res.status(422).json({message: 'A nova senha é obrigatória'})
    return
}
if(!confirmSenha){
    res.status(422).json({message: 'A confirmação da senha é obrigatória'})
    return
}
if(confirmSenha !== senha){
    res.status(422).json({message: 'As senhas não coincidem'})
    return
}

const user = await User.findOne({where: {id_user: id_user}})

if(!user){
    res.status(422).json({message: 'Usuário não existe'})
    return
}

console.log(user?.nome)

const passwordMatch = bcrypt.compareSync(senhaAntiga, user.senha)

if(!passwordMatch){
    res.status(422).json({message: 'senha antiga invalida'})
    return
}

const hashedPassword = await bcrypt.hash( senha, 10);

const body = {
  senha: hashedPassword
}

await User.update(body, {where:{id_user: id_user} })

res.status(200).json({
  success: true,
  message: 'senha atualizada com sucesso'
})

}

const sendCode = async (req, res) => {

  const { email } = req.body

  if(!email){
    return res.status(422).json({

      success: false,
      message: 'o e-mail é necessário para o envio das informações'

    })
  }

  const user = await User.findOne({where: {email}})

  if(!user){
    return res.status(422).json({

      success: false,
      message: 'Não existe cadastro com este e-mail'

    })
  }


  function gerarNumeroQuatroDigitos() {
    let numero = (Math.random() * 10000).toFixed(0);

    while (numero.length < 4) {
      numero = (Math.random() * 10000).toFixed(0);
    }

    return numero;
  }

  const numeroAleatorio = gerarNumeroQuatroDigitos();
  console.log(numeroAleatorio);

await User.update({code: numeroAleatorio}, {
  where: {email}
})

  transporter.sendMail({
    from: 'Evideo <noreply@evideovsl.com.br>',
    to:`${email}`,
    subject: 'Código de verificação',
    text: 'Código de verificação',
    html: `

    <h2>Olá ${user?.nome}, parabéns pela sua compra, seja bem vindo</h2>

    <p>Segue seu código de verificação para alteração de senha</p>

    <ul>
    
    <li>código de verificação: ${numeroAleatorio}</li>
    </ul>

        `
    })

  res.status(200).json({
    success: true,
    user,
    code: numeroAleatorio
  })

}
const validationCode = async (req, res) => {
  try {
    const { code, email } = req.body;

    console.log("dados", code, email);

    if (!code) {
      res.status(422).json({
        success: false,
        message: "O código é obrigatório",
      });
      return;
    }

    const user = await User.findOne({
      where: {
        email
      },
    });

    if (code == user?.code) {
      await User.update(
        {
          code: null,
        },
        {
          where: { email },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Código validado com sucesso",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Código invalidado",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Ocorreu um erro ${error}`,
    });
  }
}
const forgotPassaword = async (req, res) => {

  const { email,senha, confirmSenha } = req.body

 
  if(!senha){
    res.status(422).json({message: 'A nova senha é obrigatória'})
    return
}
if(!confirmSenha){
    res.status(422).json({message: 'A confirmação da senha é obrigatória'})
    return
}
if(confirmSenha !== senha){
    res.status(422).json({message: 'As senhas não coincidem'})
    return
}

const user = await User.findOne({where: {email}})

const comparePass = await bcrypt.compareSync(senha, user.senha)

if(comparePass){
  res.status(422).json({message: 'Não é possível a mesma senha'})
  return
}

if(!user){
    res.status(422).json({message: 'Usuário não existe'})
    return
}

const hashedPassword = await bcrypt.hash( senha, 10);



const body = {
  senha: hashedPassword
}

await User.update(body, {where:{email} })

res.status(200).json({
  success: true,
  message: 'senha atualizada com sucesso'
})


}

module.exports = {
  obterUsuarios,
  obterUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
  cadastrarUsuario,
  changePassword,
  sendCode,
  validationCode,
  forgotPassaword
};