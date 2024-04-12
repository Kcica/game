import * as canvasFunc from "/canvas.js"
import { fontSize } from "./baseVariables.js"
import { delegate, getTileParam } from "./functions.js"
import { createCanvas, getCenter } from "./canvas.js"

class playerSelection {
    constructor() {
        const mainCanvas = createCanvas()
        this.mainContext = mainCanvas.getContext("2d")

        this.htmlElemnts = []

        const center = canvasFunc.getCenter()
        this.mainContext.font = fontSize(0.03)

        this.length = (this.mainContext.measureText(1))
        const height = (this.length.actualBoundingBoxAscent + this.length.actualBoundingBoxDescent)
        this.width = this.length.width

        this.tileParam = getTileParam(
            15,
            100,
            this.length.width * 6,
            height * 2,
            center.x - 100 / 2 - this.length.width * 6,
            center.y - 15 / 2 - height * 2
        )

        let index = 1

        if (window.innerWidth / 2 > window.innerHeight / 4){
            const lengthHeading = this.mainContext.measureText("Select number of players")
            this.mainContext.fillStyle = "#2e3440"
            this.mainContext.fillText("Select number of players",
                center.x - lengthHeading.width / 2,
                center.y - this.tileParam.bottomPadding * 3 - this.tileParam.height - this.tileParam.height * 1.5
            )
        } 
        else{
            const lengthHeading = this.mainContext.measureText("Select number of players")
            this.mainContext.fillStyle = "#f1f3f5"
            this.mainContext.fillText("Select number of players",
                center.x - lengthHeading.width / 2,
                center.y - this.tileParam.bottomPadding * 3 - this.tileParam.height
            )
        }

        this.container = document.querySelector("#playerOptions")        

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                this.renderTiles(row, col, index, "#81563e", "#ffeccbe0")

                const button = canvasFunc.insertElement(
                    this.tileParam.x + (col * (this.tileParam.width + this.tileParam.leftPadding)),
                    this.tileParam.y + (row * (this.tileParam.height + this.tileParam.bottomPadding)),
                    this.tileParam.width, this.tileParam.height, "button", "data-player-count", index)

                this.container.appendChild(button)
                button.id = index
                button.dataset.row = row
                button.dataset.col = col
                button.dataset.type = "playerSelection"
                button.style.opacity = "0"
                button.style.cursor = "pointer"
                this.htmlElemnts.push(button)
                index++
            }
        }
    }

    renderTiles(row, col, text, textFill, rectFill) {
        this.clearElement(
            this.tileParam.x + (col * (this.tileParam.width + this.tileParam.leftPadding)),
            this.tileParam.y + (row * (this.tileParam.height + this.tileParam.bottomPadding)),
            this.tileParam.width, this.tileParam.height)
        this.mainContext.lineWidth = 0.2
        this.mainContext.beginPath()
        this.mainContext.lineWidth = "3"
        this.mainContext.strokeStyle = "#00000090"
        canvasFunc.outline(this.mainContext, rectFill, 1, row, col, this.tileParam)

        this.mainContext.lineWidth = ".8"
        this.mainContext.fillStyle = textFill
        this.mainContext.strokeStyle = "#000000"
        this.mainContext.fillText(`${text}`,
            (this.tileParam.x + (col * (this.tileParam.width + this.tileParam.leftPadding))) + this.tileParam.width / 2 - this.length.width / 2,
            (this.tileParam.y + (row * (this.tileParam.height + this.tileParam.bottomPadding))) + this.tileParam.height / 2 + this.tileParam.height / 4)
        this.mainContext.closePath()
    }

    clearElement(x, y, width, height) {
        this.mainContext.clearRect(x - 2, y - 2, width + 4, height + 4)
    }
}

class playCustom {
    constructor(height) {
        this.mainCanvas = createCanvas()
        this.mainContext = this.mainCanvas.getContext("2d")
        this.mainContext.font = fontSize(0.016)
        this.center = getCenter()
        this.htmlElemnts = []
        this.container = document.querySelector("#playerOptions")

        this.posY = height
        const labels = ["Begin", "Settings"]

        let index = 0
        for(let label of labels){
            this.length = this.mainContext.measureText(label)
            this.height = (this.length.actualBoundingBoxAscent + this.length.actualBoundingBoxDescent)
            
            this.tileParam = getTileParam(
                10,
                0,
                this.length.width * 2,
                this.height * 2,
                this.center.x - this.length.width,
                this.center.y + height * 2
            )

            this.renderTiles(index, 0, label, "#81563e", "#ffeccbe0")

            const button = canvasFunc.insertElement(
                this.tileParam.x + (0 * (this.tileParam.width)),
                this.tileParam.y + (index * (this.tileParam.height + this.tileParam.bottomPadding)),
                this.tileParam.width, this.tileParam.height, "button", "data-option", label)

            this.container.appendChild(button)
            button.id = label
            button.dataset.row = index
            button.dataset.col = 0
            button.style.opacity = "0"
            button.style.cursor = "pointer"
            this.htmlElemnts.push(button)
            index++
        }

    }

    renderTiles(row, col, text, textFill, rectFill) {
        this.clearElement(
            this.tileParam.x + (col * (this.tileParam.width)),
            this.tileParam.y + (row * (this.tileParam.height + this.tileParam.bottomPadding)),
            this.tileParam.width, this.tileParam.height)
        this.mainContext.lineWidth = 0.2
        this.mainContext.beginPath()
        this.mainContext.lineWidth = "3"
        this.mainContext.strokeStyle = "#00000090"
        canvasFunc.outline(this.mainContext, rectFill, 1, row, col, this.tileParam)

        this.mainContext.lineWidth = ".8"
        this.mainContext.fillStyle = textFill
        this.mainContext.strokeStyle = "#000000"
        this.mainContext.fillText(`${text}`,
            (this.tileParam.x + (col * (this.tileParam.width + this.tileParam.leftPadding))) + this.tileParam.width / 2 - this.length.width / 2,
            (this.tileParam.y + (row * (this.tileParam.height + this.tileParam.bottomPadding))) + this.tileParam.height / 2 + this.tileParam.height / 8)
        this.mainContext.closePath()
    }
    
    redrawTiles(row, col, label, textFill, rectFill){
        const length = this.mainContext.measureText(label)
        const height = (this.length.actualBoundingBoxAscent + this.length.actualBoundingBoxDescent)
        
        const tileParam = getTileParam(
            10,
            0,
            length.width * 2,
            height * 2,
            this.center.x - length.width,
            this.center.y + this.posY * 2
        )

        this.clearElement(
            tileParam.x + (col * (tileParam.width)),
            tileParam.y + (row * (tileParam.height + tileParam.bottomPadding)),
            tileParam.width, tileParam.height)
        this.mainContext.lineWidth = 0.2
        this.mainContext.beginPath()
        this.mainContext.lineWidth = "3"
        this.mainContext.strokeStyle = "#00000090"
        canvasFunc.outline(this.mainContext, rectFill, 1, row, col, tileParam)

        this.mainContext.lineWidth = ".8"
        this.mainContext.fillStyle = textFill
        this.mainContext.strokeStyle = "#000000"
        this.mainContext.fillText(`${label}`,
            (tileParam.x + (col * (tileParam.width + tileParam.leftPadding))) + tileParam.width / 2 - length.width / 2,
            (tileParam.y + (row * (tileParam.height + tileParam.bottomPadding))) + tileParam.height / 2 + tileParam.height / 8)
        this.mainContext.closePath()
        
    }

    clearElement(x, y, width, height, textFill, rectFill) {
        this.mainContext.clearRect(x - 2, y - 2, width + 4, height + 4)
    }

}

export function loadSelectPage(context, elements) {
    canvasFunc.clearCanvas(context)
    document.body.removeChild(document.querySelector("canvas"))
    for (let element of elements) {
        document.body.removeChild(element)
    }

    const container = document.createElement("div")
    document.body.appendChild(container)
    container.id = "playerOptions"

    const s = new playerSelection()
    let a = undefined
    let playCustomCreated = false
    

    delegate(s.container, "click", "[data-player-count]", playerCount)
    delegate(s.container, "mouseover", "#playerOptions", onHoverplayerCount)
    
    function playerCount(target, event) {
        let index = 1
        const nrOfPlayers = target.srcElement.dataset.playerCount
        
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                const button = document.querySelector(`[data-player-count = '${index}']`)
                
                if (index == target.srcElement.dataset.playerCount) {
                    s.renderTiles(row, col, index, "#ffeccb", "#81563ee0")
                    button.dataset.selected = "true"
                }
                else {
                    s.renderTiles(row, col, index, "#81563e", "#ffeccbe0")
                    button.dataset.selected = "false"
                }
                index++
            }
        }
        if(playCustomCreated == false){
            a = new playCustom(s.tileParam.height)
        }
        playCustomCreated = true
    }
    
    function onHoverplayerCount(target, event) {
        if(target.srcElement.dataset.selected != "true" && target.srcElement.dataset.type == "playerSelection"){
            s.renderTiles(target.srcElement.dataset.row,
                target.srcElement.dataset.col,
                target.srcElement.id,
                "#ffeccb", "#81563ee0")
        }
        else if(target.srcElement.dataset.type != "playerSelection"){

            a.redrawTiles(target.srcElement.dataset.row,
                target.srcElement.dataset.col,
                target.srcElement.id,
                "#ffeccb", "#81563ee0")
        }

        
        target.srcElement.addEventListener("pointerleave", leaveplayerCount)
    }


    function leaveplayerCount(target, event) {
        if(target.srcElement.dataset.selected != "true" && target.srcElement.dataset.type == "playerSelection"){
            s.renderTiles(target.srcElement.dataset.row,
                target.srcElement.dataset.col,
                target.srcElement.id,
                "#81563e", "#ffeccbe0")
        }
        else if(target.srcElement.dataset.type != "playerSelection"){
            a.redrawTiles(target.srcElement.dataset.row,
                target.srcElement.dataset.col,
                target.srcElement.id,
                "#81563e", "#ffeccbe0")
        }
    }
}

function loadNextPage(context, elements) {
    canvasFunc.clearCanvas(context)
    document.body.removeChild(document.querySelector("canvas"))
    for (let element of elements) {
        document.body.removeChild(element)
    }

}

