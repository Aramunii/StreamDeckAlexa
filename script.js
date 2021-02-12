$(document).ready(function () {

   $('#ChangePage').on('click',function () {
       window.location.href = 'www.google.com';
   })

    var alexaClient;
    Alexa.create({version: '1.1'})
        .then((args) => {
            const {
                alexa,
                message
            } = args;
            alexaClient = alexa;
            document.getElementById('debugElement').innerHTML = 'Alexa is ready :)';
        })
        .catch(error => {
            document.getElementById('debugElement').innerHTML = 'Alexa not ready :(';
        });


});

