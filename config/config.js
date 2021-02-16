$(function () {
//Configuração dos aplicativos e jogos
     games = [
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
        },{
            name: 'Street Fighter 5',
            bat: 'steam://rungameid/310950',
            archive: '',
            type: 'command',
            img :'https://m.media-amazon.com/images/I/51TMgBQgCpL.jpg',
            audio: '',
            video:'https://audiomeucomputador.s3-sa-east-1.amazonaws.com/Ryu+Street+Fighter+-+Live+Engine+Wallpaper.mp4'
        },
    ]
     apps = [
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
})
