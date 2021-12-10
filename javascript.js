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
  let innerText = $(drinkGroup).find('button.pure-button-primary').attr('id');

  // this api call only gets title,id and image
  let response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${innerText}`
  );

  let data = await response.json();

  // chooseing one random drink from the list

  let drink = data.drinks[Math.floor(Math.random() * data.drinks.length)];

  // desctructuring the object so i can rename

  const { strDrink: title, strDrinkThumb: image, idDrink } = drink;

  let secondResponse = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`
  );
  let secondData = await secondResponse.json();

  const { strInstructions: instruct } = secondData.drinks[0];

  // they define the ingredients weird so i have to do this to get what i need

  let contents = [];

  for (let i = 1; i <= 15; i++) {
    /// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
    /// eval allows me to go  through 1-15 without having to manually write each
    const ingredient = eval(`secondData.drinks[0].strIngredient${i}`);
    const measurement = eval(`secondData.drinks[0].strMeasure${i}`);
    // if the ingr and measr exists it will push them to array
    if (ingredient && measurement) {
      contents.push(`${measurement} ${ingredient}`);
    }
    // if the measr dont exist but ingre push ingre
    // example salt to taste
    if (!measurement && ingredient) {
      contents.push(ingredient);
    }
  }

  postDrink(title, image, instruct, contents);
};

const postDrink = function (title, image, instruct, contents) {
  drinkTitle.html(title);
  drinkImage.attr('src', image);
  drinkDescription.html(instruct);
  //  gets ride of previous contents
  drinkIngredients.empty();
  for (let i = 0; i < contents.length; i++) {
    //   https://www.tutorialrepublic.com/faq/how-to-add-li-in-an-existing-ul-using-jquery.php
    // this added lis as children to the existing ul
    drinkIngredients.append(`<li>${contents[i]}</li>`);
  }
};

