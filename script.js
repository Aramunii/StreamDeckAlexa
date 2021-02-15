$(document).ready(function () {


    pusher = new Pusher('a74c97a46cc83cbec53a', {
        cluster:'us2',
        authEndpoint: 'https://authstreamdeck.herokuapp.com/pusher/auth'
    });

    channel = pusher.subscribe('private-channel');


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
        if(message.mode=='showInfo'){
            show($('#infos'),'infos')
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