/* ;(function() { */
    /* 'use strict' */
    
var words = ['html', 'css', 'program', 'youxi', 'windows', 'computer', 'china', 'chongqing', 'tianjin', 'noodles', 'dragon', 'square', 'Intelligence', 'chaoshi', 'pinyin', 'tian', 'laoshi', 'shushu', 'ayi', 'people', 'virus', 'block', 'time', 'hanzi', 'hair', 'control', 'tattoo', 'cellphone', 'traditional', 'bingan', 'spicy', 'mooncake', 'yue', 'libai', 'moto', 'shu', 'loto'];

//agregar palabras a la lista
function focus() {
    var input = document.getElementById("input-text");
    input.focus();
}

function value() {
    var input = document.getElementById("input-text");
    input.value = "";
}

function add_word() {
    var input = document.getElementById('input-text').value;
    
    if (/[^a-zñ]/.test(input)) {
        Swal.fire({
            icon: 'error',
            iconColor: '#4A5E60',
            background: '#E3E0DE',
            title: '哎呀...',
            showConfirmButton: false,
            text: '只允许小写字母，不允许重音',
          })
        focus();
    }

    else if (input.length === 0) {
        Swal.fire({
            icon: 'error',
            iconColor: '#4A5E60',
            background: '#E3E0DE',
            title: '哎呀...',
            confirmButtonColor: '#4A5E60',
            text: '文本字段为空，请写一个字',
          })
        focus();
    }

    else {
        words.push(input)
        Swal.fire({
            icon: '成功',
            iconColor: '#4A5E60',
            background: '#E3E0DE',
            title: '不错！',
            confirmButtonColor: '#4A5E60',
            text: '单词添加成功',
        })

        value()
    }
}

//almacenar la configuración actual
var youxi = null
//por si ya se envió alguna alerta
var finalized = false

var $html = {
    character: document.getElementById('sunwukong-game'),
    guessed: document.querySelector('.container-correct'),
    mistaken: document.querySelector('.container-incorrect')
}

function draw(youxi) {
    //actualizar la imagen del personaje
    var $element
    $element = $html.character
    var estado = youxi.estado

    if (estado === 8) {
        estado = youxi.previo
    }

    $element.src = './image/sunwukong/0' + estado + '.png'

    //creamos las letras adivinadas
    var word = youxi.word
    var guessed = youxi.guessed
    $element = $html.guessed

    //borramos los elementos anteriores
    $element.innerHTML = ''

    for (let letter of word) {
        let $span = document.createElement('span')
        let $text = document.createTextNode('')

        if (guessed.indexOf(letter) >= 0) {
            $text.nodeValue = letter
        }

        $span.setAttribute('class', 'span-guessed')
        $span.appendChild($text)
        $element.appendChild($span)
    }

    //creamos las letras erradas
    var mistaken = youxi.mistaken
    $element = $html.mistaken

    //borramos los elementos anteriores
    $element.innerHTML = ''

    for (let letter of mistaken) {
        let $span = document.createElement('span')
        let $text = document.createTextNode(letter)

        $span.setAttribute('class', 'span-mistaken')
        $span.appendChild($text)
        $element.appendChild($span)
    }
}

function guess(youxi, letter) {
    var estado = youxi.estado

    //si se ha lost o won, no hay que hacer nada
    if (estado === 1 || estado === 8) {
        return
    }

    var guessed = youxi.guessed
    var mistaken = youxi.mistaken

    //si ya hemos mistaken o guessed la letra, no hay que hacer nada
    if (guessed.indexOf(letter) >= 0 || mistaken.indexOf(letter) >= 0) {
        return
    }

    var word = youxi.word

    //es letra de la palabra
    if (word.indexOf(letter) >= 0) {
        let won = true

        //ver si llegamos al estado won
        for (let l of word) {
            if (guessed.indexOf(l) < 0 && l != letter) {
                won = false
                youxi.previo = youxi.estado
                break
            }
        }

        //si ya se ha won, indicarlo
        if (won) {
            youxi.estado = 8
        }

        //agregamos a la lista de letras adivinadas
        guessed.push(letter)
    }

    //si no es letra de la palabra, se acerca el personaje a la horca
    else {
        youxi.estado--

        //agregamos a la lista de letras erradas
        mistaken.push(letter)
    }
}

window.onkeydown = function guessLetter(e) {
    var letter = e.key

    if (/[^a-zñ]/.test(letter)) {
        return
    }

    guess(youxi, letter)
    var estado = youxi.estado

    if (estado === 8 && !finalized) {
        setTimeout(alerta_won, 500)
        finalized = true
    }

    else if (estado === 1 && !finalized) {
        let word = youxi.word
        let fn = alerta_lost.bind(undefined, word)
        setTimeout(fn, 500)
        finalized = true
    }

    draw(youxi)
}

window.newGame = function newGame() {
    var word = random_word()
    youxi = {}
    youxi.word = word
    youxi.estado = 7
    youxi.guessed = []
    youxi.mistaken = []
    finalized = false
    draw(youxi)
    console.log(youxi)
}

function random_word() {
    var index = ~~(Math.random() * words.length)
    return words[index]
}

function alerta_won() {
    Swal.fire({
        title: '恭喜，你赢了！',
        width: 380,
        padding: '2rem',
        color: '#D9D9D9',
        background: '#4A5E60',
        imageUrl: './image/ganaste.png',
        imageHeight: 250,
        confirmButtonColor: '#192323',
        allowEnterKey: true,
        backdrop: `
            rgba(115,115,115,0.6)`
    })
}

function alerta_lost(letter) {
    Swal.fire({
        title: '你输了！',
        text: 'The word was: ' + letter,
        width: 300,
        padding: '2rem',
        color: '#D9D9D9',
        background: '#4A5E60',
        imageUrl: './image/perdiste.png',
        imageHeight: 250,
        confirmButtonColor: '#192323',
        allowEnterKey: true,
        backdrop: `
            rgba(115,115,115,0.6)`
    })
}

newGame()

/* }()) */