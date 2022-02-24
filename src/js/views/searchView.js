class SearchView {
    _parentEl = document.querySelector('.search');
    getQuery() {
        const query = this._parentEl.querySelector('.search__field').value
        this._clearInput();
        return query;
    }

    _clearInput() {
        this._parentEl.querySelector('.search__field').value = '';
    }
    //Publisher
    addHandlerSearch(handler) {
        //Submit works even if user clicks "enter" on the keyboard or clicks on the submit button while typing the query
        this._parentEl.addEventListener('submit', function (e) {
            e.preventDefault();
            handler(); // The handler function should be the controlSearchResults function
        })
    }
}

//Export an instance or the object created by this class. 

export default new SearchView();