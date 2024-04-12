import * as canvasFunctions from "./canvas.js"
import * as variables from "./baseVariables.js"

class playArea {
    constructor() {
        this.tiles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9]

        this.unknownTiles = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];
        this.padding = 3.5

        this.center = this.#allignTable(this.padding)
        this.baseCanvas = canvasFunctions.createCanvas()
        this.#drawBaseContext(this.baseCanvas)

        this.tileCanvas = canvasFunctions.createCanvas()

        this.tileArangement = this.#shuffleArray(this.tiles)
        this.#updateTiles()
        this.render(this.tileCanvas)
    }

    #allignTable(padding = 0) {
        const wHeight = window.innerHeight
        const wWidth = window.innerWidth
    
        console.log(wWidth > wHeight)
        const center = wWidth / 2 > wHeight / 4 ? 
        {
            x: wWidth / 2 - wHeight / 4,
            //0.375 = wHeight / 4 + wHeight / 8 or wHeight / 2 - wHeight / 8
            y: wHeight * 0.375,
            cellSize: (wHeight / 2 - 4 * padding - 8) / 5
        } :
        {
            x: wWidth * 0.05,
            //0.45 = wWidth / 2 - wWidth * 0.5
            y: wHeight / 2 - (wWidth * 0.45) / 2,
            //For some reason 4 pixel on larger resolution is not the same as in smaller ones therefore the side padding is smaller (- 8 -> - 1)
            cellSize: ((wWidth * 0.45) * 2 - 4 * padding - 1) / 5 
        }
    
        return center
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

    #updateTiles() {
        this.index = 0
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {

                if (row == 2 && col == 2) {
                    continue
                }
                else if (this.tileArangement[this.index] == 2 || this.tileArangement[this.index] == 3) {
                    this.unknownTiles[row][col] = 2
                }
                else {
                    this.unknownTiles[row][col] = 0
                }
                this.index++
            }
        }
    }

    #drawBaseContext(canvas) {
        this.context = canvas.getContext("2d")
        this.context.lineWidth = 1.7
        this.context.fillStyle = "#FFEDCC"
        console.log(this.center.x, this.center.y,
            (window.innerWidth * 0.45) * 2, (window.innerWidth * 0.45) * 2)
        this.context.beginPath()
        window.innerWidth > window.innerHeight  ? 
            this.context.roundRect(this.center.x, this.center.y,
                window.innerHeight / 2, window.innerHeight / 2, 2) :

            this.context.roundRect(this.center.x, this.center.y,
                (window.innerWidth * 0.45) * 2, (window.innerWidth * 0.45) * 2, 2)
        this.context.fill()
        this.context.stroke()
        this.context.closePath()
    }

    #image(context, src, row, col, tileParam) {
        const img = new Image()
        img.onload = function () {
            context.drawImage(this,
                tileParam.x + (row * (tileParam.width + tileParam.leftPadding)),
                tileParam.y + (col * (tileParam.height + tileParam.bottomPadding)),
                tileParam.width, tileParam.height)
        }
        img.src = src

        if (!(row === 2 && row === 2))
        canvasFunctions.outline(this.context, undefined, 0, row, col, tileParam)
    }

    render(canvas) {
        this.context = canvas.getContext("2d")

        this.tileParam = {
            x: this.center.x + 4,
            y: this.center.y + 4,
            width: this.center.cellSize,
            height: this.center.cellSize,
            leftPadding: this.padding,
            bottomPadding: this.padding
        }

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                this.context.lineWidth = 0.2
                this.context.beginPath()
                if (this.unknownTiles[row][col] == 1) {
                    this.#image(this.context, ".\\Assets\\Stargate.png", 
                    col, row, this.tileParam)
                }
                else if (this.unknownTiles[row][col] == 2) {
                    this.#image(this.context, ".\\Assets\\Oasis-marker.png", 
                        col, row, this.tileParam)

                    canvasFunctions.outline(this.context, undefined, 0, 
                        row, col, this.tileParam)
                }
                else if (this.unknownTiles[row][col] == 0) {
                    canvasFunctions.outline(this.context, "#A2840C", 1, 
                    row, col, this.tileParam)
                }
                this.context.closePath()
            }
        }
    }
}

const gridMatrix = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];

/* const base = new playArea() */

/* const hello = document.createElement("p")
hello.style.position = "absolute"
hello.style.top = "207.593017578125px"
hello.style.left = "0px"
hello.innerHTML = "aaaaa<strong>BBB</strong>"
hello.innerText = "uwu"
document.body.appendChild(hello)
 */
