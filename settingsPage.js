import * as canvasFunc from "./canvas.js"
import { fontSize } from "./baseVariables.js"
import { delegate, getTileParam } from "./functions.js"
import { createCanvas, getCenter } from "./canvas.js"
import { loadSelect } from "./playerSelect.js"

class Heading {
    constructor(height, nrOfPlayers) {
        this.mainCanvas = createCanvas()
        this.mainContext = this.mainCanvas.getContext("2d")

        const center = getCenter()

        this.mainContext.font = fontSize(0.03)
        this.lengthHeading = this.mainContext.measureText("Settings")
        this.heightHeading = (this.lengthHeading.actualBoundingBoxAscent + this.lengthHeading.actualBoundingBoxDescent)
        this.tileParamHeading = getTileParam(
            40,
            0,
            this.lengthHeading.width * 2,
            this.heightHeading * 2,
            center.x - this.lengthHeading.width / 2,
            center.y - height - height * nrOfPlayers - 10 * nrOfPlayers / 2 - 40 - window.innerWidth / 16
        )

        if (window.innerWidth > window.innerHeight) {
            this.mainContext.fillStyle = "#2e3440"
            this.mainContext.fillText(
                "Settings",
                this.tileParamHeading.x,
                this.tileParamHeading.y
            )
        }
        else {
            this.mainContext.fillStyle = "#f1f3f5"
            this.mainContext.fillText(
                "Settings",
                this.tileParamHeading.x,
                this.tileParamHeading.y
            )
        }

    }
}

class Form {
    constructor(nrOfPlayers) {
        const mainCanvas = createCanvas()
        this.mainContext = mainCanvas.getContext("2d")
        this.container = document.querySelector("#settings")
        this.nrOfPlayers = nrOfPlayers
        this.htmlElemnts = []

        this.center = canvasFunc.getCenter()

        this.mainContext.font = fontSize(0.016)
        this.length = this.mainContext.measureText("Player 1 name:")
        this.height = (this.length.actualBoundingBoxAscent + this.length.actualBoundingBoxDescent)
        this.tileParam = getTileParam(
            10,
            5,
            this.length.width * 3,
            this.height * 2,
            this.center.x - this.length.width * 3 / 2,
            this.center.y - this.height - this.height * nrOfPlayers - 10 * nrOfPlayers / 2 - window.innerWidth / 16
        )

        const settingsOptions = []
        const settingsIds = []
        for (let nr = 1; nr <= nrOfPlayers; nr++) {
            settingsOptions.push("Player " + nr + " name:")
            settingsIds.push("player" + nr)
        }

        settingsOptions.push("Starting water:")
        settingsIds.push("water")

        this.mainContext.font = fontSize(0.016)
        let index = 0
        for (let label of settingsOptions) {

            this.renderTiles(index, 0, label, "#81563e", "#ffeccbe0")

            const input = canvasFunc.insertElement(
                this.tileParam.x + (0 * (this.tileParam.width)) + this.tileParam.leftPadding + this.length.width,
                this.tileParam.y + (index * (this.tileParam.height + this.tileParam.bottomPadding)),
                this.tileParam.width - (this.tileParam.leftPadding * 2 + this.length.width),
                this.tileParam.height - this.height / 2,
                "input", undefined, undefined)

            this.container.appendChild(input)
            input.style.font = fontSize(0.016)
            input.style.background = "transparent"
            input.style.outline = "transparent"
            input.style.borderColor = "transparent"
            input.id = settingsIds[index]
            input.dataset.row = index
            input.dataset.col = 0
            this.htmlElemnts.push(input)
            index++
        }
    }

    renderTiles(row, col, text, textFill, rectFill) {
        this.mainContext.lineWidth = 0.2
        this.mainContext.beginPath()
        this.mainContext.lineWidth = "3"
        this.mainContext.strokeStyle = "#00000090"
        canvasFunc.outline(this.mainContext, rectFill, 1, row, col, this.tileParam)

        this.mainContext.lineWidth = ".8"
        this.mainContext.fillStyle = textFill
        this.mainContext.strokeStyle = "#000000"
        this.mainContext.fillText(`${text}`,
            (this.tileParam.x + (col * (this.tileParam.width + this.tileParam.leftPadding))) + this.tileParam.leftPadding,
            (this.tileParam.y + (row * (this.tileParam.height + this.tileParam.bottomPadding))) + this.tileParam.height / 2 + this.tileParam.height / 8)
        this.mainContext.closePath()
    }

    getPosY() {
        return this.center.y + this.height + this.height * this.nrOfPlayers + 10 * this.nrOfPlayers / 2
    }
}

class Buttons {
    constructor(height) {
        this.mainCanvas = createCanvas()
        this.mainContext = this.mainCanvas.getContext("2d")
        this.mainContext.font = fontSize(0.02)
        this.center = getCenter()
        this.htmlElemnts = []
        this.container = document.querySelector("#settings")

        const labels = ["Save", "Cancel"]
        this.posY = height

        let index = 0
        for (let label of labels) {
            this.length = this.mainContext.measureText(label)
            this.height = (this.length.actualBoundingBoxAscent + this.length.actualBoundingBoxDescent)

            this.tileParam = getTileParam(
                10,
                0,
                this.length.width * 2,
                this.height * 3,
                this.center.x - this.length.width,
                height + 20 + this.height - window.innerWidth / 16
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
            (this.tileParam.x + (col * (this.tileParam.width + this.tileParam.leftPadding))) + this.tileParam.width / 4,
            (this.tileParam.y + (row * (this.tileParam.height + this.tileParam.bottomPadding))) + this.tileParam.height / 2 + this.tileParam.height / 8)
        this.mainContext.closePath()
    }

    redrawTiles(row, col, label, textFill, rectFill) {
        const length = this.mainContext.measureText(label)
        const height = (this.length.actualBoundingBoxAscent + this.length.actualBoundingBoxDescent)

        const tileParam = getTileParam(
            10,
            0,
            length.width * 2,
            height * 3,
            this.center.x - length.width,
            this.posY + 20 + height - window.innerWidth / 16
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
            (tileParam.x + (col * (tileParam.width + tileParam.leftPadding))) + tileParam.width / 4,
            (tileParam.y + (row * (tileParam.height + tileParam.bottomPadding))) + tileParam.height / 2 + this.tileParam.height / 8)
        this.mainContext.closePath()

    }

    clearElement(x, y, width, height) {
        this.mainContext.clearRect(x - 2, y - 2, width + 4, height + 4)
    }

}

export function loadSettings(nrOfPlayers, selector) {
    for (var canvas of document.querySelectorAll("canvas")) {
        document.body.removeChild(canvas)
    }

    document.body.removeChild(document.querySelector(selector))

    const container = document.createElement("div")
    document.body.appendChild(container)
    container.id = "settings"

    const settingsMenu = new Form(nrOfPlayers)
    const buttons = new Buttons(settingsMenu.getPosY())
    const heading = new Heading(settingsMenu.height, nrOfPlayers)

    delegate(buttons.container, "mouseover", "button", onHoverElement)
    delegate(settingsMenu.container, "input", "input", getInputValues)
    document.querySelector("#Save").addEventListener("click", saveSettings)
    document.querySelector("#Cancel").addEventListener("click", cancelSettings)

    function onHoverElement(target, event) {
        buttons.redrawTiles(target.srcElement.dataset.row,
            target.srcElement.dataset.col,
            target.srcElement.id,
            "#ffeccb", "#81563ee0")

        target.srcElement.addEventListener("pointerleave", mouseLeaveElement)
    }

    function mouseLeaveElement(target, event) {
        buttons.redrawTiles(target.srcElement.dataset.row,
            target.srcElement.dataset.col,
            target.srcElement.id,
            "#81563e", "#ffeccbe0")
    }

    function getInputValues(target, event) {
        console.log(parseInt(target.srcElement.value) < 1)
        if (target.srcElement.id === "water" &&
            !(parseInt(target.srcElement.value) == NaN || parseInt(target.srcElement.value) > 0)) {
            target.srcElement.placeholder = "Natural number only!"
            target.srcElement.value = ""
            console.log("aa")
        }
    }

    function cancelSettings(target, event) {
        let savedValues = {
            player1: "Player 1",
            player2: "Player 2",
            player3: "Player 3",
            player4: "Player 4",
            water: 6,
            NOP: nrOfPlayers
        }
        loadSelect("#settings", true, savedValues)
    }

    function saveSettings(target, event) {
        let savedValues = {
            player1: "Player 1",
            player2: "Player 2",
            player3: "Player 3",
            player4: "Player 4",
            water: 6,
            NOP: nrOfPlayers
        }

        for (let i = 0; i < nrOfPlayers; i++) {
            let word = document.querySelector("#player" + (i + 1)).value
            if (word != "") {
                savedValues["player" + (i + 1)] = word
            }

        }

        const water = document.querySelector("#water").value
        if (water != "") {
            savedValues.water = water
        }
        loadSelect("#settings", true, savedValues)

    }
}