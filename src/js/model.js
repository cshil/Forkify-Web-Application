import { API_URL, RES_PER_PAGE, KEY } from './config.js'
import { getJSON, sendJSON } from './helpers.js'

//State contains all the data that we need to build our application
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
}

const createRecipeObject = function (data) {
    const { recipe } = data.data;

    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }), // Remember the && operator shortcircuits. If recipe.key doesnt exist(falsy value), nothing happens, destructuring does nothing. if recipe.key is some value, then the second part is executed and returned, key: recipe.key object is returned. The whole expression becomes that object. And then we can spread that object, to basically to put the values as  key:recipe.key
    };
}

//Load recipe function doesnt return any data, it just updates the state object. Controller will pull from state object. There is a live connection between all imports and exports
export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}${id}?key=${KEY}`) //async function returns a promise
        state.recipe = createRecipeObject(data);

        //const res = await fetch(`${API_URL}/${id}`);
        //const data = await res.json();
        //console.log(data);
        //if (!res.ok) throw new Error(`${data.message} (${res.status})`)


        if (state.bookmarks.some(bookmark => bookmark.id === id)) //Some loops over all elements and returns true or false
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

    } catch (err) {
        //TEMP Error handling
        console.error(`${err} customized error`)
        //Error need to be handled by view. The model can interact only with controller. The error needs to be thrown to be caught by the controller
        throw err;
    }
}

//Search functionality - Controller tells the model what it should search for

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
        console.log(data);
        //data.data.recipes is the array of all the objects, and we want to create a new array with the new object where the property names are different
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,

            }
        });
        state.search.page = 1;

    } catch (err) {
        console.error(`${err} customized error`);
        throw err;
    }

}

//Render results in a page. This will not be an async function since we have already got the results populated. We just need to render them on the page

export const searchResultsPage = function (page = state.search.page) { // If we dont pass anything to the page, then it becomes default of 1
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage; //0; //If its second page, 1-1=0 , 0*10 = 0
    const end = page * state.search.resultsPerPage; //9; // 1*10 =10. Slice doesnt extract the last value, hence it extracts till 9
    return state.search.results.slice(start, end);
}

export const updateServings = function (newServings) {
    //Mutate the quantity. Hence we use foreach. We dont want a new array
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings; // Formula:  newqt = oldqt * newServings / oldServings (Example: 2 * 8 / 4 = 4)
    });
    state.recipe.servings = newServings;

}

//Persist bookmarks in local storage

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); // Give the item a name called bookmarks and specify the object that you want to convert to a string
}


//Export the function to be used from the controller

export const addBookmark = function (recipe) {
    //Add Bookmark
    state.bookmarks.push(recipe);

    //Mark current recipe as bookmark, this will allow us to display current recipe as bookmarked from the recipeView

    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();

}

//When we add something, we get the entire data and when we delete something we only get the id.
export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(el => el.id === id); //If the bookmark ID is similar to id that is passed, an index will be returned and we can take that index and delete it from the array in the next line. 1 specifies the number of items to be deleted
    state.bookmarks.splice(index, 1);

    //Mark current recipe as not a bookmark, this will allow us to display current recipe as not bookmarked from the recipeView

    if (id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();

}

//We call this function right in the beginning
const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage); //Parse - Convert string back to object
}
init();

const clearBookmarks = function () {
    localStorage.clear('bookmarks');
}
//clearBookmarks();

//Uploading a new recipe

export const uploadRecipe = async function (newRecipe) {
    //Take the ingredients out and put them into an object.

    //1. Create an array of ingredients. Can use map method. MAP is good to create new arrays based on some existing data. Convert the newRecipe object back to an array, and filter the array (We want only the property that contains ing1, ing2 , ing3 etc) and take the data out of the ingredient string and put that into a new array, for which we use map method and then return the object.
    //console.log(Object.entries(newRecipe));

    try {
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {
            //const ingArr = ing[1].replaceAll(' ', '').split(','); //Remove whitespaces and Destructure
            const ingArr = ing[1].split(',').map(el => el.trim()); //Remove whitespaces and Destructure
            if (ingArr.length != 3) throw new Error('Wrong ingredient format! Please use the correct format :)') //This is an async function, Hence it returns a promise. This line rejects the promise that need to be handled
            const [quantity, unit, description] = ingArr;
            return { quantity: quantity ? +quantity : null, unit, description }   // Return an object within an array created by map
        })
        //Upload the recipe object to the API

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }

        const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe) //The recipe will be sent back to us, so store that as data and also await it
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    }
    catch (err) {
        throw err;
    }
}


