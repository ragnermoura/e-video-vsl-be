const router = require("express").Router();
const UserController = require('../controllers/userController')
/* 
router.get('/', async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll();
    return res.status(200).send({ response: usuarios });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.get('/:id_user', async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id_user);
    if (!usuario) {
      return res.status(404).send({ mensagem: 'Usuário não encontrado.' });
    }
    return res.status(200).send({ response: usuario });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.delete('/delete', async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.body.id_user);
    if (!usuario) {
      return res.status(404).send({ mensagem: 'Usuário não encontrado.' });
    }
    await usuario.destroy();
    return res.status(202).send({ mensagem: 'Usuário excluído com sucesso!' });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});


router.patch('/:id_user', async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id_user);
    if (!usuario) {
      return res.status(404).send({ mensagem: 'Usuário não encontrado.' });
    }
    usuario.nome = req.body.nome;
    usuario.sobrenome = req.body.sobrenome;
    usuario.email = req.body.email;
    usuario.senha = senhaHash;
    usuario.cpf = req.body.cpf;
    usuario.id_nivel = req.body.nivel;
    usuario.id_status = req.body.status;
    usuario.avatar = req.file.filename;

    await usuario.save();

    return res.status(200).send({ mensagem: 'Usuário atualizado com sucesso.', response: usuario });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});
 */

  
router.post('/cadastro', UserController.cadastrarUsuario)
router.patch('/senha', UserController.changePassword)
 
module.exports = router
