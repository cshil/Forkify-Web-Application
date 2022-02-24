import View from './View.js'
import icons from 'url:../../img/icons.svg'

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  //Handling events using publisher-subscriber model. A publisher is a function listening for the event which receives a handler function from the controller, we listen for the events in the view, while at the same time to handle that event from the controller

  addHandlerClick(handler) {
    //Event delegation to parent element, as there will be two buttons and we dont want to listen to each button individually
    this._parentElement.addEventListener('click', function (e) {
      //We need to figure out which button was clicked before triggering the function, For that we use closest button near to the click. Query selector searches down in the tree, searches for children. Closest searches up in the tree, it looks for parents
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      if (!btn) return;
      //We can get the data attribute (goto) number from the button
      const goToPage = +btn.dataset.goto; //Convert to number from string
      handler(goToPage);
    })

  }

  _generateMarkup() {
    const curPage = this._data.page;
    //console.log(this._data.results);
    //console.log(this._data.resultsPerPage);
    const numPages = Math.ceil((this._data.results).length / this._data.resultsPerPage);


    //How will javascript know that it should display the results of the particular page (For example page 5). This is where we need to establish a connection between the DOM and our code. We can do that using the custom data attributes. We will create data attribute on each of the buttons which will contain the page that we want to go to. Then in our code we can read that data and make javascript go to that exact page.

    //Page 1, And there are other pages
    if (curPage === 1 && numPages > 1) { //data-goto is the custom data attribute
      return `<button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next"> 
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    //Last page
    if (curPage === numPages && numPages > 1) {
      return `<button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;
    }

    //Other page
    if (curPage < numPages) {
      return `<button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    //Page 1, And there are no other pages
    return ''; //No other pages, so we return nothing
  }
}

export default new PaginationView();