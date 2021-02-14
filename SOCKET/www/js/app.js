var app = new Framework7({
  root: '#app',
  theme: 'auto',
  routes: routes,
  navbar: {
    "mdCenterTitle": true,
  },
  view: {
    // ex domCache
    stackPages: true,
  },
  dialog: {
    buttonOk: 'OK',
    buttonCancel: 'Cancelar',
    title: 'Aviso'
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }
    },
  }
});

var $$ = Dom7;

var socket = io.connect("https://7f306eba973a.ngrok.io");

//Aguarde o recebimento de atualizações
socket.on('update', function (data) {
  console.log(data)
})

var ls = app.loginScreen.create({
  el: '.login-screen'
});

//OnDeviceReady Event Cordova
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

}


//Abre o LoginScreen
//ls.open();

function login() {
  var usuario = $('#usuario').val();
  var senha = $('#senha').val();

  if (usuario == '' | senha == '') {
    app.dialog.alert('Preencha os dados em branco', 'Erro');
  } else {
    ls.close();
  }

}

var alexaClient = Alexa.create({ version: '1.1' })
  .then((args) => {
    const {
      alexa,
      message
    } = args;
    alexaClient = alexa;
    $(".title").html('Alexa is ready :)');
  })
  .catch(error => {
    $(".title").html('Alexa not ready :(');
  });

$('.startGames').on('click', function () {
  path = $(this).data('path')
  title = $(this).data('title');
  img = $(this).data('img');
  type = $(this).data('type');

  let infos = {
    error: false,
    path,
    title,
    img,
    type
  };

  try {
    alexaClient.skill.sendMessage({
      intent: "OpenIntent",
      text: `Abrindo ${title}`
    }, function (event) {
      //$('#body').css('background-image', img)
    });
  } catch (e) {
    console.log(e.message)
  }

  socket.emit("abrir", infos);

});
