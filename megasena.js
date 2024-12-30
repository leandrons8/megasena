data = JSON.parse(window.localStorage.getItem("games"))
drawn = JSON.parse(window.localStorage.getItem("drawn"))

if (typeof data != "object" || data == null){
    data = {}
    window.localStorage.setItem("games", JSON.stringify(data))
}

function updateScore(){
    const games = document.getElementById("games").children
    for (let i=2, maxi=games.length; i<maxi; i++){
        const game = games[i].children
        let score = 0
        for (let j=2, maxj=game.length-2; j<maxj; j++){
            if (drawn.includes(game[j].children[0].innerText.trim())){
                game[j].children[0].classList = "btn btn-success"
                score++
            } else {
                game[j].children[0].classList = "btn btn-danger"
            }
        }
        game[0].children[0].classList = ((score>1) ? "bi bi-trophy" : "")
        game[1].children[0].innerText = score
    }
}

function updateDrawn(){
    drawn = []
    const drawnpage = document.getElementById("drawn").children
    for (let i = 1, max=drawnpage.length; i < max; i++){
        drawn.push(drawnpage[i].value)
    }
    window.localStorage.setItem("drawn", JSON.stringify(drawn))
    updateScore()
}

if (typeof drawn != "object" || drawn == null){
    updateDrawn()
} else {
    const drawnpage = document.getElementById("drawn").children
    for (let i = 1, max=drawnpage.length; i < max; i++){
        drawnpage[i].value = drawn[i-1]
    }
}

function createNumber(name, number){
    const
        col = document.createElement("div"),
        button = document.createElement("button"),
        icon = document.createElement("i")
    
    col.className = "col-auto"
    button.classList = "btn btn-" + (drawn.includes(number) ? "success" : "danger")
    icon.classList = "bi bi-x-lg"

    button.onclick = function (){
        data[name] = data[name].filter(item => item != number)
        window.localStorage.setItem("games", JSON.stringify(data))

        const toremove = this.parentNode
        toremove.parentNode.removeChild(toremove)

        updateScore()
    }
    
    col.append(button)
    button.append(number + " ", icon)

    return col
}

function createGame(name, numbers){
    const
        games = document.getElementById("games"),
        row = document.createElement("div"),
        colname = document.createElement("div"),
        winicon = document.createElement("i"),
        colscore = document.createElement("div"),
        score = document.createElement("span"),
        coladd = document.createElement("div"),
        inputgroup = document.createElement("div"),
        input = document.createElement("input"),
        add = document.createElement("button"),
        icon = document.createElement("i"),
        colremove = document.createElement("div"),
        remove = document.createElement("button")

    row.classList = "row py-3 align-items-center"
    colname.className = "col-auto"
    winicon.className = ""
    colscore.className = "col-auto"
    score.classList = "badge text-bg-secondary"
    coladd.className = "col-auto"
    inputgroup.className = "input-group"
    add.classList = "btn btn-primary"
    icon.classList = "bi bi-plus-lg"
    colremove.className = "col-auto"
    remove.className = "btn-close"
    
    add.onclick = function (){
        const number = this.parentNode.children[0].value
        if (number && !data[name].includes(number)){
            const
                row = this.parentNode.parentNode.parentNode,
                col = createNumber(name, number)
            
            data[name].push(number)
            window.localStorage.setItem("games", JSON.stringify(data))
            row.insertBefore(col, this.parentNode.parentNode)

            updateScore()
        } else {
            window.alert("Insira um número válido para o jogo")
        }
        this.parentNode.children[0].value = null
    }
    remove.onclick = function (){
        const toremove = this.parentNode.parentNode

        delete data[name]
        window.localStorage.setItem("games", JSON.stringify(data))
        toremove.parentNode.removeChild(toremove)
    }

    input.min = "1"
    input.max = "60"
    input.type = "number"
    input.placeholder = "Núm."
    
    games.append(row)
    row.append(colname, colscore)
    colname.append(name + " ", winicon)
    colscore.append("Pontuação: ", score)
    for (const number of numbers){
        row.append(createNumber(name, number))
    }
    row.append(coladd, colremove)
    coladd.append(inputgroup)
    inputgroup.append(input, add)
    add.append(icon)
    colremove.append(remove)

    updateScore()
}

function addGame(){
    const name = document.getElementById("gameName").value.trim()
    if (name && !Object.keys(data).includes(name)){
        const numbers = []
        data[name] = numbers
        window.localStorage.setItem("games", JSON.stringify(data))
        createGame(name, numbers)
    } else {
        window.alert("Insira um nome válido para o jogo")
    }
    document.getElementById("gameName").value = null
}

for (const name of Object.keys(data)){
    createGame(name, data[name])
}
