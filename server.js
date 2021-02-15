const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const path = require('path');
const {exec, execSync} = require('child_process');
const {spawn} = require('child_process');
var osu = require('node-os-utils')
const si = require('systeminformation');
var processWindows = require("node-process-windows");
app.use(express.static(path.join(__dirname, '')));
var ks = require('node-key-sender');
var Pusher = require('pusher-client');
var fetch = require('node-fetch')

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});

io.on("connection", async function (client) {
    client.on('abrir', (data) => {
        if (data.type == 'emulator') {
            execSync('"C:\\Users\\Josuje\\Documents\\AssistantComputerControl\\shortcuts\\' + data.bat + '" ' + data.rom)
        }
        if (data.type == 'command') {
            console.log(data.bat)
            exec(data.bat);
        }
        if (data.type == 'exe') {
            exec('"C:\\Users\\Josuje\\Documents\\AssistantComputerControl\\shortcuts\\' + data.bat + '" ')
        }

    });

    client.on('shortcut', (data) => {
        if (data.type == 'combination') {
            ks.sendCombination(['windows', 'r']);
        }
        if (data.type == 'simple') {
            ks.sendKey('a');
        }
    })

    client.on('pc_status', (data) => {
        osu.mem.info().then(info => {
            client.emit('status_ram', info);
        })
        osu.cpu.usage().then(info => {
            client.emit('status_cpu', info);
        })
    })

    client.on('shutdown',(data)=>{
        exec('shutdown -s -t 0 ');
        console.log('ok')
    })

    client.on('reset',(data)=>{
        exec('shutdown -r -t 0');
    })

});


var pusher = new Pusher('a74c97a46cc83cbec53a', {
    cluster:'us2',
    authEndpoint: 'https://authstreamdeck.herokuapp.com/pusher/auth'
});

var channel = pusher.subscribe('private-channel');

channel.bind('client-Server', function(data) {

    if(data.option =='abrir'){
        if (data.infos.type == 'emulator') {
            execSync('"C:\\Users\\Josuje\\Documents\\AssistantComputerControl\\shortcuts\\' + data.infos.bat + '" ' + data.infos.rom)
        }
        if (data.infos.type == 'command') {
            console.log(data.infos.bat)
            exec(data.infos.bat);
        }
        if (data.infos.type == 'exe') {
            exec('"C:\\Users\\Josuje\\Documents\\AssistantComputerControl\\shortcuts\\' + data.infos.bat + '" ')
        }
    }

    console.log('An event was triggered with message: ' + data.infos.bat);
});


channel.bind('client-pcinfos',function (data) {

    fetch('http://localhost:10445/metrics/json')
        .then(function(response) {
            // The response is a Response instance.
            // You parse the data into a useable format using `.json()`
            return response.json();
        }).then(function(data) {
            responseJson = data;
            pcInfo = {
                memoryRam : responseJson[121].value,
                TotalRam : responseJson[122].value + responseJson[120].value,
                CpuUsage : responseJson[21].value,
                CpuName : responseJson[21].source.split(':')[1],
                GpuTemperature : responseJson[73].value,
                GpuName : responseJson[73].source.split(':')[1],
            }
        channel.trigger('client-pcinfos-load',{
                pcInfo: pcInfo
            })
    });

})




http.listen(3500, '', function () {
    console.log('listening on port 3500');
});

