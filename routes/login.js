require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/tb_usuario");
const Assinatura_User = require("../models/tb_user_assinatura");

router.post("/", async (req, res, next) => {

  try {
    
  
    const { email, senha } = req.body

    if(!email){
      res.status(401).json({
        success: false,
        message: 'O email é necessário'
      })
      return
    }

    if(!senha){
      res.status(401).json({
        success: false,
        message: 'A senha é necessária'
      })
      return
    }

const user =  await Usuario.findOne({ where: { email: email }, })

if (!user) {
  return res.status(401).send({
    message: "Falha na autenticação.",
  });
}

const password = await bcrypt.compare(senha, user.senha)

if(!password){
   return res.status(401).send({ message: "Falha na autenticação." });
}

const token = jwt.sign(
  {
    id_user: user.id_user,
    nome: user.nome,
    sobrenome: user.sobrenome,
    email: user.email,
    nivel: user.nivel,
    status: user.status,
  },
  process.env.JWT_KEY,
  {
    expiresIn: "6h",
  }
);

        const plano_user = await Assinatura_User.findOne({where: {
          id_user: user?.id_user
        }} )
        
        console.log(password)

      

  return res.status(200).send({
    success: true,
    message: "Autenticado com sucesso!",
    token: token,
    user_id: user.id_user,
    user: user,
    plano: plano_user
  });


   } catch (error) {
    return res.status(500).send({ error: error });
  }
    
      
    
});

module.exports = router;