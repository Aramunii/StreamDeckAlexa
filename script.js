$(document).ready(function () {



    var alexaClient = Alexa.create({version: '1.1'})
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



    $('#ChangePage').on('click',function () {
        try{
            alexaClient.skill.sendMessage({
                intent: "AnswerIntent",
                shape: "cuadrado",
                color: "green"
            }, messageSentCallback);
        }
        catch (e) {
            document.getElementById('debugElement').innerHTML = e;

        }

    })
});

