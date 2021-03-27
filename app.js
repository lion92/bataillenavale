var express = require('express');
var bodyParser = require('body-parser');
var envoi = require('../batailleNavale/app/models/todo');

var connection = require('./app/config/connection');
var routes = require('./app/controllers/routes');
const todo = require('../batailleNavale/app/models/todo');
const cookieParser=require("cookie-parser");
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.get('/cookie', function(req, resp) {
  console.log(req.cookies['bataillenavale']);
  resp.send({ status: 0, message: "ok" + req.cookies['bataillenavale'] });
})
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    res.render('index', { text: 'This is EJS'})
})

app.get('/about', (req, res) => {
    res.render('about', { text: 'About Page'})
})
connection.init();
routes.configure(app);

var server = app.listen(8000, function(){
  console.log('Server listening on port ' + server.address().port);
});
