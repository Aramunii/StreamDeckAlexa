// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const computador = require("./functions/computador");
var store = require('store')
const fs = require('fs');
const { pegaLink } = require('./getFilme');
var token;
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter'); // API ALEXA PARA SALVAR INFORMAÇÔES
const { getJogo } = require("./functions/getJogo");
const { getEmu } = require("./functions/getEmulador");


//==========================================
//INICIO
//===========================================
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async  handle(handlerInput) {
        var speakOutput;

        //PEGA TOKEN
        token = handlerInput.requestEnvelope.context.System.user.accessToken;

        speakOutput = 'Bem vindo ao computador, O que deseja?';

        console.log(token);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//==========================================
// ABRE NETFLIX
//===========================================
const assistirIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'assistir';
    },
    async handle(handlerInput) {
        var speakOutput;
        var Link;

        //pega o titulo informado pelo usuário
        let titulo = Alexa.getSlotValue(handlerInput.requestEnvelope, 'titulo');


        // Função para pegar link da netflix ou amazon prime
        Link = await pegaLink(titulo);

        //Pega token
        token = handlerInput.requestEnvelope.context.System.user.accessToken;

        //Verifica se o retorno do link
        if(Link ==="Não foi possivél encontrar este filme, tente novamente!"){

            speakOutput = "Não foi possível encontrar este filme, tente novamente!";
        }else{

            //verifica se é netflix ou prime video

            if(Link.includes("primevideo")){

                //Define o output para alexa
                speakOutput = `Abrindo ${titulo} na Prime Video.`;

                //Define link para autoplay na Amazon
                Link = Link.replace("/ref=atv_dl_rdr","?autoplay=1")
                console.log(Link);

                //Envia o arquivo para o Google Drive
                await computador.enviaComando(`open:Amazon.bat{${Link}}`,token, (id) => {
                    console.log(id);
                });

                //Se for netflix
            }else{
                //Envia o arquivo para o Google Drive
                await computador.enviaComando(`open:Netflix.bat{${Link}}`,token, (id) => {
                    console.log(id);
                });

                //Define o output da alexa
                speakOutput = `Abrindo ${titulo} na Netflix.`;
            }

        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

//==========================================
// FECHA NETFLIX
//===========================================

const fecharNetflixIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'fecharNetflix';
    },
    async handle(handlerInput) {

        //PEGA TOKEN
        token = handlerInput.requestEnvelope.context.System.user.accessToken;

        //Envia para google drive
        await computador.enviaComando("open:fechar.bat",token,(id) => {
            console.log(id);
        });

        //define output para alexa
        var speakOutput = `Ok, fechando netflix.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};


//==========================================
// DESLIGA PC
//===========================================
const desligarIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'desligarIntent';
    },
    async handle(handlerInput) {

        //Pega Token
        token = handlerInput.requestEnvelope.context.System.user.accessToken;

        //Envia para o google drive
        await computador.enviaComando("open:desligar.bat",token,(id) => {
            console.log(id);
        });

        //Define output para alexa
        var speakOutput = `Ok, desligando computador.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
//==========================================
// ABRIR BAT
//===========================================
const openBatzinho = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'abrir';
    },
    async handle(handlerInput) {

        //Pega Token
        token = handlerInput.requestEnvelope.context.System.user.accessToken;
        let appOpen = Alexa.getSlotValue(handlerInput.requestEnvelope, 'app');

        //Envia para o google drive
        await computador.enviaComando(`open:${appOpen}.bat`,token,(id) => {
            console.log(appOpen);
        });

        //Define output para alexa
        var speakOutput = `Ok, Abrindo ${appOpen}.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
//==========================================
// PULA ABERTURA / RESUMO
//===========================================
const pularAbertura = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'pularAbertura';
    },
    async handle(handlerInput) {

        //Pega Token
        token = handlerInput.requestEnvelope.context.System.user.accessToken;

        //Envia para o google drive
        await computador.enviaComando("open:pularAbertura.vbs",token,(id) => {
            console.log(id);
        });

        //Define output para alexa
        var speakOutput = `Ok, desligando computador.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};


//==========================================
// PAUSA NETFLIX PC
//===========================================
const pausarIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'pausarIntent';
    },
    async handle(handlerInput) {
        //PEGA TOKEN
        token = handlerInput.requestEnvelope.context.System.user.accessToken;
        //ENVIA ARQUIVO PARA O GOOGLE DRIVE.
        await computador.enviaComando("open:pausar-continuar.vbs",token,(id) => {
            console.log(id);
        });

        var speakOutput = `Ok`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};



//==========================================
// VOLUME
//===========================================

const volumeIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'volumeIntent';
    },
    async handle(handlerInput) {

        //PEGA TOKEN
        token = handlerInput.requestEnvelope.context.System.user.accessToken;
        //PEGA VOLUME DO INPUT DA ALEXA
        let volume2 = Alexa.getSlotValue(handlerInput.requestEnvelope, 'volume');
        var speakOutput ;



        await computador.enviaComando(`set_volume:${volume2}`,token,(id) => {
            console.log(id);
        });

        speakOutput = `Ok, volume ajustado para ${volume2} porcento.`;



        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

//==========================================
// Repita
//===========================================

const repita = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'testeRepetir';
    },
    async handle(handlerInput) {

        //PEGA TOKEN
        token = handlerInput.requestEnvelope.context.System.user.accessToken;
        //PEGA VOLUME DO INPUT DA ALEXA
        let volume2 = Alexa.getSlotValue(handlerInput.requestEnvelope, 'frase');
        var speakOutput ;

        speakOutput = `Ok, você disse: ${volume2} `;



        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

//==========================================
// PROXIMO EP
//===========================================

const proximoIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'proximoEp';
    },
    async handle(handlerInput) {

        token = handlerInput.requestEnvelope.context.System.user.accessToken;
        await computador.enviaComando("open:proximoEp.vbs",token,(id) => {
            console.log(id);
        });

        var speakOutput = `Ok`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

//==========================================
//JOGAR
//===========================================

const JogarIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'jogar';
    },
    async handle(handlerInput) {

        //PEGA TOKEN
        token = handlerInput.requestEnvelope.context.System.user.accessToken;
        //PEGA VOLUME DO INPUT DA ALEXA
        let jogo = Alexa.getSlotValue(handlerInput.requestEnvelope, 'jogo');
        var speakOutput ;
        console.log(jogo)

        var data = getJogo(jogo);
        console.log(data);

        if(data.Arquivo==="Nenhum jogo encontrado"){
            speakOutput = `Não consegui encontrar o jogo.`;

        }else{
            var emu = data.Arquivo.split(".")
            emu = emu[1];
            var emulador = await getEmu(emu);
        }


        if(data.Arquivo===undefined){
            speakOutput = `Não consegui encontrar o jogo.`;

        }else{


            await computador.enviaComando(`open:${emulador.Arquivo}{${data.Arquivo}}`,token,(id) => {
                console.log(id);
            });


            if(emulador.Emu=="Playstation 1"){

                speakOutput = `Ok, abrindo ${data.Speak} no ${emulador.Emu}  <break time='500ms'/> <audio src='https://audiomeucomputador.s3-sa-east-1.amazonaws.com/i7AiWdRy-psx.mp3'/>`;

            }else{
                speakOutput = `Ok, abrindo ${data.Speak} no ${emulador.Emu} `;

            }

        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

//==========================================
// MORTAL KOMBAT
//===========================================
const mortalKombatIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'mortalKombat';
    },
    async handle(handlerInput) {

        //Pega Token
        token = handlerInput.requestEnvelope.context.System.user.accessToken;

        //Envia para o google drive
        await computador.enviaComando("open:mortalKombat.bat",token,(id) => {
            console.log(id);
        });

        //Define output para alexa
        var speakOutput = `Que os Deuses te protejam na exoterra
<break time="500ms"/>
<audio src="https://audiomeucomputador.s3-sa-east-1.amazonaws.com/UsNQdJML-mortal-kombat.mp3"/>
`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        token = handlerInput.requestEnvelope.context.System.user.accessToken;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};


// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET})
    )
    .addRequestHandlers(
        LaunchRequestHandler,
        pausarIntent,
        fecharNetflixIntent,
        HelpIntentHandler,
        pularAbertura,
        JogarIntent,
        assistirIntent,
        repita,
        desligarIntent,
        mortalKombatIntent,
        openBatzinho,
        proximoIntent,
        volumeIntent,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
