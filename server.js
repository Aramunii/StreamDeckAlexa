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


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});


io.on("connection", async function (client) {
console.log("AAA")
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





http.listen(3500, '', function () {
    console.log('listening on port 3500');
});

