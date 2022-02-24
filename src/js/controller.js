import * as model from './model.js' //Import everything from model.js. So it will be model.state, model.loadRecipe. model can be any name
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js' //recipeView can be any name
import searchView from './views/searchView.js';
import resultView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//Code from parcel, to stop the page from reloading

//if (module.hot) {
//  module.hot.accept();
//}

//////////////////////////////////////////////////////
const controlRecipes = async function () {
  try {
    //Get the hash

    const id = window.location.hash.slice(1); //window.location gives the entire url
    if (!id) return; //Will exit out of the function
    recipeView.renderSpinner();

    //0. Update results View to mark selected search result

    bookmarksView.update(model.state.bookmarks);

    //1. Loading the Recipe - async function returns a promise. So we need to await the promise before we move on to next step
    await model.loadRecipe(id);

    //2. Rendering the recipe

    recipeView.render(model.state.recipe);//. model.state.recipe is received from step 1 and passed to the render method. This    recipeContainer.insertAdjacentHTML('afterbegin', markup);*/
  }
  catch (err) {
    //Error need to be handled by view. The model can interact only with controller. The model throws the error to be caught at the controller
    recipeView.renderError();
  }
}

//async function will be called(Loadsearch results), Hence the calling function also has to be async function
const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    //1. Get search results
    const query = searchView.getQuery();
    if (!query) return;
    //2. Load search results
    await model.loadSearchResults(query);
    //3. Render results
    //resultView.render(model.state.search.results);
    resultView.render(model.searchResultsPage()); //Passing nothing takes the default value of 1
    //4. Render Initial pagination buttons 
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

//A new controller that gets executed when a click happens in the paginationView. This will act as subscriber function which will be called from the publisher in the paginationView

const controlPagination = function (goToPage) {
  //1. Render NEW results
  //resultView.render(model.state.search.results);
  resultView.render(model.searchResultsPage(goToPage));
  //2. Render NEW  pagination buttons 
  paginationView.render(model.state.search);

}

//This function will be executed when user clicks on update servings
const controlServings = function (newServings) {
  //Update the recipe servings (in state). Manipulation of data will be done in the model
  model.updateServings(newServings);

  //Update the recipe view
  //recipeView.render(model.state.recipe); //Render the entire page
  recipeView.update(model.state.recipe);//Render only the changing elements

}

//Controller of adding a new bookmark

const controlAddBookmark = function () {
  //1. Add/Remove a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id);

  //2. Update recipe view
  recipeView.update(model.state.recipe);

  //3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}


const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner

    //addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe); // upload recipe is an async function that returns a promise. The promise need to be awaited here. await cannot be used alone. It has to be used along with async
    console.log(model.state.recipe);

    // Render recipe

    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage(); //Display the success message and after few milliseconds the window will toggle per next function

    //Render bookMark view

    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL - For this we can use history API of the browsers. Pushstate will change the URL without reloading the page. Pushstate takes 3 arguments - state(doesnt matter can specify null), title, URL

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window

    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000) //*1000 to convert to milliseconds
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}



//This will act as subscriber and pass the handling function(control recipe) to the publisher.
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);


}
init();

