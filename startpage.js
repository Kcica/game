import * as canvasFunctions from "./canvas.js"
import { loadSelectPage } from "./playerSelect.js"
import { fontSize } from "./baseVariables.js"

const mainCanvas = canvasFunctions.createCanvas()

const mainContext = mainCanvas.getContext("2d")

const center = canvasFunctions.getCenter(undefined)

const word = "START"

const htmlElemnts = []

mainContext.font = fontSize(0.040)
const length = (mainContext.measureText(word))
const height = (length.actualBoundingBoxAscent - length.actualBoundingBoxDescent)

mainContext.fillStyle = "#81563E60"
mainContext.lineWidth = "3"
mainContext.strokeStyle = "#00000090"
mainContext.roundRect(center.x - length.width / 2  - length.width / 8, center.y - height * 2, length.width + length.width / 4,  height * 4, 20)
mainContext.fill()
mainContext.stroke()

mainContext.lineWidth = ".8"
mainContext.fillStyle = "#fff9db"
mainContext.strokeStyle = "#000000"
mainContext.fillText(word, center.x - length.width / 2, center.y + height / 2)
mainContext.strokeText(word, center.x - length.width / 2, center.y + height / 2)
 
const gombi = canvasFunctions.insertElement(center.x - length.width / 2  - length.width / 8, center.y - height * 2, length.width * 1.25, height * 4, "button")

document.body.appendChild(gombi)
htmlElemnts.push(gombi)

gombi.style.cursor = "pointer"
gombi.style.opacity = "0"

gombi.addEventListener("click", handle => {loadSelectPage(mainContext, htmlElemnts)})

