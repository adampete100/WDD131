let selectButton = document.querySelector(".menu-btn")

selectButton.addEventListener('click', handleMenuButtonClick); // Listen for click

// Show dropdown menu when called
function handleMenuButtonClick() {
    console.log();
    let selectNav = document.querySelector("nav")
    // Toggle on/off dropdown menu
    selectNav.classList.toggle("hide");
    selectButton.classList.toggle("change")
}