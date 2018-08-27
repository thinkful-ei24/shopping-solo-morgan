// POSSIBLE STATES:
  // `all`
  // `search`
  // `active`
  // `searchActive`
  // `completed`
  // `searchCompleted`

// POSSIBLE ACTIONS:
  // Add/Remove/Edit list item
  // Show all items
  // Filter by checked items only
  // Filter by unchecked items only
  // Search term

// switch(STORE.state) {
//   case 'all':
//   case 'search':
//   case 'active':
//   case 'searchActive':
//   case 'completed':
//   case 'searchCompleted':
// }



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


const renderShoppingList = function() {
  renderDisplayToggler();
  renderListItems();
};

const generateListItemHTML = function(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.completed ? "shopping-item__completed" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">Check</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
          <span class="button-label">Edit</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">Delete</span>
        </button>
      </div>
    </li>`;
};


const renderListItems = function() {
  let items = STORE.items;
  let list = $('.js-shopping-list');
  switch(STORE.state) {
    case 'all':
      items = items.map(generateListItemHTML).join('');
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
    case 'active':
      items = 
        items
          .filter(item => item.completed === false)
          .map(generateListItemHTML)
          .join('');
      list.html(items);
      break;
    case 'searchActive':
        items = 
        items
          .filter(item => item.completed === false && item.name.includes(STORE.currentSearch))
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
    case 'searchCompleted':
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
    case 'searchActive':
      $(radioButtons).filter('#js-filter-active').prop('checked', true);
      break;
    case 'completed':
    case 'searchCompleted':
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
  },
  renderItemEditForm: function(listItemNode, itemIndex) {
    // Grab elements necessary to construct form
    let itemTitleField = listItemNode.find('.js-shopping-item');
    let itemName = STORE.items[itemIndex].name;
    // Create form HTML
    let html = `
      <form id="js-shopping-list-edit-form">
        <input type="text" name="shopping-list-editor" class="js-shopping-list-edit" placeholder="${itemName}">
        <button type="submit">Save</button>
      </form>
    `;
    // Set 
    itemTitleField.html(html);
    $('.js-shopping-list-edit').val(itemName);
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
    // render new view
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
  handleItemEdit: function(e) {
    // Return back to normal list view if `edit` is pressed
    // again with form already displaying
    if ($('#js-shopping-list-edit-form').length > 0) renderShoppingList();

    let listItemParent = $(e.currentTarget).closest('li');
    let itemIndex = shoppingEventHelpers.fetchItemIndex(listItemParent);
    // Render the item edit form in place of the item name
    shoppingEventHelpers.renderItemEditForm(listItemParent, itemIndex);
    // Listen for form input
    $('#js-shopping-list-edit-form').submit(e => {
      // Grab user input
      e.preventDefault();
      let userInput = shoppingEventHelpers.fetchUserInput($('.js-shopping-list-edit'));
      // Modify the item's name in STORE
      STORE.items[itemIndex].name = userInput;
      // Render new view
      renderShoppingList();
    });
  }
};

const bindListManipulationListeners = function() {
  // handleAddItemInput
  $('#js-shopping-list-form').on('submit', listManipulationListeners.handleAddItemInput);
  // handleItemCompletedToggle
  $('.js-shopping-list').on('click', '.js-item-toggle',listManipulationListeners.handleItemCompletedToggle);
  // handleItemDelete
  $('.js-shopping-list').on('click', '.js-item-delete',listManipulationListeners.handleItemDelete);
  // handleItemEdit
  $('.js-shopping-list').on('click', '.js-item-edit',listManipulationListeners.handleItemEdit);
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

  handleSearchInput: function(e) {
    // Grab user input
    e.preventDefault();
    const inputField = $('.js-shopping-list-search');
    const userInput = shoppingEventHelpers.fetchUserInput(inputField);
    // Store search input in STATE.currentSearch
    STORE.currentSearch = userInput;
    // Set the correct state
    if (userInput === '') return listFilteringListeners.handleClearSearchButton();
    switch(STORE.state) {
      case 'all':
      case 'search':
        STORE.state = 'search';
        break;
      case 'active':
      case 'searchActive':
        STORE.state = 'searchActive';
        break;
      case 'completed':
      case 'searchCompleted':
        STORE.state = 'searchCompleted';
        break;
    }
    // Render new view
    $('.js-clear-search').removeClass('hidden');
    renderShoppingList();
  },

  handleClearSearchButton: function() {
    const clearSearchButton = $('.js-clear-search');
    // hide search button
    $(clearSearchButton).addClass('hidden');
    // remove the search from the state
    STORE.currentSearch = null;
    // set the state to a new, searchless state
    switch(STORE.state) {
      case 'all':
      case 'search':
        STORE.state = 'all';
        break;
      case 'active':
      case 'searchActive':
        STORE.state = 'active';
        break;
      case 'completed':
      case 'searchCompleted':
        STORE.state = 'completed';
        break;
    }
    // render new view
    renderShoppingList();
  }
};


const bindListFilteringListeners = function() {
  // handleDisplayFilterToggle
  $('#js-shopping-list-filter').on('click', '.js-filter-radio', listFilteringListeners.handleDisplayFilterToggle);
  // handleSearchInput
  $('#js-shopping-list-search').on('submit',listFilteringListeners.handleSearchInput);
  // handleClearSearchButton
  $('#js-shopping-list-search').on('click', '.js-clear-search', listFilteringListeners.handleClearSearchButton);
};

const handleShoppingList = function() {
  renderShoppingList();
  bindListManipulationListeners();
  bindListFilteringListeners();
};

$(handleShoppingList());