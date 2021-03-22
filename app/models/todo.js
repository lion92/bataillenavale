var connection = require("../config/connection");

const nodemailer = require("nodemailer");
var messagebis = "diidoi";
let transport = nodemailer.createTransport({
  host: "mail.krissdeveloppeur.com",
  secure: false,
  auth: {
    user: "envoi@krissdeveloppeur.com",
    pass: "envoienvoi!",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function Todo() {
  this.reqpmu = function (req, res) {
    connection.acquire(function (err, con) {
      console.log("Connecté à la base de données MySQL!");
      con.query(req, function (err, result) {
        if (err) {
          res.send({ status: 1, message: "TODO creation fail" + err });
        } else {
          res.send({ status: 0, message: "TODO create success" + result });
          console.log("Post successful");
        }
      });
    });
  };
  this.reqbateau = function (req, res) {
    connection.acquire(function (err, con) {
      console.log(err);
      console.log("Connecté à la base de données MySQL!");

      con.query(
        "insert into bateau (nom) values (?) ",
        req,
        function (err, result) {
          if (err) {
            res.send({ status: 1, message: "TODO creation fail" + err });
          } else {
            res.send({ status: 0, message: "TODO create success" + result });
            console.log("Post successful");
          }
        }
      );
    });
  };
    this.reqplace = function (position,bateau,joueurs, res) {
      connection.acquire(function (err, con) {
        console.log(err);
        console.log("Connecté à la base de données MySQL!");

        con.query(
          "insert into place (idPostion, idBateau,idBateau_Place) values (?,?,?) ",
          [position,
          bateau,
          joueurs],
          function (err, result) {

            if (err) {
              res.send({ status: 1, message: "TODO creation fail" + err });
            } else {
              res.send({ status: 0, message: "TODO create success" + result });
              console.log("Post successful");
            }
          }
        );
      });
    };
    this.reqselect = function (bateau, res) {
      connection.acquire(function (err, con) {
        console.log(err);
        console.log("Connecté à la base de données MySQL!");

        con.query(
          " select * from Place INNER JOIN bateau ON Place.idbateau_place = bateau.idbateau inner join Position2 on Place.idbateau_place=Position2.idPostion where nom=?",
          bateau,
          function (err, result) {

            if (err) {
              res.send({ status: 1, message: "TODO creation fail" + err });
            } else {
             
              res.send(result);
              console.log("Post successful");
            }
          }
        );
      });
    };
  this.createpmu = function (text, res) {
    connection.acquire(function (err, con) {
      con.query("?", text, function (err, result) {
        con.release();
        if (err) {
          res.send({ status: 1, message: "TODO creation fail" });
        } else {
          res.send({ status: 0, message: "TODO create success" });
          console.log("Post successful");
        }
      });
    });
  };
  this.get = function (res) {
    connection.acquire(function (err, con) {
      con.query("select * from todo_list", function (err, result) {
        con.release();

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");



        res.send(result);
        console.log("Get successful");
      });
    });
  };
  this.getByID = function (id, res) {
    connection.acquire(function (err, con) {
      con.query(
        "select * from todo_list where id = ?",
        id,
        function (err, result) {
          con.release();
          res.send(result);
          console.log("Get by ID successful");
        }
      );
    });
  };
  this.create = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query("insert into todo_list set ?", todo, function (err, result) {
        con.release();
        if (err) {
          res.send({ status: 1, message: "TODO creation fail" });
        } else {
          res.send({ status: 0, message: "TODO create success" });
          console.log("Post successful");
        }
      });
    });
  };
  this.update = function (todo, id, res) {
    connection.acquire(function (err, con) {
      con.query(
        "update todo_list set name = ? where id = ?",
        [todo, id],
        function (err, result) {
          con.release();
          if (err) {
            res.send({ status: 1, message: "TODO update fail" });
          } else {
            res.send({ status: 0, message: "TODO update success" });
            console.log("Put successful");
          }
        }
      );
    });
  };
  this.delete = function (id, res) {
    connection.acquire(function (err, con) {
      con.query(
        "delete from todo_list where id = ?",
        id,
        function (err, result) {
          con.release();
          if (err) {
            res.send({ status: 1, message: "TODO delete fail" });
          } else {
            res.send({ status: 0, message: "TODO delete success" });
            console.log("Delete successful");
          }
        }
      );
    });
  };
  this.deletetout = function ( req, res) {
    connection.acquire(function (err, con) {
      con.query(
        "delete from todo_list where id>1",
        function (err, result) {
          con.release();
          if (err) {
            res.send({ status: 1, message: "TODO delete fail" });
          } else {
            res.send({ status: 0, message: "TODO delete success" });
            console.log("Delete successful");
          }
        }
      );
    });
  };
}

module.exports = new Todo();
