import View from './View.js';
import icons from 'url:../../img/icons.svg'

class addRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded!'
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    //Child Class

    constructor() {
        super(); //Since this is a child class, Super need to be called. Only after that we can use the this keyword
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    //Listen for clicking events of the button. The conttroller has nothing to pass here. This function is just displaying the window. This function can be called as soon as the object is created. 

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }


    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this))  //this keyword inside of a handler function such as event listener points to the element on which the listener is attached to. In this case _btnopen. Hence we use bind method. Now this keyword will point to the correct object.
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this)); // Even if clicked outside the form the form has to close. Hence we select overlay 
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            //To get values from the form, we can select each property one by one and get the data. However there is actually a easier way, We can use something called form data which is a pretty modern browser api . this keyword points to the form. (parent element) 
            //Create a new form
            const dataArr = [...new FormData(this)]; //This will return a object we cannot use. so we spread the object into an array. This will give all the fields with all the values in there.
            //This data need to be eventually uploaded to an API. It is going to be an API call. API calls happen in the model. We need a way of getting this data to the model. So we create a controller function which will be the handler of this event.
            const data = Object.fromEntries(dataArr); //fromentries takes an array of entries and converts to an object
            handler(data);
        })
    }


}



export default new addRecipeView();