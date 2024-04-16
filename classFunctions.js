export function redrawTextTiles(tileParam, row, col, label, textFill, rectFill) {
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

export function redrawTiles(baseParam, row, col, rectFill) {
    console.log(baseParam)
    const tileParam = {
        x: baseParam.x + 4,
        y: baseParam.y + 4,
        width: baseParam.width / 5 - 4,
        height: baseParam.height / 5 - 4,
        leftPadding: baseParam.leftPadding,
        bottomPadding: baseParam.bottomPadding
    }

    this.clearElement(
        tileParam.x + (col * (tileParam.width + tileParam.leftPadding)),
        tileParam.y + (row * (tileParam.height + tileParam.bottomPadding)),
        tileParam.width, tileParam.height)
    this.mainContext.lineWidth = 0.2
    this.mainContext.beginPath()
    this.mainContext.strokeStyle = "#00000090"
    canvasFunc.outline(this.mainContext, rectFill, 1, row, col, tileParam)
    this.mainContext.closePath()

}