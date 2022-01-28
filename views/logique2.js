function poserbateauRobot() {
  fetchPartie();
}
function cleaninfo() {
  $("#info").empty();
}

var cursorinner = document.querySelector(".cursor2");
var a = document.querySelectorAll("a");

document.addEventListener("mousemove", function (e) {
  var x = e.clientX;
  var y = e.clientY;
});

document.addEventListener("mousemove", function (e) {
  var x = e.clientX;
  var y = e.clientY;
  cursorinner.style.left = x + "px";
  cursorinner.style.top = y + "px";
});

document.addEventListener("mousedown", function () {
  cursorinner.classList.add("cursorinnerhover");
});

document.addEventListener("mouseup", function () {
  cursorinner.classList.remove("cursorinnerhover");
});

var socket = io();
socket.on("untir", function (msg) {
  $("#joueuractu").submit();
  savoirsitirer();
  actumesbateau();
  tempsReelQui();
  actutirs();

  var X = $("#selectX option:selected").text();
  var Y = $("#selectY option:selected").text();
  $("#receiveMsg").append(
    msg.split("/:/")[0] +
      " a tiré sur " +
      msg.split("/:/")[1] +
      " en X: " +
      msg.split("/:/")[2] +
      " et Y :" +
      msg.split("/:/")[3] +
      "</br>"
  );
 $("#textAff").hide();
  //alert(msg);
});

function valueCase(e) {
  //;
  

    let idValue = e.id;

    $("#selectX").val(idValue.split("td")[1].substr(0, 1));
    $("#selectY").val(idValue.split("td")[1].substr(1, 2));
    if ($("#textAff").is(":visible")) {
      var socket = io();
      var adversaire = $("#contreadv").html();
      var quiestu2 = $("#qui").html().split("Vous êtes ")[1].replace('"', "");
      var X = $("#selectX option:selected").text();
      var Y = $("#selectY option:selected").text();
      var msg = quiestu2 + "/:/" + adversaire + "/:/" + X + "/:/" + Y;
      socket.emit("untir", msg);
      $("#textAff").hide();
      $("#feu").submit();
      $("#play").click();
    }
  }


function quiestu2() {
  $.getJSON("/qui", function (data) {
    if (data === undefined) {
      $("#info").append("<span>" + "Veuillez vous connecter." + "</br></span>");
      //!! alert();
      window.location.href = "/loginpage";
    }

    if (
      JSON.stringify(data.message) ===
      '"Qui êtes vous?, Veuillez-vous connecter. "'
    ) {
      //!! alert("Veuillez vous connecter.");
      $("#info").append("<span>" + "Veuillez vous connecter." + "</br></span>");

      window.location.href = "/loginpage";
    }
  });
}
function savoirsitirer() {
  $("#feu").hide();
  //$("#textAff").hide();
  console.log($("#contreadv").html());
  if ($("#quiadversaire option:selected").val() == "XXXT11") {
    // $("#feu").show();
    //$("#textAff").show();
    $("#joueuractu").submit;
  } else if ($("#quiadversaire option:selected").val() == "XXXT20") {
    // $("#feu").show();
    //$("#textAff").show();
    $("#joueuractu").submit;
  } else {
    $("#feu").hide();
    $("#joueuractu").submit;
  }
}
function tirdessus() {
  document.getElementById("tirdessus").action = "/insert/tir";
}

var bol = false;
$("#cacheChat").click(function () {
  if (!bol) {
    $("#ChatMessage").show();
    bol = true;
  } else {
    $("#ChatMessage").hide();
    bol = false;
  }
});
