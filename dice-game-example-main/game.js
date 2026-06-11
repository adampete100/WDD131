// when button is clicked, 
// change all selected die images to the gif animation

document.getElementById("rollButton").addEventListener("click", event => {
    // get all the die images
    const images = document.querySelectorAll("#gameboard img");

    images.forEach( image => {
        if (isDieUnlocked(image)) {
            image.src = "assets/die_rolling.gif";
        }
    })

    setTimeout( () => {
        images.forEach( image => {
            if (isDieUnlocked(image)) {
                image.src = "assets/white_dice_" + (Math.floor(Math.random() * 6) + 1) + ".gif";
            }
        });
    }, 500);
    //timer?
})

function isDieUnlocked(dieImage) {
    const checkboxes = document.querySelectorAll("#gameboard input");
    const unchecked = Array.from(checkboxes)
                    .filter( checkbox => !checkbox.checked);
    return unchecked.find(unchecked => unchecked.className === dieImage.className);
}