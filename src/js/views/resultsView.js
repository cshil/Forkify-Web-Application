import View from './View.js'
import icons from 'url:../../img/icons.svg'

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query!'
  _message = '';


  _generateMarkup() {
    console.log(this._data); //The controller provides data to View. Since View is parent and inherited here by resultsView, We can see the data by logging. This is an array which we map over it and call _generateMarkupPreview and pass each element from map as the result and return it as a string by using join method
    return this._data.map(this._generateMarkupPreview).join('');

  }

  _generateMarkupPreview(result) {
    //const id = window.location.hash.slice(1);//To get the ID from the URL

    return `
        <li class="preview">
          <a class="preview__link" href="#${result.id}">
    <figure class="preview__fig">
      <img src="${result.image}" alt="${result.title}" />
              </figure >
  <div class="preview__data">
    <h4 class="preview__title">${result.title}</h4>
    <p class="preview__publisher">${result.publisher}</p>
  </div>
            </a >
          </li >
  `;
  }
}

//By creating a new instance and exporting it, there can only be one instance, in this case resultsView, And in the controller it can be imported without having to create an instance manually. Else you would have to create an instance in the controller.
export default new ResultsView();