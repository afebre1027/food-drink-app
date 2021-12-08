// global variables
const drinkIngredients = $('.drinkIngredients');
const drinkDescription = $('#drinkDescription');
const drinkTitle = $('#drinkTitle');
const drinkGroup = $('.drinkGroup');
const drinkImage = $('#drinkImage');

drinkGroup.children().on('click', function () {
  for (let i = 0; i < drinkGroup.children().length; i++) {
    if (drinkGroup.children([i]).hasClass('pure-button-primary')) {
      drinkGroup.children([i]).removeClass('pure-button-primary');
    }
  }
  $(this).addClass('pure-button-primary');
  getDrink();
});

const getDrink = async function () {
  let innerText;
  if (drinkGroup.find('button.pure-button-primary')) {
    innerText = $(drinkGroup).find('button.pure-button-primary').attr('id');
    console.log(innerText);
  }
  let response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${innerText}`
  );

  let data = await response.json();
  let drink = data.drinks[Math.floor(Math.random() * data.drinks.length)];
  const { strDrink: title, strDrinkThumb: image } = drink;
  console.log(title);
  postDrink(title, image);
};

const postDrink = function (title, image) {
  drinkTitle.html(title);
  drinkImage.attr('src', image);
};
