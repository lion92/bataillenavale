var todo = require('../models/todo');

module.exports = {
//
  configure: function(app) {
    app.post('/register', function(req, res){
      todo.reqgister(req.body.email, req.body.password,req, res);
    });
    app.post('/login', function(req, res){
      todo.reqlogin(req.body.email, req.body.password, req.body.token, req, res);
    });
    app.post('/insert/bateau', function(req, res){
      todo.reqbateau(req.body.token,req.body.nom,req.body.bateauX, req.body.bateauY, req.body.partie,req,res);
    });

    app.get('/idAdversaireJ2/:joueur2/:token', function(req, res){
      todo.reqIdadversaireJ1(req.params.token, req.params.joueur2,req,res);
    });

    app.get('/idAdversaireJ1/:joueur1/:token', function(req, res){
      todo.reqIdadversaireJ2(req.params.token, req.params.joueur1,req,res);
    });

    app.post('/insertrobot/bateau', function(req, res){
      todo.reqbateauRobot(req.body.nom,req.body.bateauX, req.body.bateauY, req.body.email,req.body.partie,req,res);
    });
    
    app.get('/joueur', function(req, res){
      todo.reqjoueurencours(req,res);
    });
    app.get('/joueur/:qui/:adv', function(req, res){
      todo.reqjoueurRobot(req.params.qui,req.params.adv,req,res);
    });
    app.get('/partieactu', function(req, res){
      todo.reqjoueurencours(req,res);
    });
    app.get('/aquidejouerj1/:joueur2/:token', function(req, res){
      todo.reqjoueurencoursIndependant(req.params.token, req.params.joueur2, req,res);
    });
    app.get('/aquidejouerj2/:joueur2/:token', function(req, res){
      todo.reqjoueurencoursIndependantj2(req.params.token, req.params.joueur2, req,res);
    });
    app.post('/insert/partie', function(req, res){
      todo.reqpartie(req.body.token, req.body.joueur2, req.body.tourj1,req,res);
    });
    app.post('/updatej1', function(req, res){
      todo.requpdatetourj1( req.body.tourj1,req.body.joueur1, req,res);
    });
    app.post('/updatej2', function(req, res){
      todo.requpdatetourj2( req.body.tourj1,req.body.joueur2,req,res);
    });
    app.post('/updaterobotj2', function(req, res){
      todo.requpdatetourobotj2( req.body.tourj1,req.body.joueur1, req.body.robot,req,res);
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
    app.get('/mesbateau/:token/:adv', function(req, res){
      todo.selectbateauparmail(req.params.token, req.params.adv,req,res)
    });

    app.get('/mesbateau/:robot/:adv', function(req, res){
      todo.selectbateauRobot(req.params.robot,req.params.adv,req,res)
    });

    app.get('/users', function(req, res){
      todo.selectUsers(req,res)
    });
    app.post('/insert/tir', function(req, res){
      todo.reqtir(req.body.token,req.body.posX, req.body.posY,req.body.adversaire,req,res)
    });
    app.post('/robot/tir', function(req, res){
      todo.reqtirRobot(req.body.posX, req.body.posY,req.body.adversaire,req.body.email,req,res)
    });
    app.post('/touche', function(req, res){
      todo.reqtouche(req.body.posX, req.body.posY,req,res)
    });
    app.post('/effacerBateau', function(req, res){
      todo.reqeffacerbateau(req.body.adv,req,res);
    });
    app.post('/effacerBateauRobot', function(req, res){
      todo.reqeffacerbateaurobot(req.body.robot,req.body.adv,req,res);
    });
  
    app.post('/deletetir', function(req, res){
      todo.deleteplateau(req.body.email, req.body.adversaire,req,res);
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
    app.get('/conversation', function(req, res){
      todo.reqconversation(req,res)
    })
    app.get('/conv', function(req, res){
      todo.chatkrissselect(req,res)
    })
    app.get('/tirs', function(req, res){
      todo.gettir(res)
    });
    app.get('/qui/:token', function(req, res){
      todo.quiesttu(req.params.token,req,res);
    });
    app.get('/tirs/:email/:adversaire', function(req, res){
      todo.gettirparemail(req.params.email, req.params.adversaire,req,res)
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
