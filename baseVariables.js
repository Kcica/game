export const tiles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9]

export function fontSize(percentage) {
    return (window.innerWidth > window.innerHeight) ?
        window.innerWidth * percentage + "px Times" : window.innerHeight * percentage + "px Times"
}

export const assets = {
    0: ".\\Assets\\Hole.png",
    2: ".\\Assets\\Oasis.png",
    3: ".\\Assets\\Drought.png",
    4: ".\\Assets\\Item 1.png",
    5: ".\\Assets\\Item 2.png",
    6: ".\\Assets\\Item 3.png",
    7: ".\\Assets\\Item 1 - clue.png",
    8: ".\\Assets\\Item 2 - clue.png",
    9: ".\\Assets\\Item 3 - clue.png",
}

