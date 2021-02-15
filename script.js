$(document).ready(function () {


    pusher = new Pusher('a74c97a46cc83cbec53a', {
        cluster:'us2',
        authEndpoint: 'https://authstreamdeck.herokuapp.com/pusher/auth'
    });


    channel = pusher.subscribe('private-channel');


    var games = [
        {
            name: 'Cyberpunk 2077',
            bat: 'cyberpunk.bat',
            archive: '',
            type: 'exe',
            img :'https://ibcdn.canaltech.com.br/8V8CJ88HfAZgQvC9G8eKJPkYpXY=/368x25:1392x602/512x288/smart/i404557.png',
            audio: 'https://mp3.fastupload.co/data/1613216048/cyberpunk-kahni.mp3',
            video:'https://audiomeucomputador.s3-sa-east-1.amazonaws.com/cyberpunk.mp4'
        },{
            name: 'Mortal Kombat 11 - Que os Deuses te protejam na exoterra',
            bat: 'start steam://rungameid/976310',
            archive: '',
            type: 'command',
            img :'https://www.wasd.pt/wp-content/uploads/2020/05/MK11U-1.jpg',
            audio: 'https://audiomeucomputador.s3-sa-east-1.amazonaws.com/UsNQdJML-mortal-kombat.mp3',
            video: 'https://audiomeucomputador.s3-sa-east-1.amazonaws.com/Mortal+Kombat+11+-+Wallpaper+Engine+++Live+Wallpaper-1.mp4'
        } ,{
            name: 'Street Fighter 5',
            bat: 'steam://rungameid/310950',
            archive: '',
            type: 'command',
            img :'https://image.api.playstation.com/vulcan/img/cfn/11307MTvkumhOsLQiA_3g0ZbFhLnHOOWVw3qR4Rum7sKAh8I3THtbG0aa-P7dF7-miXzo1ceqN897MfxYZ7Qx-GaEZs8kq4X.png',
            audio: '',
            video:'https://audiomeucomputador.s3-sa-east-1.amazonaws.com/Ryu+Street+Fighter+-+Live+Engine+Wallpaper.mp4'
        },
    ]
    var apps = [
        {
            name: 'Visual Studio Code',
            bat: 'visual.bat',
            archive: '',
            type: 'exe',
            img :'https://image.api.playstation.com/vulcan/img/cfn/11307MTvkumhOsLQiA_3g0ZbFhLnHOOWVw3qR4Rum7sKAh8I3THtbG0aa-P7dF7-miXzo1ceqN897MfxYZ7Qx-GaEZs8kq4X.png',
            audio: ''
        }, {
            name: 'PHP STORM',
            bat: 'phpstorm.bat',
            archive: '',
            type: 'exe',
            img :'https://image.api.playstation.com/vulcan/img/cfn/11307MTvkumhOsLQiA_3g0ZbFhLnHOOWVw3qR4Rum7sKAh8I3THtbG0aa-P7dF7-miXzo1ceqN897MfxYZ7Qx-GaEZs8kq4X.png',
            audio: ''
        },
    ]

    games.forEach(function (game) {
        $('#games_append').append(
            `<div class="col-md-3">
             <div class="thumbnail startGames" data-video="${game.video ? game.video : ''}" data-rom="${game.archive}"  data-bat="${game.bat}" data-title="${game.name}" data-type="${game.type}" data-audio= ${game.audio ? game.audio : ''}>
                <div class="thumb" style="background-image: url(${game.img});">
                    <div class="caption-overflow">
                        <span class="btn text-white btn-flat btn-icon btn-rounded legitRipple playbutton"><i class="icon-play4"></i></span>
                    </div>
                </div>
             </div> 
          </div>`)
    })


  /*  socket = io.connect("http://170.245.126.255:3500/");
    socket.on('update', function (data) {
        console.log(data)
    })

 */

    var alexaClient = Alexa.create({version: '1.1'}).then((args) => {
            const {
                alexa,
                message
            } = args;
            alexaClient = alexa;
            client = alexa
            //aquí inicializamos el cliente
            processAlexaMessage(message) //procesa el mensaje de inicialización
            //asigna la funcion como callback para los mensajes recibidos
            client.skill.onMessage(processAlexaMessage);
        }).catch(error => {});

    activeElem ='infos' ;

    $('#openGames').on('click', function () {
        show($('#games'),'games')
    });

    $('#openApps').on('click', function () {
        show($('#apps'),'apps');
    });

    $('#openInfo').on('click', function () {
        show($('#infos'),'infos')
    });


    $('.startGames').on('click', function () {
        var title = $(this).data('title');
        var rom = $(this).data('rom')
        var bat = $(this).data('bat')
        var type = $(this).data('type')
        var audio = $(this).data('audio')
        var video = $(this).data('video')

        if(video!=''){
            $("#myVideo").attr('src',video)
        }
        try {
            if(audio != ''){
                text = `<speak>  Abrindo ${title}  <audio src="${audio}" /> </speak> `
            }else{
                text = `Abrindo ${title}`
            }
            alexaClient.skill.sendMessage({
                intent: "OpenIntent",
                text: text,
                command: `open:SuperNintendo.bat{${rom}}`
            }, function (event) {
            });
        } catch (e) {
            swal.fire(e.message, '', 'error')
        }
        let infos = {
            error: false,
            bat: bat,
            rom: rom,
            type: type
        };

        channel.trigger(`client-Server`, {
            option: 'abrir',
            infos: infos
        });

       // socket.emit("abrir", infos);
    })

    $('.startApps').on('click', function () {
        title = $(this).data('title');
        app = $(this).data('app')
        try {
            alexaClient.skill.sendMessage({
                intent: "OpenIntent",
                text: `Abrindo ${title}`,
                command: `open:{${app}.bat}`
            }, function (event) {
            });
        } catch (e) {
            swal.fire(e.message, '', 'error')
        }
    })


    $('#ChangePage').on('click', function () {
        textToAlexa = $('#text_to_alexa').val();
        try {
            alexaClient.skill.sendMessage({
                intent: "AnswerIntent",
                text: textToAlexa,
            }, function (event) {
                document.getElementById('debugElement').innerHTML = 'DEU CERTO!';
            });
        } catch (e) {
            document.getElementById('debugElement').innerHTML = e;

        }

    })


    function processAlexaMessage(message) {
        if (message.mode == "cyberpunk") {
            $("#myVideo").attr('src','https://audiomeucomputador.s3-sa-east-1.amazonaws.com/cyberpunk.mp4')
        }

        if(message.mode =='shutdown'){
            socket.emit("shutdown", '');
        }
        if(message.mode =='reset'){
            socket.emit("reset", '');
        }

    }


    function show(elem,label) {

        if(label != activeElem) {
            $(`#${activeElem}`).hide();
            activeElem = label;
            elem.slideDown();
        }

    }

   // socket.emit("pc_status", '');
    getPcStatus(2000,'socket')

});

$(async function () {
     // showLoading(true);
    setTimeout(function () {
        showLoading(false);
    },3000)
})
function showLoading(status) {
    if (status) {
        $('.body').block({
            message: '<h2 style="position: absolute;left: 138px;">Carregando...</h2><h1><span>STREAM DECK</span></h1><i class="icon-spinner2 spinner"></i>',
            overlayCSS: {
                backgroundColor: '#368fb4',
                opacity: 1,
                cursor: 'wait'
            },
            css: {
                border: 0,
                padding: 0,
                backgroundColor: 'none'
            }
        });
    } else {
        $('.body').unblock();
    }
}

function getPcStatus(time,socket) {
     setTimeout(async function () {
       //  socket.emit("pc_status", '');
         channel.trigger(`client-pcinfos`, {});
         getPcStatus(time,socket);
    }, time);
}