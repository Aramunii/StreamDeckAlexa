$(document).ready(function () {


    pusher = new Pusher('a74c97a46cc83cbec53a', {
        cluster:'us2',
        authEndpoint: 'https://authstreamdeck.herokuapp.com/pusher/auth'
    });

    channel = pusher.subscribe('private-channel');

    alexaClient = Alexa.create({version: '1.1'}).then((args) => {
            const {
                alexa,
                message
            } = args;
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

    bar = new ProgressBar.Path('#heart-path', {
        easing: 'easeInOut',
        duration: 1000
    });


    channel.bind('client-wow',function (data) {
            setWowData(data)
        })

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

function setWowData(data) {

    locationMap_old = null;

    try{
        var maxHealth = data[1].replace(/\D/g,'');
        var health = data[0].replace(/\D/g,'')
        var locationMap = data[2];
       


        $('#teste2').text(locationMap)
        var barhealth = health / maxHealth ;
        bar.animate(barhealth);  // Number from 0.0 to 1.0



    }catch (e) {
        swal.fire(e.message, '', 'error')

    }


}