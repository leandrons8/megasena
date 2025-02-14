games = JSON.parse(window.localStorage.getItem("games"))
if (typeof games != "object" || games == null){
    games = {}
} else {
    for (const game of Object.values(games)){
        for (let i=0; i<game.length; i++){
            const n = Number(game[i])
            game[i] = ((n) ? n : null)
        }
    }
}
window.localStorage.setItem("games", JSON.stringify(games))

drawn = JSON.parse(window.localStorage.getItem("drawn"))
if (typeof drawn != "object" || drawn == null || drawn.length != 6){
    drawn = [null,null,null,null,null,null]
} else {
    for (let i=0; i<6; i++){
        const n = Number(drawn[i])
        drawn[i] = ((n) ? n : null)
    }
}
window.localStorage.setItem("drawn", JSON.stringify(drawn))

function loadPage(){
    const drawnGroup = document.getElementById("drawn")
    drawnGroup.onchange = function (){
        const tbody = document.getElementById("tbody").children
        for (let i=0; i<tbody.length-1; i++){
            updateScore(tbody[i])
        }
    }
    for (let i = 0; i < 6; i++){
        const drawnElement = drawnGroup.children[i+1]
        drawnElement.value = drawn[i]
        drawnElement.onchange = function (){
            let n = Number(this.value)
            drawn[i] = null
            while (drawn.includes(n) && 1<=n && n<=60){
                n++
            }
            drawn[i] = ((1<=n && n<=60) ? n : null)
            this.value = drawn[i]
            window.localStorage.setItem("drawn", JSON.stringify(drawn))
        }
    }

    const tbody = document.getElementById("tbody")
    for (const name of Object.keys(games)){
        const tr = renderTableRow(name)
        updateScore(tr)
        tbody.append(tr)
    }
    const tr = renderTableRow()
    tbody.append(tr)
}

function renderTableRow(name){
    const tr = document.createElement("tr")

    const tdname = document.createElement("td")

    const tdpts = document.createElement("td")

    const iconpts = document.createElement("i")
    iconpts.className = "bi bi-0-circle"

    const tdnum = document.createElement("td")

    const tdremove = document.createElement("td")

    const inputname = document.createElement("input")
    inputname.className = "form-control"
    inputname.placeholder = "Novo jogo"
    inputname.value = ((name) ? name : null)
    inputname.disabled = ((name) ? true : false)
    inputname.onchange = function (){
        if (Object.keys(games).includes(this.value) || !this.value){
            this.value = null
            const modal = new bootstrap.Modal("#modal")
            modal.show()
        } else {
            games[this.value] = []
            window.localStorage.setItem("games", JSON.stringify(games))
            
            const lasttr = this.parentNode.parentNode
            const newtr = renderTableRow(this.value)
            updateScore(newtr)

            lasttr.parentNode.insertBefore(newtr, lasttr)

            this.value = null
        }
    }

    const inputgroup = renderInputGroup(name)

    const remove = document.createElement("button")
    remove.className = "btn-close"
    remove.disabled = ((name) ? false : true)
    remove.onclick = function (){
        const toremove = this.parentNode.parentNode
        toremove.parentNode.removeChild(toremove)
        
        delete games[name]
        window.localStorage.setItem("games", JSON.stringify(games))
    }

    tr.append(tdname, tdpts, tdnum, tdremove)
    tdname.append(inputname)
    tdpts.append(iconpts)
    tdnum.append(inputgroup)
    tdremove.append(remove)

    return tr
}

function renderInputGroup(name){
    const inputgroup = document.createElement("div")
    inputgroup.className = "input-group flex-nowrap"

    for (let i=0; i<20; i++){
        const input = document.createElement("input")
        input.style = "width: 60px"
        input.type = "number"
        input.min = 1
        input.max = 60
        input.value = ((name) ? games[name][i] : null)
        input.placeholder = "#"+(i+1)

        if (!name){
            input.className = "form-control"
            input.disabled = true
        } else if (i<games[name].length){
            input.onchange = function (){
                const inputgroup = this.parentNode
                const td = this.parentNode.parentNode
                
                games[name][i] = null
                let n = Number(this.value)
                while (games[name].includes(n) && 1<=n && n<=60){
                    n++
                }
                if (1<=n && n<=60){
                    games[name][i] = n
                    window.localStorage.setItem("games", JSON.stringify(games))
                    this.value = games[name][i]
                } else {
                    games[name].splice(i, 1)
                    window.localStorage.setItem("games", JSON.stringify(games))
                    td.replaceChild(renderInputGroup(name), inputgroup)
                }
                updateScore(td.parentNode)
            }
        } else if (i==games[name].length) {
            input.onchange = function (){
                const inputgroup = this.parentNode
                const td = this.parentNode.parentNode

                let n = Number(this.value)
                while (games[name].includes(n) && 1<=n && n<=60){
                    n++
                }
                if (1<=n && n<=60){
                    games[name].push(n)
                    window.localStorage.setItem("games", JSON.stringify(games))
                    td.replaceChild(renderInputGroup(name), inputgroup)
                }
                updateScore(td.parentNode)
            }
        } else {
            input.disabled = true
        }

        inputgroup.append(input)

        if (i>4){
            if (!name){
                break
            } else if (!games[name][i]){
                break
            }
        }
    }

    return inputgroup
}

function updateScore(tr){
    const icon = tr.children[1].children[0]
    const inputgroup = tr.children[2].children[0].children
    
    let score = 0
    for (const input of inputgroup){
        if (drawn.includes(Number(input.value))){
            input.className = "form-control text-bg-success"
            score++
        } else if (Number(input.value)){
            input.className = "form-control text-bg-danger"
        } else {
            input.className = "form-control"
        }
    }
    icon.className = ((score==6) ? "bi bi-trophy" : "bi bi-"+score+"-circle")
}

loadPage()
