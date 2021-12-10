// global variables
const output = $("#output");
const drinkGroup = $('.drinkGroup');
const drinkImage = $('#drinkImage');
let localstorageStringArr = []; //add arr for localstorage search quries - D

drinkGroup.children().on('click', function (e) {
  e.preventDefault();

   for (let i = 0; i < drinkGroup.children().length; i++) {
    if (drinkGroup.children([i]).hasClass('pure-button-primary')) {
      drinkGroup.children([i]).removeClass('pure-button-primary');
    }
  }
  // if button isn't submit - D
  if($(this).attr("type") !== "submit"){
    return;
  }
  
  $(this).addClass('pure-button-primary');
  getDrink();
});

const getDrink = async function () {
  let innerText = $(drinkGroup).find('#search-drink').val();
  
  //if query is less than 1 - D
  if (innerText.length <= 1){
    modalPop();
    return;
  }

  // this api call only gets title,id and image 
  let response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${innerText}`
  )

  let data = await response.json();
  
  // chooseing one random drink from the list
  let drink = data.drinks[Math.floor(Math.random() * data.drinks.length)];

  // desctructuring the object so i can rename
  const { strDrink: title, strDrinkThumb: image, idDrink } = drink;

  let secondResponse = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`
  )

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
    // if the measurment does not exist but ingredients exist push ingredients
    // example salt to taste
    if (!measurement && ingredient) {
      contents.push(ingredient);
    }
  }
  postDrink(title, image, instruct, contents, innerText); // add inner text for local storage - D
};

const postDrink = function (title, image, instruct, contents, searchQuery) {
  let drinkDiv = $('<div class="drink-card">'); //Created a div - D
  let drinkImage = $('<img width="200px">');  //created a img - D
  let drinkUl = $('<ul>');    //created a Ul - D
  let drinkp = $('<p>'); //created a p - D

  drinkDiv.empty(); // empty div for new content -D
  
  //Title -D
  drinkDiv.append(`<h1>${title}</h1>`); 
 
  //Image -D
  drinkImage.attr('src', image); 
  drinkDiv.append(drinkImage);       
  
  //Instructions -D
  drinkp.append(instruct);
  drinkDiv.append(drinkp);

  //Ingredients
  for (let i = 0; i < contents.length; i++) {
    //   https://www.tutorialrepublic.com/faq/how-to-add-li-in-an-existing-ul-using-jquery.php
    // this added lis as children to the existing ul
    drinkUl.append(`<li>${contents[i]}</li>`);
  }
  
  drinkDiv.append(drinkUl);
  output.html(drinkDiv);

  //Add search query to local storage - D
  var Items = localStorage.getItem("food-drink-history");

  if(!Items){
    localstorageStringArr.push(searchQuery);
    localStorage.setItem("food-drink-history", JSON.stringify(localstorageStringArr));
  }else{
    localstorageStringArr.push(searchQuery);
    console.log(localstorageStringArr);
    localStorage.setItem("food-drink-history", JSON.stringify(localstorageStringArr));
  }
};

function modalPop(errorMsg){
  console.log("Modal Pop up")
}