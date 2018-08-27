// POSSIBLE STATES:
  // `all`: display all items
  // `checked`/: display checked only
  // `unchecked`: display unchecked only
  // `search`: filtered by search term
  // `checkedSearch`: search through unchecked items
  // `uncheckedSearch`: search through checked items

// POSSIBLE ACTIONS:
  // Add/Remove/Edit list item
  // Show all items
  // Filter by checked items only
  // Filter by unchecked items only
  // Search term

const STORE = {
  items: [
    {name: "apples", completed: false},
    {name: "oranges", completed: false},
    {name: "milk", completed: true},
    {name: "bread", completed: false}
  ],
  state: 'all',
  currentSearch: null
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

const renderShoppingList = function() {
  renderDisplayToggler();
  renderListItems();
};

const renderListItems = function() {
  let items = STORE.items;
  let list = $('.js-shopping-list');
  switch(STORE.state) {
    case 'all':
      items = items.map(generateListItemHTML).join('');
      list.html(items);
      break;
    case 'active':
      items = 
        items
          .filter(item => item.completed === false)
          .map(generateListItemHTML)
          .join('');
      list.html(items);
      break;
    case 'completed':
      items = 
        items
          .filter(item => item.completed === true)
          .map(generateListItemHTML)
          .join('');
      list.html(items);
      break;
    case 'search':
      items = 
      items
        .filter(item => item.name.includes(STORE.currentSearch))
        .map(generateListItemHTML)
        .join('');
      list.html(items);
      break;
    case 'activeSearch':
      items = 
      items
        .filter(item => item.completed === false && item.name.includes(STORE.currentSearch))
        .map(generateListItemHTML)
        .join('');
    list.html(items);
    break;
    case 'completedSearch':
      items = 
      items
        .filter(item => item.completed === true && item.name.includes(STORE.currentSearch))
        .map(generateListItemHTML)
        .join('');
      list.html(items);
      break;
  }
};

const renderDisplayToggler = function() {
  let radioButtons = $('.js-filter-radio');
  // Uncheck all radio buttons
  $(radioButtons).prop('checked', false);
  // Set the correct radio state
  switch(STORE.state) {
    case 'all':
    case 'search':
      $(radioButtons).filter('#js-filter-all').prop('checked', true);
      break;
    case 'active':
    case 'activeSearch':
      $(radioButtons).filter('#js-filter-active').prop('checked', true);
      break;
    case 'completed':
    case 'completedSearch':
      $(radioButtons).filter('#js-filter-completed').prop('checked', true);
      break;
  }
};

const shoppingEventHelpers = {
  fetchItemIndex: function(listItemNode) {
    return $(listItemNode).closest('li').data('itemIndex');
  },
  fetchUserInput: function(userInputField) {
    const input = userInputField.val();
    userInputField.val('');
    return input;
  }
};

const listManipulationListeners = {
  handleAddItemInput: function(e) {   
    e.preventDefault(); 
    // fetch user input
    const userInputField = $('.js-shopping-list-entry');
    const userInput = shoppingEventHelpers.fetchUserInput(userInputField);
    // push input to database
    STORE.items.push({ name: userInput, completed: false });
    // render new state
    renderShoppingList();
  },

  handleItemCompletedToggle: function(e) {
    // Grab item index from the DOM
    let itemIndex = shoppingEventHelpers.fetchItemIndex(e.currentTarget);
    // Toggle item's completed state
    STORE.items[itemIndex].completed = !STORE.items[itemIndex].completed;
    // Render new view
    renderShoppingList();
  },

  handleItemDelete: function(e) {
    // Grab item index from the DOM
    let itemIndex = shoppingEventHelpers.fetchItemIndex(e.currentTarget);
    // Delete item from database
    delete STORE.items[itemIndex];
    // Render new view
    renderShoppingList();
  },
  // handleItemEdit: function(e) {},
};

const bindListManipulationListeners = function() {
  // handleAddItemInput
  $('#js-shopping-list-form').on('submit', listManipulationListeners.handleAddItemInput);
  // handleItemCompletedToggle
  $('.js-shopping-list').on('click', '.js-item-toggle',listManipulationListeners.handleItemCompletedToggle);
  // handleItemDelete
  $('.js-shopping-list').on('click', '.js-item-delete',listManipulationListeners.handleItemDelete);
  // handleItemEdit
  // $('.js-shopping-list').on('click', '.js-item-delete',listManipulationListeners.handleItemEdit);
};

const listFilteringListeners = {
  handleDisplayFilterToggle: function(e) {
    // Changes state based on the filter radio pressed 
    // and if there is a search underway
    switch(e.currentTarget.id) {
      case 'js-filter-all':
        if (STORE.currentSearch === null) STORE.state = 'all';
        else STORE.state = 'search';
        break;
      case 'js-filter-active':
        if (STORE.currentSearch === null) STORE.state = 'active';
        else STORE.state = 'searchActive';
        break;      
      case 'js-filter-completed':
        if (STORE.currentSearch === null) STORE.state = 'completed';
        else STORE.state = 'searchCompleted';
        break;      
    }
    // Renders shopping list with new state flag
    renderShoppingList();
  },

  // handleUserSearch: function(e) {
  //   // Grab user input
  //   e.preventDefault();
  //   let userInputField = $('.js-shopping-list-search');
  //   let userInput = shoppingEventHelpers.fetchUserInput(userInputField);
  //   // Store user input at STORE.currentSearch
  //   STORE.currentSearch = userInput;
  //   // Set the new state
  //   switch(STORE.state) {
  //     case 'all':
  //     case 'search':
  //       STORE.state = 'search';
  //       break;
  //     case 'active':
  //     case 'searchActive':
  //       STORE.state = 'searchActive';
  //       break;
  //     case 'completed':
  //     case 'searchCompleted':
  //       STORE.state = 'searchCompleted';
  //       break;
  //   }
  //   // render new view
  //   renderShoppingList();
  // }
};


const bindListFilteringListeners = function() {
  // handleDisplayFilterToggle
  $('#js-shopping-list-filter').on('click', '.js-filter-radio', listFilteringListeners.handleDisplayFilterToggle);
  // // handleUserSearch
  // $('#js-shopping-list-search').on('submit', listFilteringListeners.handleUserSearch);
};

const handleShoppingList = function() {
  renderShoppingList();
  bindListManipulationListeners();
  bindListFilteringListeners();
};

$(handleShoppingList());