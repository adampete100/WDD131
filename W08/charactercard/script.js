// 1. Create a singular character literal object with properties and methods
const character = {
    name: "Luke Skywalker",
    class: "The Last Jedi",
    level: 10,
    health: 300,
    image: "luke-skywalker.jpg",

    // Method to handle reduction of health points
    attacked: function() {
        if (this.health > 0) {
            this.health -= 20;
            
            // Enforce lower bounds boundary
            if (this.health < 0) {
                this.health = 0;
            }
        }
        
        // Render adjustments live to screen view
        updateDOM();
        this.verifyLifeState();
    },

    // Method to raise character level parameters
    levelUp: function() {
        this.level += 1;
        updateDOM();
    },

    // Evaluate life rules and alert user upon defeat
    verifyLifeState: function() {
        if (this.health === 0) {
            document.getElementById("death-status").classList.remove("hidden");
            document.getElementById("btn-attack").disabled = true;
        }
    }
};

// 2. Maps internal object value modifications directly to the window view template
function updateDOM() {
    document.getElementById("char-name").textContent = character.name;
    document.getElementById("char-class").textContent = character.class;
    document.getElementById("char-level").textContent = character.level;
    document.getElementById("char-health").textContent = character.health;
    document.getElementById("char-image").src = character.image;
}

// 3. Document mounting trigger
document.addEventListener("DOMContentLoaded", () => {
    // Initial paint setup
    updateDOM();

    // Event listener assignments routing directly to object functions
    document.getElementById("btn-attack").addEventListener("click", () => {
        character.attacked();
    });

    document.getElementById("btn-level").addEventListener("click", () => {
        character.levelUp();
    });
});