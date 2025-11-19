const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Welcome page
app.get('/', (req, res) => {
  res.render('welcome');
});

// Show random cocktail
app.get('/cocktail', async (req, res) => {
  try {
    const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const drink = response.data.drinks[0];

    // Extract ingredients
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`);
      }
    }

    res.render('cocktail', {
      name: drink.strDrink,
      image: drink.strDrinkThumb,
      instructions: drink.strInstructions,
      ingredients
    });

  } catch (error) {
    console.error('Error fetching cocktail:', error);
    res.status(500).send('Failed to load cocktail');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
