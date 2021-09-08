function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function makenom(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function postBateau(part) {
  //alert($("#partie").val());
  var quiestu2 = "!!robot!!";

  fetch("/insertrobot/bateau", {
    method: "POST",
    body: JSON.stringify({
      nom: makenom(10),
      bateauX: getRandomInt(5),
      bateauY: getRandomInt(5),
      email: quiestu2,
      partie: part,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => {
      resp.json().then((data) => {
        $("#info").append("<span>" + JSON.stringify(data) + "</br></span>");
        // alert(JSON.stringify(data));
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function postAqui() {
  //alert($("#partie").val());
  var quiestu2 = "!!robot!!";

  $.getJSON("/qui", function (data1) {
    console.log(data1);

    fetch("/updaterobotj2", {
      method: "POST",
      body: JSON.stringify({
        robot: "!!robot!!",
        joueur1: data1.message.split("Vous êtes ")[1].replace('"', ""),
        tourj1: 1,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        resp.json().then((data) => {
        
          tirrobot();
        
                actumesbateau(),
                tempsReelQui(),
                actutirs()  
                savoirsitirer();
                
               console.log("TTTTTTTTTTTTTESSSSSSSSSSSSSTTTTTTTTTTTTTTT");

        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
function postpartie() {
  //alert($("#partie").val());
  var quiestu2 = "!!robot!!";
  // alert(quiestu2);

  fetch("/insert/partie", {
    method: "POST",
    body: JSON.stringify({
      joueur2: "!!robot!!",
      tourj1: getRandomInt(2),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => {
      resp.json().then((data) => {
        console.log(data);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function fetchPartie() {
  try {
    $("#rob").empty();
    var quiestu2 = $("#qui").html().split("Vous êtes ")[1].replace('"', "");
    fetch("/joueur/" + quiestu2 + "/!!robot!!").then(function (response) {
      let list1 = [];
      // The API call was successful!
      if (response.ok) {
        let data = response.json().then((data) => {
          data.message.forEach((element) => {
            //alert(element.idAdversaire);
            //  $("#partie").append("<option value="+element.idAdversaire+">j1: "+element.joueur1+" j2: "+element.joueur2+"</option>");
            list1.push(element.idAdversaire);
            postBateau(list1[0]);
          });
          console.log("/////" + list1);
        });
      }
    });
  } catch (error) {
    window.location.href = "/";
  }
}

function effacerBateauBis() {
  try {
    var quiestu2 = $("#qui").html().split("Vous êtes ")[1].replace('"', "");
    var adv = $("#contreadv").html();
    fetch("/effacerBateau", {
      method: "POST",
      body: JSON.stringify({
        adv: $("#contreadv").html(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        resp.json().then((data) => {
          $("#info").append("<span>" + JSON.stringify(data) + "</br></span>");
          //alert(JSON.stringify(data));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    window.location.href = "/";
  }
}
function effacerBateauBisRobot() {
  try {
    var quiestu2 = $("#qui").html().split("Vous êtes ")[1].replace('"', "");
    var robot = "!!robot!!";
    var adv = $("#contreadv").html();
    fetch("/effacerBateauRobot", {
      method: "POST",
      body: JSON.stringify({
        robot: robot,
        adv: quiestu2,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        resp.json().then((data) => {
          $("#info").append("<span>" + JSON.stringify(data) + "</br></span>");
          //alert(JSON.stringify(data));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    window.location.href = "/";
  }
}

function effacerTirBis() {
  try {
    var quiestu2 = $("#qui").html().split("Vous êtes ")[1].replace('"', "");
    var adv = $("#contreadv").html();
    fetch("/deletetir", {
      method: "POST",
      body: JSON.stringify({
        email: quiestu2,
        adversaire: $("#contreadv").html(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        resp.json().then((data) => {
          $("#info").append("<span>" + JSON.stringify(data) + "</br></span>");
          // alert(JSON.stringify(data));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    window.location.href = "/";
  }
}
function effacerTirBisRobot() {
  try {
    var quiestu2 = $("#qui").html().split("Vous êtes ")[1].replace('"', "");
    var adv = $("#contreadv").html();
    fetch("/deletetir", {
      method: "POST",
      body: JSON.stringify({
        email: "!!robot!!",
        adversaire: quiestu2,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        resp.json().then((data) => {
          $("#info").append("<span>" + JSON.stringify(data) + "</br></span>");
          // alert(JSON.stringify(data));
          restoreColor();
          actutirsparemail2($("#contreadv").html());
          actutirsparemail($("#contreadv").html());
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    window.location.href = "/";
  }
}
function tirrobot() {
  try {
    var quiestu2 = $("#qui").html().split("Vous êtes ")[1].replace('"', "");
    var adv = $("#contreadv").html();
    var posXenvoi = getRandomInt(5);
    var posYenvoi = getRandomInt(5);
    fetch("/robot/tir", {
      method: "POST",
      body: JSON.stringify({
        email: "!!robot!!",
        adversaire: quiestu2,
        posX: posXenvoi,
        posY: posYenvoi,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        resp.json().then((data) => {
          var socket = io();
          socket.emit(
            "chat message",
            "!!robot!! tire sur " +
              quiestu2 +
              "en X: " +
              posXenvoi +
              "et en Y: " +
              posYenvoi
          );

          //alert("tir robot :"+JSON.stringify(data));

          savoirsitirer();
          actumesbateau();
          actutirs();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    window.location.href = "/";
  }
}
function fetchConversation() {
  fetch("/conversation").then(function (response) {
    // The API call was successful!
    if (response.ok) {
      let data = response.json().then((data) => {
        data.forEach((element) => {
          $("#receiveMsg").append(
            element.user + ":" + element.message + "<br>"
          );
        });
      });
    }
  });
}

let plus = 30;
function tailleplus() {
  ++plus;
  $("td").width(plus);
  $("td").height(plus);
}
function taillemoins() {
  --plus;
  $("td").height(plus);
}
