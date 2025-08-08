/*
 * Script for the Food Sharing page. This file handles storing and retrieving
 * meals from the browser's localStorage. It allows users to add a new meal
 * with a name and description, and displays the list of shared meals.
 */

// Wait for the DOM to load before attaching event handlers
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('mealForm');
  const mealListContainer = document.getElementById('mealList');

  /**
   * Retrieve the list of meals from localStorage. If none exist, return
   * an empty array.
   * @returns {Array<Object>} Array of meal objects with `name` and `description`
   */
  function getMeals() {
    const stored = localStorage.getItem('sharedMeals');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Persist the list of meals to localStorage.
   * @param {Array<Object>} meals - Array of meal objects
   */
  function saveMeals(meals) {
    localStorage.setItem('sharedMeals', JSON.stringify(meals));
  }

  /**
   * Render the list of meals into the DOM.
   */
  function renderMeals() {
    const meals = getMeals();
    // Clear existing list
    mealListContainer.innerHTML = '';
    if (meals.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'No meals shared yet. Be the first to share a meal!';
      empty.style.color = '#666';
      mealListContainer.appendChild(empty);
      return;
    }
    meals.forEach(meal => {
      const item = document.createElement('div');
      item.className = 'meal-item';
      const title = document.createElement('h4');
      title.textContent = meal.name;
      const desc = document.createElement('p');
      desc.textContent = meal.description;
      item.appendChild(title);
      item.appendChild(desc);
      mealListContainer.appendChild(item);
    });
  }

  // Handle form submission
  form.addEventListener('submit', event => {
    event.preventDefault();
    const nameInput = document.getElementById('mealName');
    const descInput = document.getElementById('mealDescription');
    const name = nameInput.value.trim();
    const description = descInput.value.trim();
    if (!name || !description) {
      alert('Please provide both a name and a description for the meal.');
      return;
    }
    const meals = getMeals();
    meals.push({ name, description });
    saveMeals(meals);
    nameInput.value = '';
    descInput.value = '';
    renderMeals();
  });

  // Initial render
  renderMeals();
});
