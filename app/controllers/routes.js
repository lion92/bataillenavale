var todo = require('../models/todo');

module.exports = {
//
  configure: function(app) {
    app.post('/insertpmu', function(req, res){
      todo.reqpmu(req.body.pmu,res);
    });
    app.post('/register', function(req, res){
      todo.reqgister(req.body.email, req.body.password,req, res);
    });
    app.post('/login', function(req, res){
      todo.reqlogin(req.body.email, req.body.password,req, res);
    });
    app.post('/insert/bateau', function(req, res){
      todo.reqbateau(req.body.nom,req.body.bateauX, req.body.bateauY,req,res);
    });
    app.get('/joueur', function(req, res){
      todo.reqjoueurencours(req,res);
    });
    app.get('/partieactu', function(req, res){
      todo.reqjoueurencours(req,res);
    });
    app.post('/insert/partie', function(req, res){
      todo.reqpartie(req.body.joueur2, req.body.tourj1,req,res);
    });
    app.post('/updatej1', function(req, res){
      todo.requpdatetourj1( req.body.tourj1,req.body.joueur1, req,res);
    });
    app.post('/updatej2', function(req, res){
      todo.requpdatetourj2( req.body.tourj1,req.body.joueur2,req,res);
    });
    app.post('/deconnexion', function(req, res){
      todo.reqdeconnexion(req,res);
    });
    app.post('/insert/position', function(req, res){
      todo.reqplace(req.body.bateau, req.body.plateau,res)
    });
    app.get('/tour', function(req, res){
      todo.selectpartie(req,res)
    });
    app.post('/insert/tir', function(req, res){
      todo.reqtir(req.body.posX, req.body.posY,req,res)
    });
    app.post('/touche', function(req, res){
      todo.reqtouche(req.body.posX, req.body.posY,req,res)
    });
    app.post('/deletetir', function(req, res){
      todo.deleteplateau(res)
    });
    app.post('/deletetir/:email', function(req, res){
      todo.deleteplateauemail(req.params.email,res)
    });
    app.post('/deleteposition', function(req, res){
      todo.deleteposition(res)
    });
    app.get('/select/:bateau', function(req, res){
      todo.reqselect(req.params.bateau,res)
    });
    app.get('/tirs', function(req, res){
      todo.gettir(res)
    });
    app.get('/qui', function(req, res){
      todo.quiesttu(req,res);
    });
    app.get('/tirs/:email', function(req, res){
      todo.gettirparemail(req.params.email,res)
    })
    app.get('/email', function(req, res){
      todo.getemail(res)
    });
    app.get('/bateau', function(req, res){
      todo.getbateau(res)
    });
    app.post('/envoi', function(req,res){
      todo.envoi(req.body.message,res);
    });
    app.post('/pmu',function(req,res) {
      todo.createpmu(req,res);
    });
    app.post('/send',function(req,res) {
      envoi(req.aqui, req.sujet, req.message,res);
    });
    app.get('/todo',function(req,res) {
      todo.get(res);
    });
    app.get('/todo/:id',function(req,res) {
      todo.getByID(req.params.id,res);
    });
    app.post('/todo',function(req,res) {
      todo.create(req.body,res);
    });
    app.post('/todo/:id',function(req,res) {
      todo.update(req.body.name,req.params.id,res);
    });
    app.post('/delete/:id',function(req,res) {
      todo.delete(req.params.id,res);
    });
    app.post('/delete/tout',function(req,res) {
      todo.deletetout(req,res);
    });
  }
};
