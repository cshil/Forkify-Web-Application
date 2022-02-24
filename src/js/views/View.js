import icons from 'url:../../img/icons.svg'

//Exporting the entire class itself. There is no instance created. We will only use it as parent class of the other child views. The entire private and public methods can be exported
export default class View {
  _data;
  //Public method that the controller can call to provide the data

  //data is model.state.recipe
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError(); //isArray is an helper function in Array constructor
    this._data = data;
    const markup = this._generateMarkup(); //calling the generateMarkup method
    //Removing existing markup
    this._clear();
    //Insert into DOM
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError(); //isArray is an helper function in Array constructor
    this._data = data;
    const newMarkup = this._generateMarkup(); //This will output a markup string. 
    const newDOM = document.createRange().createContextualFragment(newMarkup);//To convert markup string to  DOM objects in memory . This methods give DOM that lives in our memory. We can use the DOM as if it was a real DOM on the page
    const newElements = Array.from(newDOM.querySelectorAll('*'));//Create a real array from the nodelist to check the changed element
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));//Create a real array from the nodelist of the entire parent element on the page


    //Compare both new and cur Elements to detect the changes. Loop over the two arrays at the same time and for that we need the index

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //console.log(curEl, newEl.isEqualNode(curEl));//isEqualNode will compare each node from curEl to newEl and shows if anything has been changed via true or false
      //The child node contains the text. the element is just the element node. nodevalue is a type of attribute in the DOM nodes which returns a value if there is a text content. Will not work for figures or any other stuff. Refer MDN for nodevalue. Trim removes any whitespaces

      //Updates Changed text
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') { //Optional chaining to make sure the firstchild exists
        curEl.textContent = newEl.textContent;
      }
      //Updates Changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) { //Attributes property on node will return an object on all the attributes that have changed. The object will then be converted to an array using array.from
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value)) //Get the name and value from the newEl and set it into the curEl
      }
    })

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
}