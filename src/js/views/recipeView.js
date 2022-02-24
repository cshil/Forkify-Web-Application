import View from './View.js'

import icons from 'url:../../img/icons.svg' //The src folder which contains the image that we have included in the template literal is not available in dist folder , Hence we are importing it 
import { Fraction } from 'fractional';

//Child class inherits or extends from parent class
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find the recipe. Please try another one!'
  _message = '';

  /*
  _data;
  //Public method that the controller can call to provide the data

  //data is model.state.recipe
  render(data) {
    this._data = data;
    const markup = this._generateMarkup(); //calling the generateMarkup method
    //Removing existing markup
    this._clear();
    //Insert into DOM
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `<div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`
    this.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
    <svg>
      <use href="${icons}#icon-alert-triangle"></use>
    </svg>
  </div>
  <p>${message}</p>
</div>`
    this._clear(); //Clear existing markup
    this._parentElement.insertAdjacentHTML('afterbegin', markup);//Add the new markup
  }

  renderMessage(message = this._message) {
    const markup = `<div class="message">
    <div>
    <svg>
      <use href="${icons}#icon-smile"></use>
    </svg>
  </div>
  <p>${message}</p>
</div>`
    this._clear(); //Clear existing markup
    this._parentElement.insertAdjacentHTML('afterbegin', markup);//Add the new markup
  }
*/
  //publisher method - Events have to be listened in the view, and handled in the controller. Howerver the view doesnt know about controller and cannot import controller or the model. It is the other way around. Hence we use publisher subscriber model, where the method below acts a publisher and receives the function that handled the event as an input, which is the subscriber, and whenever the event occurs, the function is executed. This is not the same as directly calling the function. 

  addHandlerRender(handler) {
    //To run multiple events for a same function

    const array1 = ['hashchange', 'load']
    array1.forEach(ev => window.addEventListener(ev, handler))

    //window.addEventListener('hashchange', controlRecipes);
    //window.addEventListener('load', controlRecipes);
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      console.log(btn);
      const updateTo = +btn.dataset.updateTo; //When there is a - in the dataset property, that will be converted to the camelCase notation
      if (updateTo > 0) handler(updateTo);
    });
  }

  //Calling the function in the controller

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();

    })
  }

  //Private methods cannot be called outside the class
  _generateMarkup() {
    return `<figure class="recipe__fig">
    <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this._data.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>

    <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
                <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
    </div>

        <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
      </svg>
    </button>
  </div>

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
    ${this._data.ingredients.map(this._generateMarkupIngredient).join('')};
    </ul>
  </div>

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._data.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>`;

  }

  _generateMarkupIngredient(ing) {
    return `<li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${ing.quantity ? new Fraction(ing.quantity).toString() : ''}</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ing.unit}</span>
      ${ing.description}
    </div>
  </li>`;
  }
}

//Create a object and export it, instead of exporting the entire class.

export default new RecipeView();