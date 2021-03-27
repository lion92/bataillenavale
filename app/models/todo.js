var connection = require("../config/connection");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const cookieParser = require("cookie-parser");
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
  this.reqlogin = function (reqemail, reqpassword, req, res) {
    let conection2 = false;
    jwt.verify(req.cookies['essai'], 'secret_this_should_be_longer', function (err, decoded) {
      console.log("////////////");
      if (decoded === undefined) {
        conection2 = true;
      }
      else {
        conection2 = false;
      }
      //console.log(decoded.code) // bar
    });
    if (conection2 == true) {
      connection.acquire(function (err, con) {
        console.log(err);
        console.log("Connecté à la base de données MySQL!");

        con.query(
          'select password2 from user where email=?',
          reqemail,
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
            if (err) {
              res.send({ status: 1, message: "TODO creation fail" + err });
            }



            else {



              // res.send({ status: 0, message:  result[0].password2});
              console.log("Post successful");


              bcrypt.compare(reqpassword, result[0].password2, function (err, result2) {
                // result == true
                if (err) {



                }
                else {



                  const jwttoken = jwt.sign(
                    { code: result[0].password2 },
                    "secret_this_should_be_longer",
                    { expiresIn: "1h" }
                  );
                  const cookieOption = {
                    expiresIn: new Date(
                      Date.now() + 24 * 3600
                    ),
                    httpOnly: true
                  }
                  res.cookie('essai', jwttoken, cookieOption);
                  res.send({ status: 0, message: "Connecte" + req.cookies['essai'] });
                }
              });
            }
          }
        );
      });

    } else {
      // res.clearCookie("essai");
      res.send({ status: 1, message: "connecter" });

    }
  }
  this.reqgister = function (reqemail, reqpassword, req, res) {
    let hashpass = "";
    let bon = "";
    connection.acquire(function (err, con) {
      console.log(err);
      console.log("Connecté à la base de données MySQL!");
      req.cookies.title = 'GeeksforGeeks';
      console.log(req.cookies);

      bcrypt.hash(reqpassword, 10, function (err, hash) {


        con.release();
        console.log(hash);
        // Store hash in your password DB.
        hashpass = hash;
        let result3 = bcrypt.compareSync("gvuyuv", hashpass);
        console.log(result3);
        if (result3) {
          const jwttoken = jwt.sign(
            { code: hash },
            "secret_this_should_be_longer",
            { expiresIn: "1h" }
          );
          const cookieOption = {
            expiresIn: new Date(
              Date.now() + 24 * 3600
            ),
            httpOnly: true
          }
          res.cookie('essai', jwttoken, cookieOption);
        };
        con.query(
          "insert into user (email, password2) values (?,?)", [reqemail, hashpass]
          ,

          function (err, result) {


            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

            if (err) {
              res.send({ status: 1, message: "TODO creation fail" + err });
            } else {

              res.send({ status: 0, message: "TODO create success" + result });
              console.log("Post successful");
              con.release();
            }
          }
        );
      });

    });
  }
  this.reqpmu = function (req, res) {
    connection.acquire(function (err, con) {
      console.log("Connecté à la base de données MySQL!");
      con.query(req, function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
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
        "insert into bateau (nom) values ('?') ",
        req,
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
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

  this.reqtir = function (posX, posY, res) {
    connection.acquire(function (err, con) {
      console.log(err);
      console.log("Connecté à la base de données MySQL!");

      con.query(
        "insert into plateau (placeX, placeY) values (?,?) ",
        [posX,
          posY],
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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
  this.deleteplateau = function (res) {
    connection.acquire(function (err, con) {
      console.log(err);
      console.log("Connecté à la base de données MySQL!");

      con.query(
        "delete from plateau where idplateau>=1 ",

        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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
  this.deleteposition = function (res) {
    connection.acquire(function (err, con) {
      console.log(err);
      console.log("Connecté à la base de données MySQL!");

      con.query(
        "delete from position2 where bateau_idbateau>=1 ",

        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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

  this.reqplace = function (bateau, plateau, res) {
    connection.acquire(function (err, con) {
      console.log(err);
      console.log("Connecté à la base de données MySQL!");

      con.query(
        "insert into position2 (bateau_idbateau, plateau_idplateau) values (" + bateau + "," + plateau + ")",
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
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
  this.createpmu = function (text, res) {
    connection.acquire(function (err, con) {
      con.query("?", text, function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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
  this.gettir = function (res) {
    connection.acquire(function (err, con) {

      con.query("SELECT * FROM position2 right JOIN plateau ON position2.plateau_idplateau = plateau.idplateau WHERE position2.plateau_idplateau is null ", function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");




        res.send(result);
        console.log("Get successful");
      });
    });
  };
  this.getbateau = function (res) {
    connection.acquire(function (err, con) {

      con.query("SELECT * FROM position2 right JOIN plateau ON position2.plateau_idplateau = plateau.idplateau WHERE position2.plateau_idplateau ", function (err, result) {
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
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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
  this.deletetout = function (req, res) {
    connection.acquire(function (err, con) {
      con.query(
        "delete from todo_list where id>1",
        function (err, result) {
          con.release();
          if (err) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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
