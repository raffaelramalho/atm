const ad = require("../config/activeDirectory");

//Método para autenticar usuários
exports.user_authenticate = async (req, res) => {
    console.log("/login acessado")
  const { user, pass, domain } = req.body;
  try {
    await ad.authenticate( domain + "\\" + user, pass,
     function (err, auth) {
       if (auth) {
         return res.status(200).json({
               message: "Autenticado"
             });
         }
       else {
         return res.status(401).send({
             message: "Falha na autenticação",
             error: err
         });
      }
     });
   }catch (err) {
   return res.status(500).send({ message: "ERROR " + err });
  }
};