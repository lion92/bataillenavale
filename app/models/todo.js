var connection = require("../config/connection");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
var express = require("express");

var app = express();
var messagebis = "diidoi";
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));
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
  this.reqdeconnexion = function (req, res) {
    res.clearCookie("essai");
    res.send({ status: 200, message: "deconnexion" });
  };

  this.reqlogin = function (reqemail, reqpassword, req, res) {
    let conection2 = false;
    let email = "";
    jwt.verify(
      req.cookies["essai"],
      "secret_this_should_be_longer",
      function (err, decoded) {
        //console.log("////////////");
        if (decoded === undefined) {
          conection2 = true;
        } else {
          email = decoded.email;
          conection2 = false;
        }
        ////console.log(decoded.code) // bar
      }
    );
    if (conection2 == true) {
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "select password2 from user where email=?",
          reqemail,
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "email" });
            } else {
              // res.send({ status: 0, message:  result[0].password2});
              //console.log("Post successful");
              if (!result[0]) {
                res.send({ status: 1, message: "email invalid" });
              } else {
                bcrypt.compare(
                  reqpassword,
                  result[0].password2,
                  function (err, result2) {
                    // result == true
                    if (err) {
                      res.send({
                        status: 0,
                        message:
                          "Erreur pour comparer les mots de passe " + reqemail,
                      });
                      con.release();
                    }
                    if (!result2) {
                      res.send({
                        status: 0,
                        message: "Mot de passe incorrect pour " + reqemail,
                      });
                    } else {
                      const jwttoken = jwt.sign(
                        { email: reqemail },
                        "secret_this_should_be_longer",
                        { expiresIn: "1h" }
                      );
                      const cookieOption = {
                        expiresIn: new Date(Date.now() + 24 * 3600),
                        httpOnly: true,
                      };
                      res.cookie("essai", jwttoken, cookieOption);
                      res.send({
                        status: 0,
                        message: "Connecte " + reqemail + result2,
                      });
                    }
                  }
                );
              }
            }
          }
        );
      });
    } else {
      // res.clearCookie("essai");
      res.send({ status: 1, message: "Connecté " + email });
    }
  };
  this.reqgister = function (reqemail, reqpassword, req, res) {
    let hashpass = "";
    let bon = "";
    connection.acquire(function (err, con) {
      //console.log(err);
      //console.log("Connecté à la base de données MySQL!");
      req.cookies.title = "GeeksforGeeks";
      //console.log(req.cookies);

      bcrypt.hash(reqpassword, 10, function (err, hash) {
        if (err) {
          res.send({ status: 1, message: "Erreur" + err });
        } else {
          //console.log(hash);
          // Store hash in your password DB.
          hashpass = hash;

          con.query(
            "insert into user (email, password2) values (?,?)",
            [reqemail, hashpass],
            function (err, result) {
              res.header("Access-Control-Allow-Origin", "*");
              res.header(
                "Access-Control-Allow-Methods",
                "GET,HEAD,OPTIONS,POST,PUT"
              );
              res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
              );

              if (err) {
                //console.log("KKKKKKKKKKKKKKKKKK");
                res.send({
                  status: 1,
                  message: "Erreur de conection ou login existe" + err,
                });
                con.release();
              } else {
                //console.log("IIIIIIIIIIIIIIIIIIIIIII");
                res.send({
                  status: 0,
                  message: "Utilisateur enregistrer " + reqemail,
                });
                //console.log("Post successful");
                con.release();
              }
            }
          );
        }
      });
    });
  };
  this.enregistrerMsg = function (user, msg) {
    connection.acquire(function (err, con) {
      //console.log(err);
      //console.log("Connecté à la base de données MySQL!");

      //console.log(req.cookies);

      //console.log(hash);
      // Store hash in your password DB.

      con.query(
        "insert into message (user, message) values (?,?)",
        [user, msg],
        function (err, result) {
          if (err) {
            //console.log("KKKKKKKKKKKKKKKKKK");

            con.release();
          } else {
            //console.log("IIIIIIIIIIIIIIIIIIIIIII");

            //console.log("Post successful");
            con.release();
          }
        }
      );
    });
  };

  this.chatkriss = function (msg) {
    connection.acquire(function (err, con) {
      //console.log(err);
      //console.log("Connecté à la base de données MySQL!");

      //console.log(req.cookies);

      //console.log(hash);
      // Store hash in your password DB.

      con.query(
        "insert into chatmsg (message) values (?)",
        [msg],
        function (err, result) {
          if (err) {
            //console.log("KKKKKKKKKKKKKKKKKK");

            con.release();
          } else {
            //console.log("IIIIIIIIIIIIIIIIIIIIIII");

            //console.log("Post successful");
            con.release();
          }
        }
      );
    });
  };
  this.reqpmu = function (req, res) {
    connection.acquire(function (err, con) {
      //console.log("Connecté à la base de données MySQL!");
      con.query(req, function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );
        if (err) {
          res.send({ status: 1, message: "TODO creation fail " + err });
        } else {
          res.send({ status: 0, message: "TODO create success " + result });
          //console.log("Post successful");
        }
      });
    });
  };
  this.reqbateau = function (nom, bateauX, bateauY, partie, req, res) {
    let conection2 = false;
    let email = "";
    jwt.verify(
      req.cookies["essai"],
      "secret_this_should_be_longer",
      function (err, decoded) {
        //console.log("////////////");
        if (decoded === undefined) {
          conection2 = true;
          //console.log("true");
        } else {
          email = decoded.email;
          conection2 = false;
          //console.log("!!!!!" + false);
        }
        ////console.log(decoded.code) // bar
      }
    );

    if (!(connection == true)) {
      //console.log("!!!!!");
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "insert into bateau (nom,bateauX, bateauY, email,idpartie) values (?,?,?,?,?) ",
          [nom, bateauX, bateauY, email, partie],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "TODO creation fail " + err });
            } else {
              res.send({
                status: 0,
                message:
                  "bateau poser " +
                  " PosX : " +
                  bateauX +
                  " posY : " +
                  bateauY +
                  " email: " +
                  email,
              });
              //console.log("Post successful");
            }
          }
        );
      });
    }
  };
  this.reqbateauRobot = function (nom, bateauX, bateauY, email, partie, req, res) {
    


      //console.log("!!!!!");
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "insert into bateau (nom,bateauX, bateauY, email,idpartie) values (?,?,?,?,?) ",
          [nom, bateauX, bateauY, email, partie],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "TODO creation fail " + err });
            } else {
              res.send({
                status: 0,
                message:
                  "bateau poser " +
                  " PosX : " +
                  bateauX +
                  " posY : " +
                  bateauY +
                  " email: " +
                  email,
              });
              //console.log("Post successful");
            }
          }
        );
      });
    
  };

  this.reqtir = function (posX, posY, adversaire, req, res) {
    connection.acquire(function (err, con) {
      let conection2 = false;
      let email = "";
      jwt.verify(
        req.cookies["essai"],
        "secret_this_should_be_longer",
        function (err, decoded) {
          //console.log("////////////");
          if (decoded === undefined) {
            conection2 = true;
            res.send({ status: 1, message: "veillez vous connecter " });
          } else {
            email = decoded.email;
            conection2 = false;
          }
          ////console.log(decoded.code) // bar
        }
      );

      if (!(conection2 == true)) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "insert into plateau (placeX, placeY, email,adversaire) values (?,?,?,?) ",
          [posX, posY, email, adversaire],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "Erreur" + err + email });
            } else {
              res.send({
                status: 0,
                message:
                  "Tirer en POsX " + posX + " posY : " + posY + "par " + email,
              });
              //console.log("Post successful");
            }
          }
        );
      }
    });
  };

  
  this.reqtirRobot = function (posX, posY, adversaire, email, req, res) {
    connection.acquire(function (err, con) {
     
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "insert into plateau (placeX, placeY, email,adversaire) values (?,?,?,?) ",
          [posX, posY, email, adversaire],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "Erreur" + err + email });
            } else {
              res.send({
                status: 0,
                message:
                  "Tirer en POsX " + posX + " posY : " + posY + "par " + email,
              });
              //console.log("Post successful");
            }
          }
        );
        })

  };

  this.reqtouche = function (posX, posY, req, res) {
    connection.acquire(function (err, con) {
      let conection2 = false;
      let email = "";
      jwt.verify(
        req.cookies["essai"],
        "secret_this_should_be_longer",
        function (err, decoded) {
          //console.log("////////////");
          if (decoded === undefined) {
            conection2 = true;
            res.send({ status: 1, message: "veillez vous connecter " });
          } else {
            email = decoded.email;
            conection2 = false;
          }
          ////console.log(decoded.code) // bar
        }
      );

      if (!(conection2 == true)) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "select nom,email,bateauX,bateauY from bateau where bateauX=? and bateauY=? ",
          [posX, posY],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({
                status: 1,
                message: "TODO creation fail " + err + email,
              });
            } else {
              if (result.lenght < 1) {
                //console.log("++++++" + result);
                res.send({ status: 0, message: "aucun bateau touche" });
              } else {
                res.send({ status: 0, message: " Touche ", qui: result });
                //console.log("Post successful");
              }
            }
          }
        );
      }
    });
  };
  this.reqeffacerbateau = function (adv, req, res) {
    connection.acquire(function (err, con) {
      let conection2 = false;
      let email = "";
      jwt.verify(
        req.cookies["essai"],
        "secret_this_should_be_longer",
        function (err, decoded) {
          //console.log("////////////");
          if (decoded === undefined) {
            conection2 = true;
            res.send({ status: 1, message: "veillez vous connecter " });
          } else {
            email = decoded.email;
            conection2 = false;
          }
          ////console.log(decoded.code) // bar
        }
      );

      if (!(conection2 == true)) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "DELETE w FROM bateau w INNER JOIN partieactu e ON w.idpartie=e.idAdversaire WHERE email=? AND (joueur1=? or joueur2=?);",
          [email, adv, adv],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({
                status: 1,
                message: "TODO creation fail " + err + email,
              });
            } else {
              if (result == "") {
                res.send({ status: 0, message: "bateaux effacés" });
              } else {
                res.send({ status: 0, message: "bateaux effacés" + email });
                //console.log("Post successful");
              }
            }
          }
        );
      }
    });
  };

  this.reqeffacerbateaurobot = function (robot,adv, req, res) {
    connection.acquire(function (err, con) {
     
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "DELETE w FROM bateau w INNER JOIN partieactu e ON w.idpartie=e.idAdversaire WHERE email=? AND (joueur1=? or joueur2=?);",
          [robot, adv, adv],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({
                status: 1,
                message: "TODO creation fail " + err ,
              });
            } else {
              if (result == "") {
                res.send({ status: 0, message: "bateaux effacés" });
              } else {
                res.send({ status: 0, message: "bateaux effacés"  });
                //console.log("Post successful");
              }
            }
          }
        );
        })
  };
  this.selectbateauparmail = function (adv, req, res) {
    connection.acquire(function (err, con) {
      let conection2 = false;
      let email = "";
      jwt.verify(
        req.cookies["essai"],
        "secret_this_should_be_longer",
        function (err, decoded) {
          //console.log("////////////");
          if (decoded === undefined) {
            conection2 = true;
            res.send({ status: 1, message: "veillez vous connecter " });
          } else {
            email = decoded.email;
            conection2 = false;
          }
          ////console.log(decoded.code) // bar
        }
      );

      if (!(conection2 == true)) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "select * from bateau INNER JOIN partieactu ON bateau.idpartie = partieactu.idAdversaire where email=? and (joueur1=? or joueur2=?)",
          [email, adv, adv],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({
                status: 1,
                message: "TODO creation fail " + err + email,
              });
            } else {
              if (result == "") {
                res.send({ status: 0, message: result });
              } else {
                res.send({ status: 0, message: result });
                //console.log("Post successful");
              }
            }
          }
        );
      }
    });
  };

  this.selectbateauRobot= function (robot,adv, req, res) {
    connection.acquire(function (err, con) {
      

     
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "select * from bateau INNER JOIN partieactu ON bateau.idpartie = partieactu.idAdversaire where email=? and (joueur1=? or joueur2=?)",
          [robot, adv, adv],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({
                status: 1,
                message: "TODO creation fail " + err + email,
              });
            } else {
              if (result == "") {
                res.send({ status: 0, message: result });
              } else {
                res.send({ status: 0, message: result });
                //console.log("Post successful");
              }
            }
          }
        );
    })
  };
  this.deleteplateau = function (email, adv,req, res) {
    connection.acquire(function (err, con) {
      //console.log(err);
      //console.log("Connecté à la base de données MySQL!");

      con.query(
        "delete from plateau where email=? and adversaire=? ",
        [email, adv],
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send({ status: 1, message: "TODO creation fail " + err });
          } else {
            res.send({ status: 0, message: "TODO create success " + result });
            //console.log("Post successful");
          }
        }
      );
    });
  };
  this.deleteplateauemail = function (req, res) {
    connection.acquire(function (err, con) {
      //console.log(err);
      //console.log("Connecté à la base de données MySQL!");

      con.query(
        "delete from plateau where idplateau>=1 and email=?",
        req,

        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send({ status: 1, message: "TODO creation fail " + err });
          } else {
            res.send({ status: 0, message: "TODO create success " + result });
            //console.log("Post successful");
          }
        }
      );
    });
  };
  this.deleteposition = function (res) {
    connection.acquire(function (err, con) {
      //console.log(err);
      //console.log("Connecté à la base de données MySQL!");

      con.query(
        "delete from position2 where bateau_idbateau>=1 ",

        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send({ status: 1, message: "TODO creation fail " + err });
          } else {
            res.send({ status: 0, message: "TODO create success " + result });
            //console.log("Post successful");
          }
        }
      );
    });
  };

  this.reqplace = function (bateau, plateau, res) {
    connection.acquire(function (err, con) {
      //console.log(err);
      //console.log("Connecté à la base de données MySQL!");
      con.query(
        "insert into position2 (bateau_idbateau, plateau_idplateau) values (" +
          bateau +
          "," +
          plateau +
          ")",
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );
          if (err) {
            res.send({ status: 1, message: "TODO creation fail " + err });
          } else {
            res.send({ status: 0, message: "TODO create success " + result });
            //console.log("Post successful");
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
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );

        if (err) {
          res.send({ status: 1, message: "TODO creation fail" });
        } else {
          res.send({ status: 0, message: "TODO create success" });
          //console.log("Post successful");
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
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );

        res.send(result);
        //console.log("Get successful");
      });
    });
  };
  this.gettir = function (res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT * FROM position2 right JOIN plateau ON position2.plateau_idplateau = plateau.idplateau WHERE position2.plateau_idplateau is null ",
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          res.send(result);
          //console.log("Get successful");
        }
      );
    });
  };
  this.gettirparemail = function (email, adversaire, req, res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT * FROM position2 right JOIN plateau ON position2.plateau_idplateau = plateau.idplateau WHERE position2.plateau_idplateau is null and email=? and adversaire=?",
        [email, adversaire],
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          res.send(result);
          //console.log("Get successful");
        }
      );
    });
  };
  this.reqconversation = function (req, res) {
    connection.acquire(function (err, con) {
      con.query("SELECT * FROM message", function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );

        res.send(result);
        //console.log("Get successful");
      });
    });
  };
  this.getemail = function (res) {
    connection.acquire(function (err, con) {
      con.query("select distinct(email) from plateau", function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );

        res.send(result);
        //console.log("Get successful");
      });
    });
  };
  this.chatkrissselect = function (req, res) {
    connection.acquire(function (err, con) {
      con.query("SELECT * FROM chatmsg", function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );

        res.send(result);
        //console.log("Get successful");
      });
    });
  };
  this.getbateau = function (res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT * FROM position2 right JOIN plateau ON position2.plateau_idplateau = plateau.idplateau WHERE position2.plateau_idplateau ",
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          res.send(result);
          //console.log("Get successful");
        }
      );
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
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          res.send(result);
          //console.log("Get by ID successful");
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
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );

        if (err) {
          res.send({ status: 1, message: "TODO creation fail" });
        } else {
          res.send({ status: 0, message: "TODO create success" });
          //console.log("Post successful");
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
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send({ status: 1, message: "TODO update fail" });
          } else {
            res.send({ status: 0, message: "TODO update success" });
            //console.log("Put successful");
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
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send({ status: 1, message: "TODO delete fail" });
          } else {
            res.send({ status: 0, message: "TODO delete success" });
            //console.log("Delete successful");
          }
        }
      );
    });
  };
  this.deletetout = function (req, res) {
    connection.acquire(function (err, con) {
      con.query("delete from todo_list where id>1", function (err, result) {
        con.release();
        if (err) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          res.send({ status: 1, message: "TODO delete fail" });
        } else {
          res.send({ status: 0, message: "TODO delete success" });
          //console.log("Delete successful");
        }
      });
    });
  };
  this.reqpartie = function (joueur2, tourj1, req, res) {
    let conection2 = false;
    let email = "";
    jwt.verify(
      req.cookies["essai"],
      "secret_this_should_be_longer",
      function (err, decoded) {
        //console.log("////////////");
        if (decoded === undefined) {
          conection2 = true;
          //console.log("true");
          res.send({ status: 1, message: "Veuillez vous connecter" });
        } else {
          email = decoded.email;
          conection2 = false;
          //console.log("!!!!!" + false);
        }
        ////console.log(decoded.code) // bar
      }
    );

    if (!(conection2 == true)) {
      //console.log("!!!!!");
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "insert into partieactu (joueur1, joueur2, tourj1) values (?,?,?) ",
          [email, joueur2, tourj1],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "TODO creation fail " + err });
            } else {
              res.send({ status: 0, message: "partie creer contre" + joueur2 });
              //console.log("Post successful");
            }
          }
        );
      });
    }
  };

  this.reqjoueurencours = function (req, res) {
    let conection2 = false;
    let email = "";
    jwt.verify(
      req.cookies["essai"],
      "secret_this_should_be_longer",
      function (err, decoded) {
        //console.log("////////////");
        if (decoded === undefined) {
          conection2 = true;
          //console.log("true");
        } else {
          email = decoded.email;
          conection2 = false;
          //console.log("!!!!!" + false);
        }
        ////console.log(decoded.code) // bar
      }
    );

    if (!(connection == true)) {
      //console.log("!!!!!");
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "select email from bateau",

          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "TODO creation fail " + err });
            } else {
              res.send({ status: 0, message: result });
              //console.log("Post successful");
            }
          }
        );
      });
    }
  };
  this.reqjoueurencours = function (req, res) {
    let conection2 = false;
    let email = "";
    jwt.verify(
      req.cookies["essai"],
      "secret_this_should_be_longer",
      function (err, decoded) {
        //console.log("////////////");
        if (decoded === undefined) {
          conection2 = true;
          //console.log("true");
        } else {
          email = decoded.email;
          conection2 = false;
          //console.log("!!!!!" + false);
        }
        ////console.log(decoded.code) // bar
      }
    );

    if (!(connection == true)) {
      //console.log("!!!!!");
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "select * from partieactu",

          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "TODO creation fail " + err });
            } else {
              res.send({ status: 0, message: result });
              //console.log("Post successful");
            }
          }
        );
      });
    }
  };

  this.reqjoueurencoursIndependant = function (joueur2, req, res) {
    let conection2 = false;
    let email = "";
    jwt.verify(
      req.cookies["essai"],
      "secret_this_should_be_longer",
      function (err, decoded) {
        //console.log("////////////");
        if (decoded === undefined) {
          conection2 = true;
          //console.log("true");
        } else {
          email = decoded.email;
          conection2 = false;
          //console.log("!!!!!" + false);
        }
        ////console.log(decoded.code) // bar
      }
    );

    if (!(connection == true)) {
      //console.log("!!!!!");
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "select * from partieactu where joueur1=? and joueur2=?",[email, joueur2],

          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "TODO creation fail " + err });
            } else {
              res.send({ status: 0, message: result });
              //console.log("Post successful");
            }
          }
        );
      });
    }
  };










  this.reqjoueurencoursIndependantj2 = function (joueur2, req, res) {
    let conection2 = false;
    let email = "";
    jwt.verify(
      req.cookies["essai"],
      "secret_this_should_be_longer",
      function (err, decoded) {
        //console.log("////////////");
        if (decoded === undefined) {
          conection2 = true;
          //console.log("true");
        } else {
          email = decoded.email;
          conection2 = false;
          //console.log("!!!!!" + false);
        }
        ////console.log(decoded.code) // bar
      }
    );

    if (!(connection == true)) {
      //console.log("!!!!!");
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "select * from partieactu where joueur1=? and joueur2=?",[joueur2, email],

          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "TODO creation fail " + err });
            } else {
              res.send({ status: 0, message: result });
              //console.log("Post successful");
            }
          }
        );
      });
    }
  };
















  this.reqjoueurRobot = function (qui,adv,req, res) {
   
      //console.log("!!!!!");
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "select * from partieactu where joueur1=? and joueur2=?",[qui,adv],

          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "TODO creation fail " + err });
            } else {
              res.send({ status: 0, message: result });
              //console.log("Post successful");
            }
          }
        );
      });
    
  };
  this.selectpartie = function (req, res) {
    let conection2 = false;
    let email = "";
    jwt.verify(
      req.cookies["essai"],
      "secret_this_should_be_longer",
      function (err, decoded) {
        //console.log("////////////");
        if (decoded === undefined) {
          conection2 = true;
          //console.log("true");
        } else {
          email = decoded.email;
          conection2 = false;
          //console.log("!!!!!" + false);
        }
        ////console.log(decoded.code) // bar
      }
    );

    if (!(connection == true)) {
      //console.log("!!!!!");
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "select * from partieactu where joueur1=? or joueur2=?",
          [email, email],

          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "TODO creation fail " + err });
            } else {
              res.send({ status: 0, message: result });
              //console.log("Post successful");
            }
          }
        );
      });
    }
  };
  this.requpdatetourj1 = function (tourj1, joueur1, req, res) {
    let conection2 = false;
    let email = "";
    jwt.verify(
      req.cookies["essai"],
      "secret_this_should_be_longer",
      function (err, decoded) {
        //console.log("////////////");
        if (decoded === undefined) {
          conection2 = true;
          //console.log("true");
        } else {
          email = decoded.email;
          conection2 = false;
          //console.log("!!!!!" + false);
        }
        ////console.log(decoded.code) // bar
      }
    );

    if (!(connection == true)) {
      //console.log("!!!!!");
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "update partieactu set tourj1=? where joueur1=? and joueur2=?",
          [tourj1, email, joueur1],

          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "TODO creation fail " + err });
            } else {
              if (tourj1 == 0) {
                res.send({
                  status: 0,
                  message: "c est votre tour" + JSON.stringify(result),
                });
                //console.log("Post successful");
              } else {
                res.send({
                  status: 0,
                  message:
                    "c est au tour de votre adversaire" +
                    JSON.stringify(result),
                });
                //console.log("Post successful");
              }
            }
          }
        );
      });
    }
  };
  this.requpdatetourj2 = function (tourj1, joueur2, req, res) {
    let conection2 = false;
    let email = "";
    jwt.verify(
      req.cookies["essai"],
      "secret_this_should_be_longer",
      function (err, decoded) {
        //console.log("////////////");
        if (decoded === undefined) {
          conection2 = true;
          //console.log("true");
        } else {
          email = decoded.email;
          conection2 = false;
          //console.log("!!!!!" + false);
        }
        ////console.log(decoded.code) // bar
      }
    );

    if (!(connection == true)) {
      //console.log("!!!!!");
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "update partieactu set tourj1=? where joueur1=? and joueur2=?",
          [tourj1, joueur2, email],

          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "TODO creation fail " + err });
            } else {
              if (tourj1 == 1) {
                res.send({
                  status: 0,
                  message: "c est votre tour" + JSON.stringify(result),
                });
                //console.log("Post successful");
              } else {
                res.send({
                  status: 0,
                  message:
                    "c est au tour de votre adversaire" +
                    JSON.stringify(result),
                });
                //console.log("Post successful");
              }
            }
          }
        );
      });
    }
  };
  this.requpdatetourobotj2 = function (tourj1, joueur1,robot, req, res) {
   
      //console.log("!!!!!");
      connection.acquire(function (err, con) {
        //console.log(err);
        //console.log("Connecté à la base de données MySQL!");

        con.query(
          "update partieactu set tourj1=? where joueur1=? and joueur2=?",
          [tourj1, joueur1, robot],

          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "TODO creation fail " + err });
            } else {
              if (tourj1 == 1) {
                res.send({
                  status: 0,
                  message: "c est votre tour" + JSON.stringify(result),
                });
                //console.log("Post successful");
              } else {
                res.send({
                  status: 0,
                  message:
                    "c est au tour de votre adversaire" +
                    JSON.stringify(result),
                });
                //console.log("Post successful");
              }
            }
          }
        );
        })
  };
  this.quiesttu = function (req, res) {
    let conection2 = false;
    let email = "";
    jwt.verify(
      req.cookies["essai"],
      "secret_this_should_be_longer",
      function (err, decoded) {
        //console.log("////////////");
        if (decoded === undefined) {
          conection2 = true;
          //console.log("true");
          res.send({
            status: 1,
            message: "Qui êtes vous?, Veuillez-vous connecter. ",
          });
        } else {
          email = decoded.email;
          conection2 = false;
          //console.log("!!!!!" + false);
          res.send({ status: 1, message: "Vous êtes " + email });
        }
        ////console.log(decoded.code) // bar
      }
    );
  };
}

module.exports = new Todo();
