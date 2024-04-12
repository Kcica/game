export function createCanvas() {
    const canvas = document.createElement('canvas')

    if (window.innerWidth > window.innerHeight){
        canvas.width = window.innerWidth - 8
        canvas.height = window.innerHeight - 8
    } 
    else{
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }
    
    canvas.style.position = "absolute"
    document.body.insertBefore(canvas, document.querySelector("#canvasLine"))

    return canvas
}

export function clearCanvas(context){
    if (window.innerWidth > window.innerHeight){
        context.clearRect(0, 0, window.innerWidth - 8, window.innerHeight - 8)
    } 
    else{
        context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
}

export function outline(context, fillStyle, alpha, row, col, tileParam) {

    context.roundRect(
        tileParam.x + (col * (tileParam.width + tileParam.leftPadding)),
        tileParam.y + (row * (tileParam.height + tileParam.bottomPadding)),
        tileParam.width, tileParam.height, 6)
    context.globalAlpha = alpha
    context.fillStyle = fillStyle
    context.fill()
    context.globalAlpha = 1
    context.stroke()
}

export function getCenter() {
    const wHeight = window.innerHeight
    const wWidth = window.innerWidth
    return {
        x: wWidth / 2,
        y: wHeight / 2
    }
}

export function insertElement(canvasX, canvasY, width, height, type, dataName = "", dataValue = "") {
    const element = document.createElement(type)

    element.style.position = "absolute"

    element.style.top = canvasY + 8 + "px"
    element.style.left = canvasX + 8 + "px"
    //1.25 = width + width / 4
    element.style.width = width + "px"
    element.style.height = height + "px"
    if(dataName != ""){
        element.setAttribute(dataName, dataValue)
        
    }

    return element
}