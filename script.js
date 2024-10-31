const navItems = document.querySelectorAll('.nav-item');
const list = document.getElementById('list');
const popupModal = document.getElementById('popupModal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalIngredients = document.getElementById('modalIngredients');
const modalInstructions = document.getElementById('modalInstructions');
const closeBtn = document.querySelector('.close-btn');

navItems[0].classList.add('active');

navItems.forEach(item => {
    item.addEventListener('click', function(event) {
        navItems.forEach(item => item.classList.remove('active'));
        event.currentTarget.classList.add('active');
        fetchData(event.currentTarget.id);
    });
});

async function fetchData(id) {
    try {
        const response = await fetch(`https://thecocktaildb.com/api/json/v1/1/filter.php?c=${id}`);
        const cocktailData = await response.json();
        addItems(cocktailData.drinks);
    } catch (error) {
        console.error('Error fetching data:', error);
        list.innerHTML = '<p class="text-danger">Failed to load data. Please try again later.</p>';
    }
}

function addItems(drinks) {
    list.innerHTML = '';
    if (!drinks || drinks.length === 0) {
        list.innerHTML = '<p class="text-muted">No items found for this category.</p>';
        return;
    }

    drinks.forEach(drink => {
        const container = document.createElement('div');
        container.classList.add('list-item', 'col-12', 'col-sm-3');

        const title = document.createElement('h3');
        title.textContent = drink.strDrink;

        const thumbnail = document.createElement('img');
        thumbnail.src = drink.strDrinkThumb;
        thumbnail.classList.add('thumbnail');
        thumbnail.alt = `${drink.strDrink} thumbnail`;

        thumbnail.addEventListener('click', () => openPopup(drink.idDrink));

        container.appendChild(thumbnail);
        container.appendChild(title);
        list.appendChild(container);
    });
}


async function openPopup(drinkId) {
    try {
        const response = await fetch(`https://thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
        const drinkDetails = await response.json();

        if (drinkDetails.drinks) {
            const drink = drinkDetails.drinks[0];
            modalTitle.textContent = drink.strDrink;
            modalImage.src = drink.strDrinkThumb;
            modalInstructions.textContent = drink.strInstructions;

            
            modalIngredients.innerHTML = ''; 
            for (let i = 1; i <= 15; i++) {
                const ingredient = drink[`strIngredient${i}`];
                const measure = drink[`strMeasure${i}`];
                if (ingredient) {
                    const li = document.createElement('li');
                    li.textContent = `${measure ? measure : ''} ${ingredient}`;
                    modalIngredients.appendChild(li);
                }
            }

            
            popupModal.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error fetching drink details:', error);
    }
}


closeBtn.addEventListener('click', () => popupModal.style.display = 'none');
popupModal.addEventListener('click', (event) => {
    if (event.target === popupModal) popupModal.style.display = 'none';
});


fetchData('Cocktail');
