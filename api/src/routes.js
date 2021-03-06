const express = require('express');
const routes = express.Router();
const tables = require('./api');
const fs = require('fs');
const basePath = __dirname;

routes.get('/emprestimo', (req, res) => {
  const valor = req.query.valor
  if (valor <= 299 || valor >=10001) { //conferindo se o valor é maior que 300 e menor que 10.000
    return res.status(406).json(); //caso seja menor que 300 ou maior que 10.000 a API retorna o status: 406 - Not Acceptable

  }else{
    return res.json(tables.getTables()) //chamando tables.js para retornar as tabelas
  }
})


routes.get('/emprestimos/clientes', (req, res) =>{
  const cpf = req.query.cpf;
  return res.send(tables.findClient(cpf));
})


routes.post('/emprestimos/solicitar', (req, res) =>{
  var solicitations = require('./inProgressSolicitation.json');
  solicitations.push(req.body);
  let jsonFile = JSON.stringify(solicitations)
  fs.writeFile(`${basePath}/inProgressSolicitation.json`, jsonFile, 'utf8', function(error){return error});
  return res.send({"resposta": "ok"})
})

routes.get('/emprestimos/solicitacoes', (req, res) => {
  const token = req.query.token;
  var Solicitacao = tables.findSolicitation(token);
  return res.send(Solicitacao);
})

routes.post('/emprestimos/solicitacoes/concluir', (req, res) =>{
  var token = req.query.token;
  return res.send(tables.ConcludeSolicitation(req.body, token));
})

routes.get('/emprestimos/solicitacoes/completas', (req, res) =>{
  var token = req.query.token;
  return res.send(tables.findSucessSolicitation(token))
})


module.exports = routes;
