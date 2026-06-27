// 1. Recipe Data Array
// Added mock descriptions, tags, and ratings based on the provided images
const recipes = [
    {
        name: "Apple Crisp",
        imgSrc: "images/apple-crisp.jpg",
        tags: ["dessert", "fall", "fruit"],
        rating: 4,
        description: "This apple crisp recipe is a simple yet delicious fall dessert that's great served warm with vanilla ice cream."
    },
    {
        name: "Black Beans and Rice",
        imgSrc: "images/black-beans-and-rice.jpg",
        tags: ["dinner", "vegetarian", "healthy"],
        rating: 5,
        description: "A hearty, flavorful, and classic Cuban dish that comes together quickly."
    },
    {
        name: "Chicken Curry",
        imgSrc: "images/chicken-curry.webp",
        tags: ["dinner", "poultry", "spicy"],
        rating: 4,
        description: "A rich and creamy chicken curry full of amazing Indian spices."
    },
    {
        name: "Chocolate Chip Cookies",
        imgSrc: "images/chocolate-chip-cookies.jpg",
        tags: ["dessert", "baking", "sweet"],
        rating: 5,
        description: "Classic homemade chocolate chip cookies, chewy on the inside and crispy on the edges."
    },
    {
        name: "Escalopes de Poulet a la Creme With Steamed Green Beans (Chicken With Cream Sauce)",
        imgSrc: "images/escalopes-de-poulet-a-la-creme.webp",
        tags: ["dinner", "poultry", "french"],
        rating: 4,
        description: "French style chicken cutlets pan-seared and served in a rich cream sauce."
    },
    {
        name: "German Gooseberry Cake",
        imgSrc: "images/german-gooseberry-cake.jpg",
        tags: ["dessert", "german", "fruit"],
        rating: 3,
        description: "A traditional tart and sweet German cake featuring fresh gooseberries."
    },
    {
        name: "Roasted Potatoes",
        imgSrc: "images/roasted-potatoes.webp",
        tags: ["side", "vegetarian"],
        rating: 4,
        description: "Crispy herb-roasted potatoes that make the perfect side dish for any meal."
    },
    {
        name: "Sweet Potato Waffles",
        imgSrc: "images/sweet-potato-waffle-md.jpg",
        tags: ["breakfast", "sweet"],
        rating: 5,
        description: "Delicious and cozy sweet potato waffles, perfect for a crisp weekend morning."
    }
];

// 2. DOM Variables
const recipeContainer = document.querySelector('#recipe-container');
const searchForm = document.querySelector('.search-box');
const searchInput = document.querySelector('.search-box input');

// 3. Template Functions
function tagsTemplate(tags) {
    return `<div class="tag-container">${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`;
}

function ratingTemplate(rating) {
    let html = `<span class="rating" role="img" aria-label="Rating: ${rating} out of 5 stars">`;
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            html += `<span aria-hidden="true" class="icon-star">⭐</span>`;
        } else {
            html += `<span aria-hidden="true" class="icon-star-empty">☆</span>`;
        }
    }
    html += `</span>`;
    return html;
}

function recipeTemplate(recipe) {
    return `<article class="recipe-card">
        <div class="recipe-image-container">
            <img src="${recipe.imgSrc}" alt="${recipe.name}">
        </div>
        
        <div class="recipe-details">
            ${tagsTemplate(recipe.tags)}
            <h2>${recipe.name}</h2>
            ${ratingTemplate(recipe.rating)}
            <p class="recipe-description">
                ${recipe.description}
            </p>
        </div>
    </article>`;
}

function renderRecipes(recipeList) {
    // Clear out previous content
    recipeContainer.innerHTML = '';
    
    // Generate HTML for the list and inject it
    const html = recipeList.map(recipeTemplate).join('');
    recipeContainer.innerHTML = html;
}

// 4. Search and Sort Logic
function search(event) {
    // Prevent the form from reloading the page
    event.preventDefault(); 
    
    const query = searchInput.value.toLowerCase();

    // Filter by name, description, or tags
    const filteredRecipes = recipes.filter(function(recipe) {
        return ( 
            recipe.name.toLowerCase().includes(query) ||
            recipe.description.toLowerCase().includes(query) || 
            recipe.tags.find(tag => tag.toLowerCase().includes(query))
        );
    });

    // Sort alphabetically by name
    const sortedRecipes = filteredRecipes.sort(function(a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        return 0;
    });

    renderRecipes(sortedRecipes);
}

// 5. Event Listeners & Initialization
// Listening to the form 'submit' handles both the button click AND hitting 'Enter'
searchForm.addEventListener('submit', search);

function init() {
    // Show a random recipe on initial load
    const randomNum = Math.floor(Math.random() * recipes.length);
    renderRecipes([recipes[randomNum]]);
}

init();