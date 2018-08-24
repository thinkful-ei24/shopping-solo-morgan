const STATE = {
  items: [
    {name: "apples", checked: false},
    {name: "oranges", checked: false},
    {name: "milk", checked: true},
    {name: "bread", checked: false}
  ]
};

const generateListItemHTML = function(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
};

const renderShoppingList = function() {
  // Iterate through our state object and generate HTML
  let items = STATE.items.map(generateListItemHTML).join('');
  $('.js-shopping-list').html(items);
};

const shoppingListeners = {
  helpers: {
    fetchItemIndex: function(listItemNode) {
      return $(listItemNode).closest('li').data('itemIndex');
    }
  },
  // handleUserInput
  handleUserInput: function(e) {    
    // fetch user input
    e.preventDefault();
    const userInputField = $('.js-shopping-list-entry');
    const userInput = userInputField.val();
    userInputField.val('');
    // push input to database
    STATE.items.push({ name: userInput, checked: false });
    // render new state
    renderShoppingList();
  },
  handleItemCheckedState: function(e) {
    // Grab item index from the DOM
    let itemIndex = this.helpers.fetchItemIndex(e.currentTarget);
    // Toggle item's checked state
    STATE.items[itemIndex].checked = !STATE.items[itemIndex].checked;
    // Render new view
    renderShoppingList();
  },
  handleItemDelete: function(e) {
    // Grab item index from the DOM
    let itemIndex = this.helpers.fetchItemIndex(e.currentTarget);
    // Delete item from database
    delete STATE.items[itemIndex];
    // Render new view
    renderShoppingList();
  }
};


const bindShoppingListeners = function() {
  // handleUserInput
  $('#js-shopping-list-form').on('submit', shoppingListeners.handleUserInput);
  // handleItemCheckedState
  $('.js-shopping-list').on('click', '.js-item-toggle',shoppingListeners.handleItemCheckedState);
  // handleItemDelete
  $('.js-shopping-list').on('click', '.js-item-delete',shoppingListeners.handleItemDelete);
};

// Users should be able to:
    // Add an item to the shopping list
    // Check an item on the shopping list
    // Remove an item from the shopping list
function handleShoppingList() {
  renderShoppingList();
  bindShoppingListeners();
}

$(handleShoppingList);