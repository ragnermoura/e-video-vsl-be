const bcrypt = require("bcrypt");
const User = require("../models/tb_usuario");

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

module.exports = {
  obterUsuarios,
  obterUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
  cadastrarUsuario,
};