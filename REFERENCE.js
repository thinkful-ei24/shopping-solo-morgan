const STORE = {
  items: [
    {name: "apples", completed: false},
    {name: "oranges", completed: false},
    {name: "milk", completed: true},
    {name: "bread", completed: false}
  ],
  state: 'all'
};

const generateListItemHTML = function(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.completed ? "shopping-item__completed" : ''}">${item.name}</span>
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

const generateCompletedDisplayHTML = function() {
  return `
    <input class="js-display-completed-items" type="checkbox" name="shopping-list-display-completed" ${STORE.displayCompleted ? 'checked' : ''}>
    <label for="shopping-list-display-completed">Display completed items</label>
  `;
};

const generateUncompletedListItemHTML = function(html, item, itemIndex) {
  if (item.completed === false) {
    html += `
      <li class="js-item-index-element" data-item-index="${itemIndex}">
        <span class="shopping-item js-shopping-item">${item.name}</span>
        <div class="shopping-item-controls">
          <button class="shopping-item-toggle js-item-toggle">
              <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
              <span class="button-label">delete</span>
          </button>
        </div>
      </li>`;
    }
    return html;
};

const generateSearchItemHTML = function(html, item, itemIndex) {

};


const renderShoppingList = function() {
  // Render display toggler
  $('#shopping-list-completed-toggler').html(generateCompletedDisplayHTML());
  // Render items
  let items = STORE.items;
  if (STORE.displayCompleted) {
    $('.js-shopping-list').html(items.map(generateListItemHTML).join(''));  
  }
  else {
    $('.js-shopping-list').html(items.reduce(generateUncompletedListItemHTML, ''));
  }
  
};

const shoppingListeners = {
  helpers: {
    fetchItemIndex: function(listItemNode) {
      return $(listItemNode).closest('li').data('itemIndex');
    },
    fetchUserInput: function(userInputField) {
      const input = userInputField.val();
      userInputField.val('');
      return input;
    }
  },
  // handleUserInput
  handleAddItemInput: function(e) {   
    e.preventDefault(); 
    // fetch user input
    const userInputField = $('.js-shopping-list-entry');
    const userInput = shoppingListeners.helpers.fetchUserInput(userInputField);
    // push input to database
    STORE.items.push({ name: userInput, completed: false });
    // render new state
    renderShoppingList();
  },

  handleItemCompletedState: function(e) {
    // Grab item index from the DOM
    let itemIndex = shoppingListeners.helpers.fetchItemIndex(e.currentTarget);
    // Toggle item's completed state
    STORE.items[itemIndex].completed = !STORE.items[itemIndex].completed;
    // Render new view
    renderShoppingList();
  },

  handleItemDelete: function(e) {
    // Grab item index from the DOM
    let itemIndex = shoppingListeners.helpers.fetchItemIndex(e.currentTarget);
    // Delete item from database
    delete STORE.items[itemIndex];
    // Render new view
    renderShoppingList();
  },

  handleItemEdit: function(e) {},

  handleCompletedDisplayToggle: function(e) {
    STORE.displayCompleted = STORE.displayCompleted ? false : true;
    renderShoppingList();
  },

  handleSearchInput: function(e) {
    e.preventDefault();
    // fetch user input
    const userInputField = $('.js-shopping-list-search');
    const userInput = shoppingListeners.helpers.fetchUserInput(userInputField);

  }
};


const bindShoppingListeners = function() {
  // handleAddItemInput
  $('#js-shopping-list-form').on('submit', shoppingListeners.handleAddItemInput);
  // handleItemCompletedState
  $('.js-shopping-list').on('click', '.js-item-toggle',shoppingListeners.handleItemCompletedState);
  // handleItemDelete
  $('.js-shopping-list').on('click', '.js-item-delete',shoppingListeners.handleItemDelete);
  // handleCompletedDisplayToggle
  $('#shopping-list-completed-toggler').on('change', '.js-display-completed-items', shoppingListeners.handleCompletedDisplayToggle);
  // handleItemEdit
  // $('.js-shopping-list').on('click', '.js-item-delete',shoppingListeners.handleItemEdit);
  // handleSearchInput
  $('#js-shopping-list-search').on('submit', shoppingListeners.handleSearchInput);
};

// Users should be able to:
    // Add an item to the shopping list
    // Check an item on the shopping list
    // Remove an item from the shopping list
// ------------------------------------------------------------------------
    // Press a switch/checkbox to toggle between displaying all items or displaying only items that are uncompleted
    // Type in a search term and the displayed list will be filtered by item names only containing that search term
    // Edit the title of an item

const handleShoppingList = function() {
  renderShoppingList();
  bindShoppingListeners();
};

$(handleShoppingList);