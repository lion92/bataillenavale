function poserbateau() {
  var positionX = Number($("#inputX").val());
  var positionY = Number($("#inputY").val());
  console.log("OOOO" + positionX);

  $("td").mouseover(function () {});
  var posX;
  var posY;
  var hoverY;
  var hoverX;

  $("td").hover(
    function () {
      posX = Number(this.id.replace("td", "").substr(0, 1));
      posY = Number(this.id.replace("td", "").substr(1, 2));
      hoverX = posX + positionX;
      hoverY = posY + positionY;
      console.log("X :" + posX + "Y :" + posY);
      console.log("#" + posX + posY);
      // $(  this).css( "background-color", "green" );

      $(this).css("background-color", "green");
      $("#td" + hoverX + hoverY).css("border-radius", "25px");
      //  $('#td'+(hoverX-1)+(hoverY-1)).css( "background-color", "green" );
    },

    function () {
      //$(  this).css( "background-color", "gray" );
      //$('#td'+hoverX+hoverY).css( "background-color", "gray" );

      $(this).css("background-color", "gray");
      $("#td" + hoverX + hoverY).css("background-color", "gray");

      // $('#td'+(hoverX-1)+(hoverY-1)).css( "background-color", "gray" );
    }
  );
}

function actu() {
  $("#insert").empty();
  $.getJSON("/todo", function (data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      $("#insert").append(
        "id :  " +
          data[i].id +
          " " +
          data[i].name +
          "                 " +
          "   <br>                      date :  " +
          data[i].date +
          " " +
          "<br>"
      );
    }
  });
}
// fetch("/joueur").then(function (response) {
//   var quiestu2=$("#qui").html().split("Vous êtes ")[1].replace('"',"");

//   // The API call was successful!
//   if (response.ok) {
//   let data = response.json().then((data) => {
function quiestu() {
  $("#qui").empty();

  fetch("/qui").then(function (response) {
    if (response.ok) {
      response.json().then((data) => {
        $("#qui").append(JSON.stringify(data.message));

        actu();
        actubateau();
        actutirs();

        $("#tacheCree").submit(function (e) {
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              actu();
              ///   console.log(data); // show response from the php script.
            },
            error: function (data) {
              console.log(data.message);
            },
          });
        });

        $("#delete").submit(function (e) {
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              actu();
              ///   console.log(data); // show response from the php script.
            },
            error: function (data) {
              console.log(data.message);
            },
          });
        });
        $("#joueur").submit(function (e) {
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "Get",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              actu();
              console.log(JSON.stringify(data.message));
              ///   console.log(data); // show response from the php script.
            },
            error: function (data) {
              console.log(data.message);
            },
          });
        });
        $("#tour").submit(function (e) {
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "Get",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              actu();
              var qui = data.message;

              for (var i = 0; i < qui.length; i++) {
                console.log(qui[i].joueur1);
                console.log(qui[i].joueur2);
              }
              console.log(JSON.stringify(data.message));
              ///   console.log(data); // show response from the php script.
            },
            error: function (data) {
              console.log(data.message);
            },
          });
        });

        $("#updatej1").submit(function (e) {
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              actu();
              console.log(data.message);
              $("#joueuractu").submit();
              ///   console.log(data); // show response from the php script.
            },
            error: function (data) {
              console.log(data.message);
            },
          });
        });
        $("#changeone").text(1);

        var actualiser = "";
        $("#joueuractu").submit(function (e) {
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "GET",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              if (actualiser != JSON.stringify(data.message)) {
                actualiser = JSON.stringify(data.message);

                //alert("C'est peut être votre tour :"+JSON.stringify(data.message));
                //  alert(JSON.stringify(data.message));
                var quiestu1 = $("#qui").html();
                if (quiestu1 !== "Qui êtes vous?, Veuillez-vous connecter.") {
                  var quiestu = $("#qui")
                    .html()
                    .split("Vous êtes ")[1]
                    .replace('"', "");

                  console.log(quiestu);
                  console.log(data.message);
                  console.log(data.message);
                  var generate = "";
                  $("#adversaire").empty();
                  generate +=
                    "<select  multiple='oui'  onclick='aquidejouerIndependant();savoirsitirer()' onchange='aquidejouerIndependant();actumesbateau(),tempsReelQui()' id='quiadversaire'><nom>Adversaire</nom>)";

                  for (var i = 0; i < data.message.length; i++) {
                    if (quiestu == data.message[i].joueur1) {
                      console.log(
                        "vous êtes joueur1 contre" + data.message[i].joueur2
                      );

                      if (data.message[i].tourj1 == 1) {
                        $("#info").append(
                          "<span>" +
                            "C'est votre tour contre :" +
                            data.message[i].joueur2 +
                            "</br></span>"
                        );
                        //alert("C'est votre tour contre :"+data.message[i].joueur2)
                        generate +=
                          "  <option value=XXXT1" +
                          data.message[i].tourj1 +
                          ">" +
                          data.message[i].joueur2 +
                          "</option>    ";
                      } else if (data.message[i].tourj1 == 0) {
                        console.log(
                          "C'est le tour de :" + data.message[i].joueur2
                        );
                        generate +=
                          "  <option value=XXXT1" +
                          data.message[i].tourj1 +
                          ">" +
                          data.message[i].joueur2 +
                          "</option>    ";
                      }
                    } else if (quiestu == data.message[i].joueur2) {
                      console.log(
                        "vous êtes joueur2 contre" + data.message[i].joueu1
                      );
                      if (data.message[i].tourj1 == 0) {
                        $("#info").append(
                          "<span>" +
                            "C'est votre tour contre :" +
                            data.message[i].joueur1 +
                            "</br></span>"
                        );
                        // alert("C'est votre tour contre :"+data.message[i].joueur1)
                        generate +=
                          "  <option value=XXXT2" +
                          data.message[i].tourj1 +
                          ">" +
                          data.message[i].joueur1 +
                          "</option>    ";
                      } else if (data.message[i].tourj1 == 1) {
                        console.log(
                          "C'est le tour de :" + data.message[i].joueur1
                        );
                        generate +=
                          "  <option value=XXXT2" +
                          data.message[i].tourj1 +
                          ">" +
                          data.message[i].joueur1 +
                          "</option>    ";
                      }
                    }
                    console.log(generate);
                    $("#adversaire").empty().append(generate);
                  }
                  actubateau();
                  actu();
                  console.log(JSON.stringify(data.message));
                  ///   console.log(data); // show response from the php script.
                } else {
                  console.log("Veuillez vous connecter.");
                }
              }
              restoreColor();
              actutirsparemail2($("#contreadv").html());
              actutirsparemail($("#contreadv").html());

              $("#changeone").text(2);
            },
            error: function (data) {
              $("#info").append(
                "<span>" + JSON.stringify(data) + "</br></span>"
              );
              //alert(JSON.stringify(data));
            },
          });
        });
        $(".menu").click(function () {
          $("header div").toggle();
        });
        $("#updatej2").submit(function (e) {
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              console.log(data.message);
              actu();
              $("#joueuractu").submit();
              ///   console.log(data); // show response from the php script.
            },
            error: function (data) {
              console.log(data.message);
            },
          });
        });

        $("#partie").submit(function (e) {
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              console.log(JSON.stringify(data.message));
              actu();
              ///   console.log(data); // show response from the php script.
            },
            error: function (data) {
              console.log(data.message);
            },
          });
        });

        $("#positionbateau").submit(function (e) {
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              actu();
              console.log(data.message);
              ///   console.log(data); // show response from the php script.
            },
            error: function (data) {
              console.log(data.message);
            },
          });
        });
        $("#deleteparemail").submit(function (e) {
          var form = $(this);
          var url = "deletetir/" + $("#reqmail").val();
          e.preventDefault();
          if ($("#reqmail").val() == "" || $("#reqmail").val() === undefined) {
            console.log("email vide");
          } else {
            // avoid to execute the actual submit of the form.

            $.ajax({
              type: "POST",
              url: url,
              data: form.serialize(), // serializes the form's elements.
              success: function (data) {
                actu();
                document.location.href = "/";
                ///   console.log(data); // show response from the php script.
              },
              error: function (data) {
                console.log(data.message);
              },
            });
          }
        });
        $("#email").submit(function (e) {
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "GET",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              $("#emailAff").empty();
              for (let i = 0; i < data.length; i++) {
                console.log(data[i].email);
                $("#emailAff").append("" + data[i].email + "<br>");
              }

              actu();
              ///   console.log(data); // show response from the php script.
            },
            error: function (data) {
              console.log("error");
            },
          });
        });
        $("#tirdessus").submit(function (e) {
          $("#adv").val("");
          $("#adv").val($("#contreadv").html());
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              console.log(data.message);
              actutirs();
              var socket = io();

              restoreColor();

              $("#iciX").val($("#selectX").val());

              $("#iciY").val($("#selectY").val());
              $("#touche").submit();

              $("#joue1").val($("#contreadv").html());
              $("#joue2").val($("#contreadv").html());
              $("#tourj1").val(0);
              $("#tourj2").val(1);
              $("#updatej1").submit();
              $("#updatej2").submit();
              $("#joueuractu").submit();
              $("#feu").hide();
              ///console.log(data); // show response from the php script.
            },
            error: function (data) {
              console.log(data.message);
            },
          });
        });

        $("#touche").submit(function (e) {
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              //console.log(data.message);
              //console.log("--//////"+JSON.stringify(data))
              if (data.qui !== undefined) {
                var reqemail = $("#contreadv").html();
                data.qui.forEach((element) => {
                  if (element.email === reqemail) {
                    $("#info").append(
                      "<span>" +
                        data.message +
                        " vous avez atteint :" +
                        element.email +
                        "dont le bateau est :" +
                        element.nom +
                        "</br></span>"
                    );
                    alert(
                      data.message +
                        " vous avez atteint :" +
                        element.email +
                        "dont le bateau est :" +
                        element.nom
                    );
                  }
                });
              } else {
                $("#info").append(
                  "<span>" + "aucun bateau touche" + "</br></span>"
                );
                //  alert("aucun bateau touche");
              }
              actutirs();
              ///console.log(data); // show response from the php script.
            },
            error: function (data) {
              $("#info").append("<span>" + data.message + "</br></span>");
              //alert(data.message);
            },
          });
        });

        $("#tirdelete").submit(function (e) {
          e.preventDefault(); // avoid to execute the actual submit of the form.

          var form = $(this);
          var url = form.attr("action");

          $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
              actutirs();

              savoirsitirer();
              actumesbateau();
              actutirs();
              ///console.log(data); // show response from the php script.
            },
          });
        });
        $("#effacerbateau").submit(function () {
          document.location.href = "/";
        });
        $("#joueuractu").submit();

        $("#updatej1").hide();
        $("#updatej2").hide();
        $("#partieencours").hide();
        quiestu2();
        var audioElement = document.createElement("audio");
        audioElement.setAttribute("src", "/son/tir.mp3");

        audioElement.addEventListener(
          "ended",
          function () {
            this.play();
          },
          false
        );

        audioElement.addEventListener("canplay", function () {
          $("#length").text("Duration:" + audioElement.duration + " seconds");
          $("#source").text("Source:" + audioElement.src);
          $("#status").text("Status: Ready to play").css("color", "green");
        });

        audioElement.addEventListener("timeupdate", function () {
          $("#currentTime").text("Current second:" + audioElement.currentTime);
        });

        $("#play").click(function () {
          audioElement.play();
          $("#status").text("Status: Playing");
          setTimeout(() => {
            audioElement.pause(), $("#status").text("Status: Paused");
          }, 5000);
        });

        $("#pause").click(function () {
          audioElement.pause();
          $("#status").text("Status: Paused");
        });

        $("#restart").click(function () {
          audioElement.currentTime = 0;
        });
        fetchConversation();
        var audioElement2 = document.createElement("audio");
        audioElement2.setAttribute("src", "/son/musiquefond.mp3");

        audioElement2.addEventListener(
          "ended",
          function () {
            this.play();
          },
          false
        );

        audioElement2.addEventListener("canplay", function () {
          $("#length2").text("Duration:" + audioElement2.duration + " seconds");
          $("#source2").text("Source:" + audioElement2.src);
          $("#status2").text("Status: Ready to play").css("color", "green");
        });

        audioElement2.addEventListener("timeupdate", function () {
          $("#currentTime2").text(
            "Current second:" + audioElement2.currentTime
          );
        });

        $("#play2").click(function () {
          audioElement2.play();
          $("#status").text("Status: Playing");
        });

        $("#pause2").click(function () {
          audioElement2.pause();
          $("#status2").text("Status: Paused");
        });

        $("#restart2").click(function () {
          audioElement2.currentTime = 0;
        });
        $("td").mouseover(function () {
          $("#textAff").css("visibility", "visible");
        });
        var socket = io();
        socket.emit("actuTir", $("#contreadv").html());
        $("td").mouseout(function () {
          $("#textAff").css("visibility", "hidden");
        });

        $("#joueuractu").submit();
        $("#feu").hide();
        savoirsitirer();
        actumesbateau();
        actutirs();
        socket.on("chat message", function (msg) {
          console.log(msg);
          $("#receiveMsg").append(msg + "</br>");
          restoreColor();
          actutirsparemail2($("#contreadv").html());
          actutirsparemail($("#contreadv").html());
        });
      });
    }
  });
}

function actutirs() {
  $.getJSON("/tirs", function (data) {
    for (var i = 0; i < data.length; i++) {
      console.log("" + data[i].placeX + data[i].placeY);

      //$("#td"+data[i].placeX+data[i].placeY).css("background-color", "red");
    }
    $("#joueuractu").submit();
  });
}
function actumesbateau() {
  $("#ou").empty();
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {}
  }
  if ($("#quiadversaire option:selected").text() !== "")
    $("#contreadv").empty().append($("#quiadversaire option:selected").text());
  let adversaire = $("#contreadv").html();
  $.getJSON("/mesbateau/" + adversaire, function (data) {
    console.log("/////////////////" + JSON.stringify(data));
    if (data.message.length < 2) {
      $("#info").append(
        "<span>" +
          "veuillez placer deux bateaux contre " +
          adversaire +
          "</br></span>"
      );
      //!! alert();
      // alert("veuillez placer deux bateaux contre "+adversaire );
      window.location.href = "/bateau";
    }
    for (var i = 0; i < data.message.length; i++) {
      console.log("!!!!!!!!!!!" + data.message);
      $("#info").append(
        "<span>" +
          JSON.stringify(
            "#td" + data.message[i].bateauX + data.message[i].bateauY
          ) +
          "</br></span>"
      );
      // alert(JSON.stringify("#td"+data.message[i].bateauX+data.message[i].bateauY));

      $("#ou").append(
        "bateau en X: " +
          data.message[i].bateauX +
          "Y :" +
          data.message[i].bateauY +
          "<br>"
      );
      $("#td" + data.message[i].bateauX + data.message[i].bateauY).css(
        "color",
        "red"
      );
    }
  });
  /*
    $.getJSON('/mesbateau/!!robot!!/'+adversaire, function (data) {
      console.log("/////////////////"+JSON.stringify(data));
       alert("Adversaire "+adversaire+data.message.length);
      if(data.message.length<2){
        alert("veuillez placer deux bateaux contre "+adversaire );
        fetchPartie()
        if(data.message.length<3 && data.message.length>0){
    fetchPartie()
        }
       
      }
      





    });
*/
}

function tempsReelQui() {
  var quiestu2 = $("#qui").html().split("Vous êtes ")[1].replace('"', "");
  var socket = io();
  if ($("#quiadversaire option:selected").text() !== "")
    $("#contreadv").empty().append($("#quiadversaire option:selected").text());
  let adversaire = $("#contreadv").html();
  //alert(adversaire);
  socket.emit("actuTir", quiestu2 + "/:/" + adversaire);
}
var socket = io();
socket.on("tir", function (msg) {
  // alert('test :'+msg);
  var quiestu2 = $("#qui").html().split("Vous êtes ")[1].replace('"', "");
  var quirecois = msg.split("/:/")[0];
  // alert(quirecois);
  if (quirecois == quiestu2) {
    //   alert('test2 :'+quirecois);
    restoreColor();
    actutirsparemail2(msg.split("/:/")[1]);
    actutirsparemail(msg.split("/:/")[1]);
  }
});
function actutirsparemail2(msg) {
  var quiestu2 = $("#qui").html().split("Vous êtes ")[1].replace('"', "");
  var adversaire = msg;
  var reqemail = "/tirs/" + quiestu2 + "/" + adversaire;
  console.log("---//////" + reqemail);
  $.getJSON(reqemail, function (data) {
    for (var i = 0; i < data.length; i++) {
      console.log("" + data[i].placeX + data[i].placeY);

      $("#td" + data[i].placeX + data[i].placeY).css("opacity", "0.2");
    }
  });
}
function restoreColor() {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      $("#td" + i + j).css("opacity", "1");
      $("#td" + i + j).css("background-color", "darkblue");
    }
  }
}

function actutirsparemail(msg) {
  var quiestu2 = $("#qui").html().split("Vous êtes ")[1].replace('"', "");
  var reqemail = "/tirs/" + msg + "/" + quiestu2;
  console.log("---" + reqemail);
  $.getJSON(reqemail, function (data) {
    for (var i = 0; i < data.length; i++) {
      console.log("" + data[i].placeX + data[i].placeY);

      $("#td" + data[i].placeX + data[i].placeY).css(
        "background-color",
        "yellow"
      );
    }
  });
}

function actubateau() {
  $.getJSON("/bateau", function (data) {
    for (var i = 0; i < data.length; i++) {
      console.log("" + data[i].placeX + data[i].placeY);
    }
  });
}
/*   setInterval(function(){ savoirsitirer();
          actumesbateau();
        actutirs() }, 2000);*/
//setInterval(function(){ $("#joueuractu").submit()}, 2000);
function aquidejouerIndependant() {
  
  
  let joueur2 = $("#quiadversaire option:selected").text();
  fetch("/aquidejouerj1/" + joueur2).then(function (response) {
    // The API call was successful!
    if (response.ok) {
      let data = response.json().then((data) => {
        console.log("RRRRRRRRRRRR" + JSON.stringify(data));
        
        if (data.message.length !== 0) {
          
          
            if (data.message[0].tourj1 === 1) {
              
              alert("C'est votre tour");
              $("#textAff").show()
            } else if (data.message[0].tourj1 === 0) {
              alert("C'est le tour de :" + joueur2);
              $("#textAff").hide()
            }
          
        } else if (data.message.length === 0) {
      
          fetch("/aquidejouerj2/" + joueur2).then(function (response) {
            // The API call was successful!
            if (response.ok) {
              let data = response.json().then((data) => {
                if (!data.message[0].tourj1) {
                  if (data.message[0].tourj1 === 0) {
                    alert("C'est votre tour");
                    $("#textAff").show()
                  } else if (data.message[0].tourj1 === 1) {
                    alert("C'est le tour de :" + joueur2);
                    $("#textAff").hide()
                  }
                }
              });
            }
          
          });
        }
      });
      
    }
  });
}

$(document).ready(function () {
  $("#changeone").hide();
  // if(fetchPartie.length==0){
  // postpartie();
  // }

  $("#textAff").hide();
  $("#ChatMessage").hide();
  $("#touche").hide();
  $("#adv").hide();

  //  $("#play").hide();

  // $('#touche').hide();
  // $("#transit").hide();

  // $("#cont2").hide();
  $("#feu").hide();
  quiestu();
});

/////////////////////////////////////////////////////////////////
$("#selectX,#selectY").hide();

var socket = io();
function send() {
  var quiestu2 = $("#qui").html().split("Vous êtes ")[1].replace('"', "");
  var text = "" + quiestu2 + ": " + $("#envoi").val();
  socket.emit("chat message", text);
  $("#envoi").val("");
}
