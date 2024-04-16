import * as canvasFunctions from "./canvas.js"
import * as variables from "./baseVariables.js"
import { delegate, getTileParam } from "./functions.js";

class drawBaseGrid {
    constructor() {
        this.baseCanvas = canvasFunctions.createCanvas()
        this.baseContext = this.baseCanvas.getContext("2d")

        this.center = canvasFunctions.getCenter()

        window.innerWidth > window.innerHeight / 2 ?
            this.baseParam = getTileParam(
                3.5,
                3.5,
                window.innerHeight / 2,
                window.innerHeight / 2,
                window.innerWidth / 2 - window.innerHeight / 4,
                window.innerHeight / 2 - window.innerHeight / 8
            ) :

            this.baseParam = getTileParam(
                3.5,
                3.5,
                window.innerWidth - window.innerWidth * 0.05 * 2,
                window.innerWidth - window.innerWidth * 0.05 * 2,
                window.innerWidth * 0.05 - 8,
                this.center.y - (window.innerWidth - window.innerWidth * 0.05 * 2) / 4
            )

        this.#drawBaseContext()
    }

    #drawBaseContext() {
        this.baseContext.lineWidth = 1.7
        this.baseContext.fillStyle = "#FFEDCC"
        this.baseContext.beginPath()
        this.baseContext.roundRect(this.baseParam.x, this.baseParam.y,
            this.baseParam.width, this.baseParam.height, 2)
        this.baseContext.fill()
        this.baseContext.stroke()
        this.baseContext.closePath()
    }

}

class playArea {
    constructor(unknownTiles, tileGrid, baseParam) {
        this.tileCanvas = canvasFunctions.createCanvas()
        this.tileContext = this.tileCanvas.getContext("2d")

        this.mainCanvas = canvasFunctions.createCanvas()
        this.mainContext = this.mainCanvas.getContext("2d")

        this.iconCanvas = canvasFunctions.createCanvas()
        this.iconContext = this.iconCanvas.getContext("2d")

        this.actionCanvas = canvasFunctions.createCanvas()
        this.actionContext = this.actionCanvas.getContext("2d")


        this.center = canvasFunctions.getCenter()

        this.tileArangement = tileGrid
        this.container = document.querySelector("#game")
        this.unknownTiles = unknownTiles

        this.center = canvasFunctions.getCenter()

        this.tileParam = {
            x: baseParam.x + 4,
            y: baseParam.y + 4,
            width: baseParam.width / 5 - 4,
            height: baseParam.height / 5 - 4,
            leftPadding: baseParam.leftPadding,
            bottomPadding: baseParam.bottomPadding
        }

        this.initialize()
        this.initializeTiles()
    }

    #image(context, src, row, col, tileParam) {
        const img = new Image()
        img.src = src
        img.onload = function () {
            context.beginPath()
            context.drawImage(this,
                tileParam.x + (row * (tileParam.width + tileParam.leftPadding)),
                tileParam.y + (col * (tileParam.height + tileParam.bottomPadding)),
                tileParam.width, tileParam.height)
            context.closePath()
        }

        if (!(row === 2 && col === 2))
            context.beginPath()
        canvasFunctions.outline(context, undefined, 0, row, col, tileParam)
        context.closePath()
    }

    initializeTiles() {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                this.tileContext.beginPath()
                this.tileContext.lineWidth = 0.2
                    this.#image(this.tileContext, variables.assets[this.tileArangement[row][col]],
                        col, row, this.tileParam)
                    document.querySelector(`[data-row="${row}"][data-col="${col}"]`).dataset.tilled = false
                this.tileContext.closePath()
            }
        }
    }

    uncoverTiles(target){
        this.clearElement(
            this.tileParam.x + (target.srcElement.dataset.col * (this.tileParam.width + this.tileParam.leftPadding)),
            this.tileParam.y + (target.srcElement.dataset.row * (this.tileParam.height + this.tileParam.bottomPadding)),
            this.tileParam.width, this.tileParam.height)
    }

    initialize() {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const button = canvasFunctions.insertElement(
                    this.tileParam.x + (col * (this.tileParam.width + this.tileParam.leftPadding)),
                    this.tileParam.y + (row * (this.tileParam.height + this.tileParam.bottomPadding)),
                    this.tileParam.width, this.tileParam.height, "button")

                this.container.appendChild(button)
                button.id = this.unknownTiles[row][col]
                button.dataset.row = row
                button.dataset.col = col
                button.dataset.tilled = false
                button.style.opacity = "0"
                button.style.cursor = "pointer"

                this.mainContext.beginPath()
                this.mainContext.lineWidth = 0.2
                if (this.unknownTiles[row][col] == 1) {
                    this.#image(this.iconContext, ".\\Assets\\Stargate.png",
                        col, row, this.tileParam)
                    button.dataset.visibility = "known"
                }
                else if (this.unknownTiles[row][col] == 2) {
                    this.#image(this.iconContext, ".\\Assets\\Oasis-marker.png",
                        col, row, this.tileParam)

                    canvasFunctions.outline(this.mainContext, undefined, 0,
                        row, col, this.tileParam)
                    button.dataset.visibility = "known"
                    if(this.tileArangement[row][col] != 3)
                    button.dataset.oasis = true
                }
                else if (this.unknownTiles[row][col] == 0) {
                    canvasFunctions.outline(this.mainContext, "#A2840C", 1,
                        row, col, this.tileParam)
                    button.dataset.visibility = "unknown"
                }

                this.mainContext.closePath()
            }
        }

    }

    coverTiles(){}

    render() {

    }

    redrawTiles(row, col, rectFill, outline = false, visible = false, context = this.mainContext) {
        const tileParam = {
            x: this.tileParam.x,
            y: this.tileParam.y,
            width: this.tileParam.width,
            height: this.tileParam.height,
            leftPadding: this.tileParam.leftPadding,
            bottomPadding: this.tileParam.bottomPadding
        }

        this.clearElement(
            tileParam.x + (col * (tileParam.width + tileParam.leftPadding)),
            tileParam.y + (row * (tileParam.height + tileParam.bottomPadding)),
            tileParam.width, tileParam.height, context)
        context.beginPath()
        context.strokeStyle = "#00000090"
        if (outline) context.lineWidth = 3
        else context.lineWidth = 0.2
        if (visible) canvasFunctions.outline(context, rectFill, 1, row, col, tileParam, undefined, false)
        else canvasFunctions.outline(context, rectFill, 1, row, col, tileParam)
        context.closePath()
    }

    clearElement(x, y, width, height, context = this.mainContext) {
        context.clearRect(x - 3, y - 3, width + 6, height + 6)
    }

    displayIcon(target) {
        const targetData = target.srcElement.dataset
        this.#image(this.actionContext, ".\\Assets\\move.png", targetData.col, targetData.row, this.tileParam)
    }

    displayShovel(target) {
        const targetData = target.srcElement.dataset
        this.#image(this.actionContext, ".\\Assets\\shovel.png", targetData.col, targetData.row, this.tileParam)
    }

    clearIcon(target) {
        const targetData = target.srcElement.dataset
        this.clearElement(
            this.tileParam.x + (targetData.col * (this.tileParam.width + this.tileParam.leftPadding)),
            this.tileParam.y + (targetData.row * (this.tileParam.height + this.tileParam.bottomPadding)),
            this.tileParam.width, this.tileParam.height, this.actionContext)
    }
}

class PlayerStatsGrid {
    constructor(values, gridValues, baseValues, playerInfo) {
        this.mainCanvas = canvasFunctions.createCanvas()
        this.mainContext = this.mainCanvas.getContext("2d")
        this.upperCanvas = canvasFunctions.createCanvas()
        this.upperContext = this.upperCanvas.getContext("2d")

        this.center = canvasFunctions.getCenter()

        this.values = values

        this.playerInfo = playerInfo

        this.tileParam = getTileParam(
            3,
            3,
            gridValues.width * 2,
            gridValues.height * 1.5,
            gridValues.x - 4,
            gridValues.y - gridValues.height * 1.5 * 2 - 8
        )

        this.upperContext.font = this.tileParam.height / 4 + "px Times"
        this.length = this.upperContext.measureText("Player 1")
        this.maxLength = gridValues.width * 2 - 6
        this.height = (this.length.actualBoundingBoxAscent + this.length.actualBoundingBoxDescent)

        this.waterParam = getTileParam(
            3,
            3,
            (this.tileParam.height - this.height - 2 - 10) / 2,
            (this.tileParam.height - this.height - 2 - 10) / 2,
            this.tileParam.x + 3,
            this.tileParam.y + this.height + 10
        )

        this.actionParam = getTileParam(
            3,
            3,
            (this.tileParam.height - this.height - 2 - 10) / 2,
            (this.tileParam.height - this.height - 2 - 10) / 2,
            this.tileParam.x + 3,
            this.waterParam.y + this.waterParam.height
        )

        this.timerParam = getTileParam(
            3,
            3,
            baseValues.width - this.tileParam.width * 2 - 3,
            this.tileParam.height * 2 + 3,
            this.tileParam.x + this.tileParam.width * 2 + 6,
            this.tileParam.y
        )

        let index = 0
        let colors = ["#990086", "#007739", "#00447F", "#9F1A00"]
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                if (index < values.NOP) {
                    this.initializeTiles(row, col, values[`player${(index + 1)}`], colors[index], "#f0debf")

                    this.image(
                        this.upperContext,
                        ".\\Assets\\water.png",
                        col, row,
                        this.waterParam,
                        this.tileParam)
                    this.displayStats(this.upperContext,
                        this.playerInfo[[`player${(index + 1)}`]].water,
                        col, row,
                        this.waterParam,
                        this.tileParam)

                    this.image(this.upperContext,
                        ".\\Assets\\Action Points.png",
                        col, row,
                        this.actionParam,
                        this.tileParam)
                    this.displayStats(this.upperContext,
                        this.playerInfo[[`player${(index + 1)}`]].actions,
                        col, row,
                        this.actionParam,
                        this.tileParam)

                }

                else {
                    this.initializeTiles(row, col, "", "black", "#8e837075")
                }
                index++
            }
        }

        this.mainContext.beginPath()
        this.mainContext.lineWidth = "1"
        this.mainContext.strokeStyle = "#00000090"
        canvasFunctions.outline(this.mainContext, "#f0debf", 1, 0, 0, this.timerParam)
    }


    initializeTiles(row, col, text, textFill, rectFill) {
        this.mainContext.beginPath()
        this.mainContext.lineWidth = "1"
        this.mainContext.strokeStyle = "#00000090"
        canvasFunctions.outline(this.mainContext, rectFill, 1, row, col, this.tileParam)
        this.mainContext.closePath()

        this.upperContext.beginPath()
        this.upperContext.lineWidth = ".8"
        this.upperContext.fillStyle = textFill
        this.upperContext.strokeStyle = "#000000"
        this.upperContext.fillText(`${text}`,
            (this.tileParam.x + (col * (this.tileParam.width + this.tileParam.leftPadding))) + this.tileParam.leftPadding + 2,
            (this.tileParam.y + (row * (this.tileParam.height + this.tileParam.bottomPadding))) + this.height + 2, this.maxLength)
        this.upperContext.closePath()
    }

    displayStats(context, text, row, col, pictureParam, tileParam,) {
        context.beginPath()
        context.lineWidth = ".8"
        context.fillStyle = "black"
        context.strokeStyle = "#000000"
        context.fillText(`${text}`,
            pictureParam.x + (row * (tileParam.width + pictureParam.leftPadding)) + this.tileParam.leftPadding + 2 + pictureParam.width,
            pictureParam.y + (col * (tileParam.height + pictureParam.bottomPadding)) + this.height + 2,
            pictureParam.width, pictureParam.height)
        context.closePath()
    }

    renderWater(target){
        const playerStat = this.playerInfo[`player${this.playerInfo.currentPlayer}`]
        this.clearElement(
            this.waterParam.x + ((this.playerInfo.currentPlayer % 2 == 0 ? 1 : 0) * (this.tileParam.width + this.waterParam.leftPadding)) + this.tileParam.leftPadding + 2 + this.waterParam.width,
            this.waterParam.y + ((this.playerInfo.currentPlayer < 3 ? 0 : 1) * (this.tileParam.height + this.waterParam.bottomPadding)) + this.height + 2 - 30,
            this.waterParam.width, this.waterParam.height,
            this.upperContext
        )

        this.displayStats(this.upperContext,
            this.playerInfo[[`player${this.playerInfo.currentPlayer}`]].water,
            this.playerInfo.currentPlayer % 2 == 0 ? 1 : 0,
            this.playerInfo.currentPlayer < 3 ? 0 : 1,
            this.waterParam,
            this.tileParam)
    }

    renderStats(target) {
        const playerStat = this.playerInfo[`player${this.playerInfo.currentPlayer}`]
        this.clearElement(
            this.actionParam.x + ((this.playerInfo.currentPlayer % 2 == 0 ? 1 : 0) * (this.tileParam.width + this.actionParam.leftPadding)) + this.tileParam.leftPadding + 2 + this.actionParam.width,
            this.actionParam.y + ((this.playerInfo.currentPlayer < 3 ? 0 : 1) * (this.tileParam.height + this.actionParam.bottomPadding)) + this.height + 2 - 20,
            this.actionParam.width, this.actionParam.height,
            this.upperContext
        )

        this.displayStats(this.upperContext,
            this.playerInfo[[`player${this.playerInfo.currentPlayer}`]].actions,
            this.playerInfo.currentPlayer % 2 == 0 ? 1 : 0,
            this.playerInfo.currentPlayer < 3 ? 0 : 1,
            this.actionParam,
            this.tileParam)

        if (playerStat.actions == 3) {
            this.clearElement(
                this.waterParam.x + ((this.playerInfo.currentPlayer % 2 == 0 ? 1 : 0) * (this.tileParam.width + this.waterParam.leftPadding)) + this.tileParam.leftPadding + 2 + this.waterParam.width,
                this.waterParam.y + ((this.playerInfo.currentPlayer < 3 ? 0 : 1) * (this.tileParam.height + this.waterParam.bottomPadding)) + this.height + 2 - 30,
                this.waterParam.width, this.waterParam.height,
                this.upperContext
            )

            this.displayStats(this.upperContext,
                this.playerInfo[[`player${this.playerInfo.currentPlayer}`]].water,
                this.playerInfo.currentPlayer % 2 == 0 ? 1 : 0,
                this.playerInfo.currentPlayer < 3 ? 0 : 1,
                this.waterParam,
                this.tileParam)
            
            this.clearElement(
                this.tileParam.x + ((this.playerInfo.currentPlayer % 2 == 0 ? 1 : 0) * (this.tileParam.width + this.tileParam.leftPadding)),
                this.tileParam.y + ((this.playerInfo.currentPlayer < 3 ? 0 : 1) * (this.tileParam.height + this.tileParam.bottomPadding)),
                this.tileParam.width, this.tileParam.height)

            this.redrawTiles(
                this.playerInfo.currentPlayer < 3 ? 0 : 1,
                this.playerInfo.currentPlayer % 2 == 0 ? 1 : 0,
                "#F0DEBF", true
            )
 
            let nextPlayer = this.playerInfo.currentPlayer == this.values.NOP ? 1 : this.playerInfo.currentPlayer + 1

            this.clearElement(
                this.tileParam.x + ((nextPlayer % 2 == 0 ? 1 : 0) * (this.tileParam.width + this.tileParam.leftPadding)),
                this.tileParam.y + ((nextPlayer < 3 ? 0 : 1) * (this.tileParam.height + this.tileParam.bottomPadding)),
                this.tileParam.width, this.tileParam.height)

            this.redrawTiles(
                nextPlayer < 3 ? 0 : 1,
                nextPlayer % 2 == 0 ? 1 : 0,
                "#F8C300", true
            )
        }
    }

    image(context, src, row, col, pictureParam, tileParam) {
        const img = new Image()
        img.onload = function () {
            context.drawImage(this,
                pictureParam.x + (row * (tileParam.width + pictureParam.leftPadding)),
                pictureParam.y + (col * (tileParam.height + pictureParam.bottomPadding)),
                pictureParam.width, pictureParam.height)
        }
        img.src = src

    }

    redrawTiles(row, col, rectFill, outline = false, visible = false) {
        const tileParam = {
            x: this.tileParam.x,
            y: this.tileParam.y,
            width: this.tileParam.width,
            height: this.tileParam.height,
            leftPadding: this.tileParam.leftPadding,
            bottomPadding: this.tileParam.bottomPadding
        }

        this.clearElement(
            tileParam.x + (col * (tileParam.width + tileParam.leftPadding)),
            tileParam.y + (row * (tileParam.height + tileParam.bottomPadding)),
            tileParam.width, tileParam.height)
        this.mainContext.beginPath()
        this.mainContext.strokeStyle = "#00000090"
        canvasFunctions.outline(this.mainContext, rectFill, 1, row, col, tileParam)
        this.mainContext.closePath()


    }

    clearElement(x, y, width, height, context = this.mainContext) {
        context.clearRect(x - 2, y - 2, width + 4, height + 4)
    }
}

class GameStas {
    constructor(values) {
        this.stats = {
            player1: {
                water: values.water,
                actions: 3,
                color: {
                    active: "#990086",
                    passive: "#990086a0"
                },
                position: {
                    row: 2,
                    col: 2
                },
                active: true
            },
            player2: {
                water: values.water,
                actions: 3,
                color: {
                    active: "#a3be8c",
                    passive: "#a3be8ca0"
                },
                position: {
                    row: 2,
                    col: 2
                },
                active: false
            },
            player3: {
                water: values.water,
                actions: 3,
                color: {
                    active: "#81a1c1",
                    passive: "#81a1c1a0"
                },
                position: {
                    row: 2,
                    col: 2
                },
                active: false
            },
            player4: {
                water: values.water,
                actions: 3,
                color: {
                    active: "#bf616a",
                    passive: "#bf616aa0"
                },
                position: {
                    row: 2,
                    col: 2
                },
                active: false
            },
            item1: {
                clues: 0,
                found: false
            },
            item2: {
                clues: 0,
                found: false
            },
            item3: {
                clues: 0,
                found: false
            },
            currentPlayer: 1,
            gameover: false
        }
    }

    updateStats(target) {
        console.log(this.stats[`player${this.stats.currentPlayer}`])
        let currentPlayer = this.stats[`player${this.stats.currentPlayer}`]
        currentPlayer.actions--
    }

    nextPlayer(target) {
        let currentPlayer = this.stats[`player${this.stats.currentPlayer}`]
        currentPlayer.water = currentPlayer.water - 1
        currentPlayer.actions = 3
    }
}

class GameTiles {
    constructor() {
        this.tiles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9]

        this.gridMatrix = undefined
        this.unknownTiles = undefined
        this.repeat = true

        this.initialize()
    }
    initialize() {
        while (this.repeat) {
            this.repeat = false
            this.gridMatrix = [
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]
            ]

            this.unknownTiles = [
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]
            ]

            this.insertItems()
            this.insertItemClues()
            this.insertOasis()
        }
    }

    insertItems() {
        const itemTiles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6]
        const suffeledItems = this.#shuffleArray(itemTiles)

        this.#updateTiles(suffeledItems)
    }

    insertItemClues() {
        let clue = undefined
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.gridMatrix[row][col] === 4) {
                    clue = this.positionClue(row, col)
                    if (clue == undefined) {
                        this.repeat = true
                    }
                    else {
                        this.gridMatrix[clue.row1][clue.col1] = 7
                        this.gridMatrix[clue.row2][clue.col2] = 7
                    }
                }
                if (this.gridMatrix[row][col] === 5) {
                    clue = this.positionClue(row, col)
                    if (clue == undefined) {
                        this.repeat = true
                    }
                    else {
                        this.gridMatrix[clue.row1][clue.col1] = 8
                        this.gridMatrix[clue.row2][clue.col2] = 8
                    }
                }
                if (this.gridMatrix[row][col] === 6) {
                    clue = this.positionClue(row, col)
                    if (clue == undefined) {
                        this.repeat = true
                    }
                    else {
                        this.gridMatrix[clue.row1][clue.col1] = 9
                        this.gridMatrix[clue.row2][clue.col2] = 9
                    }
                }
            }
        }
    }

    positionClue(row, col) {
        this.clues = {
            row1: 0,
            col1: 0,
            row2: 0,
            col2: 0
        }

        for (this.row of this.#shuffleArray([0, 1, 2, 3, 4])) {
            if (this.gridMatrix[this.row][col] == 0 && this.row != row) {
                this.clues.row1 = this.row
                this.clues.col1 = col
                for (this.col of this.#shuffleArray([0, 1, 2, 3, 4])) {

                    if (this.gridMatrix[row][this.col] == 0 && this.col != col) {
                        this.clues.row2 = row
                        this.clues.col2 = this.col
                        return this.clues
                    }
                }

            }
        }
    }

    insertOasis() {
        const itemTiles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 3]
        const suffeledItems = this.#shuffleArray(itemTiles)
        this.#updateTiles(suffeledItems)
    }

    #shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array
    }

    #updateTiles(suffeledItems) {
        this.index = 0
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.gridMatrix[row][col] == 0 && this.index < suffeledItems.length) {
                    this.gridMatrix[row][col] = suffeledItems[this.index]

                    if (suffeledItems[this.index] == 2 || suffeledItems[this.index] == 3) {
                        this.unknownTiles[row][col] = 2
                    }
                    this.index++
                }
            }

        }
    }

}

class playerActions {
    constructor(gridValues, values, playerInfo, statGrid) {
        this.mainCanvas = canvasFunctions.createCanvas()
        this.mainContext = this.mainCanvas.getContext("2d")

        this.mainContext.font = variables.fontSize(0.016)
        this.length = this.mainContext.measureText("Player 1")
        this.height = (this.length.actualBoundingBoxAscent + this.length.actualBoundingBoxDescent)
        this.center = canvasFunctions.getCenter()

        this.NOP = values.NOP
        this.playerInfo = playerInfo
        this.statGrid = statGrid
        this.gridValues = gridValues

        this.tileParam = getTileParam(
            gridValues.height - gridValues.height / 2.5 * 2,
            gridValues.width - gridValues.width / 2.5 * 2,
            gridValues.width / 2.5,
            gridValues.height / 2.5,
            gridValues.x + (2 * (gridValues.width + gridValues.leftPadding)),
            gridValues.y + (2 * (gridValues.height + gridValues.bottomPadding)),
        )
        this.initialize()
        this.beginGame()

    }

    image(context, src, row, col, tileParam, PlayerStatsGrid) {
        const img = new Image()
        img.src = src
        img.onload = function () {
            context.drawImage(this,
                tileParam.x + (row * (tileParam.width + tileParam.leftPadding)),
                tileParam.y + (col * (tileParam.height + tileParam.bottomPadding)),
                tileParam.width, tileParam.height)
        }
    }

    initialize() {
        this.mainContext.lineWidth = 1

        let row = 0; let col = 0
        for (let i = 0; i < this.NOP; i++) {
            this.mainContext.beginPath()
            canvasFunctions.outline(this.mainContext,
                this.playerInfo["player" + (i + 1)].color.passive,
                100,
                row,
                col,
                this.tileParam,
                20)
            this.image(this.mainContext, ".\\Assets\\Player.png", col, row, this.tileParam)
            this.mainContext.fill()
            this.mainContext.closePath()
            col++
            if (col == 2) {
                row++
                col = 0
            }
        }
    }

    beginGame() {
        this.statGrid.redrawTiles(0,
            0,
            "#CBC062", true)

    }

    startTurn(target) {
        this.statGrid.redrawTiles(targetData.row,
            targetData.col,
            "#ebcb8b", true)
    }

    movePlayer(target) {
        const targetData = target.srcElement.dataset
        console.log(this.playerInfo)
        const position = this.playerInfo[`player${this.playerInfo.currentPlayer}`].position
        const tileParam = getTileParam(
            this.gridValues.height - this.gridValues.height / 2.5 * 2,
            this.gridValues.width - this.gridValues.width / 2.5 * 2,
            this.gridValues.width / 2.5,
            this.gridValues.height / 2.5,
            this.gridValues.x + (position.col * (this.gridValues.width + this.gridValues.leftPadding)),
            this.gridValues.y + (position.row * (this.gridValues.height + this.gridValues.bottomPadding)),
        )

        this.clearElement(
            tileParam.x + ((this.playerInfo.currentPlayer % 2 == 0 ? 1 : 0) * (tileParam.width + tileParam.leftPadding)),
            tileParam.y + ((this.playerInfo.currentPlayer < 3 ? 0 : 1) * (tileParam.height + tileParam.bottomPadding)),
            tileParam.width, tileParam.height)

        tileParam.x = this.gridValues.x + (targetData.col * (this.gridValues.width + this.gridValues.leftPadding))
        tileParam.y = this.gridValues.y + (targetData.row * (this.gridValues.height + this.gridValues.bottomPadding))

        this.mainContext.beginPath()
        canvasFunctions.outline(this.mainContext,
            this.playerInfo[`player${this.playerInfo.currentPlayer}`].color.passive,
            100,
            this.playerInfo.currentPlayer < 3 ? 0 : 1,
            this.playerInfo.currentPlayer % 2 == 0 ? 1 : 0,
            tileParam,
            20)

        this.image(this.mainContext,
            ".\\Assets\\Player.png",
            this.playerInfo.currentPlayer % 2 == 0 ? 1 : 0,
            this.playerInfo.currentPlayer < 3 ? 0 : 1,
            tileParam)
        this.mainContext.fill()
        this.mainContext.closePath()
        position.row = targetData.row
        position.col = targetData.col
    }

    clearElement(x, y, width, height) {
        this.mainContext.clearRect(x - 2, y - 2, width + 4, height + 4)
    }

}

export function loadGame(values, selector) {
    for (var canvas of document.querySelectorAll("canvas")) {
            document.body.removeChild(canvas)
        }
    
        document.body.removeChild(document.querySelector(selector))

    const container = document.createElement("div")
    document.body.appendChild(container)
    container.id = "game"

    const baseGrid = new drawBaseGrid()
    const tiles = new GameTiles()
    const pstats = new GameStas(values)
    const base = new playArea(tiles.unknownTiles, tiles.gridMatrix, baseGrid.baseParam)
    const stats = new PlayerStatsGrid(values, base.tileParam, baseGrid.baseParam, pstats.stats)
    const actions = new playerActions(base.tileParam, values, pstats.stats, stats)

    delegate(base.container, "mouseover", "button", onHoverElement)
    delegate(base.container, "mouseover", "button", displayMoveIcon)
    delegate(base.container, "mouseover", "button", displayShovel)

    function onHoverElement(target, event) {
        const targetData = target.srcElement.dataset
        if (targetData.visibility == "unknown") {
            base.redrawTiles(targetData.row,
                targetData.col,
                "#CEA90E", true)
        }
        else {
            base.redrawTiles(targetData.row,
                targetData.col,
                "#00000000", true)
        }
        target.srcElement.addEventListener("pointerleave", mouseLeaveElement)
    }

    function displayShovel(target){
        const targetData = target.srcElement.dataset
        const position = pstats.stats[`player${pstats.stats.currentPlayer}`].position

        if ((targetData.row == position.row && targetData.col == position.col) && 
            !(position.row == 2 && position.col == 2 && target.srcElement.dataset.tilled != true)) {
            base.displayShovel(target)
            target.srcElement.addEventListener("click", makeItKnown)
            target.srcElement.addEventListener("pointerleave", removeIcon)
        }
    }

    function makeItKnown(target){
        let targetData = target.srcElement.dataset
        useActionPoint(target)
        targetData.tilled = true
        targetData.visibility = "known"
        base.redrawTiles(targetData.row,
            targetData.col,
            "#A2840C00", false, false)
        base.redrawTiles(targetData.row,
                targetData.col,
                "#A2840C00", false, true, base.iconContext)
        base.clearIcon(target)
        console.log(targetData.oasis == "true")
        if(targetData.oasis == "true"){
            console.log(pstats.stats["player" + pstats.stats.currentPlayer].water, values.water)
            pstats.stats["player" + pstats.stats.currentPlayer].water = values.water
            stats.renderWater(target)
        }
        target.srcElement.removeEventListener("click", makeItKnown)
    }

    function displayMoveIcon(target) {
        const targetData = target.srcElement.dataset
        const position = pstats.stats[`player${pstats.stats.currentPlayer}`].position

        if (!(targetData.row == position.row && targetData.col == position.col)) {
            if (((targetData.row == position.row) || (targetData.col == position.row)) &&
            (Math.abs(targetData.row - position.row) == 1 || Math.abs(targetData.col - position.col) == 1))  {
                /* base.displayIcon(target) */
            }
            target.srcElement.addEventListener("click", moveTo)
            /* target.srcElement.addEventListener("pointerleave", removeIcon) */
        }
    }

    function removeIcon(target) {
        base.clearIcon(target)
        target.srcElement.removeEventListener("pointerleave", removeIcon)
    }

    function moveTo(target) {
        const targetData = target.srcElement.dataset
        const position = pstats.stats[`player${pstats.stats.currentPlayer}`].position

        if ((targetData.row == position.row || targetData.col == position.col)) {
            if ((Math.abs(targetData.row - position.row) == 1 || Math.abs(targetData.col - position.col) == 1))  {
                /* removeIcon(target) */
                actions.movePlayer(target)
                useActionPoint(target)
                pstats.stats[`player${pstats.stats.currentPlayer}`].position
                
        }
    }
    
    
}
function useActionPoint(target){
    let currentPlayer = pstats.stats[`player${pstats.stats.currentPlayer}`]
    pstats.updateStats(target)
            stats.renderStats(target)
        
            if (currentPlayer.actions == 0) {
                currentPlayer.actions = 3
                pstats.nextPlayer(target)
                stats.renderStats(target)
                if (pstats.stats.currentPlayer != values.NOP) {
                    pstats.stats.currentPlayer++
                }
                else {
                    pstats.stats.currentPlayer = 1
                }
            }
}
    function mouseLeaveElement(target, event) {
        const targetData = target.srcElement.dataset
        if (targetData.visibility == "unknown") {
            base.redrawTiles(targetData.row,
                targetData.col,
                "#A2840C")
        }
        else {
            base.redrawTiles(targetData.row,
                targetData.col,
                "#A2840C00", false, false)
        }
        target.srcElement.removeEventListener("pointerleave", mouseLeaveElement)

    }
}
