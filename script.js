/*
 * Script for the Food Sharing page. This file handles storing and retrieving
 * meals from the browser's localStorage. It allows users to add a new meal
 * with a name and description, and displays the list of shared meals.
 */

// Wait for the DOM to load before attaching event handlers
document.addEventListener('DOMContentLoaded', () => {
  // Food sharing functionality should only run on the food page. Safely
  // reference the form and meal list; if they aren't present, skip these
  // handlers.
  const form = document.getElementById('mealForm');
  const mealListContainer = document.getElementById('mealList');

  // Functions to manage shared meals in localStorage
  function getMeals() {
    const stored = localStorage.getItem('sharedMeals');
    return stored ? JSON.parse(stored) : [];
  }

  function saveMeals(meals) {
    localStorage.setItem('sharedMeals', JSON.stringify(meals));
  }

  function renderMeals() {
    const meals = getMeals();
    // If the mealListContainer doesn't exist (i.e. not the food page), exit early
    if (!mealListContainer) return;
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

  // Attach event handler only if form exists (food page)
  if (form) {
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
    // Render existing meals when loading the food page
    renderMeals();
  }

  /*
   * News loading functionality
   * Fetches RSS feeds via the rss2json API and renders the latest items
   * for each section. Each page includes a UL element with an ID
   * corresponding to the category (e.g. 'health-news', 'food-news', etc.).
   */
  async function loadNews(category) {
    let feedUrl;
    switch (category) {
      case 'health':
        feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sciencedaily.com/rss/top/health.xml';
        break;
      case 'food':
        feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sciencedaily.com/rss/health_medicine/nutrition.xml';
        break;
      case 'fitness':
        feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sciencedaily.com/rss/health_medicine/fitness.xml';
        break;
      case 'sports':
        feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.sciencedaily.com/rss/health_medicine/sports_medicine.xml';
        break;
      default:
        return;
    }
    try {
      const response = await fetch(feedUrl);
      const data = await response.json();
      const listId = `${category}-news`;
      const container = document.getElementById(listId);
      if (!container || !data.items) return;
      // Clear current items
      container.innerHTML = '';
      // Show up to 3 latest articles with descriptions
      data.items.slice(0, 3).forEach(item => {
        const li = document.createElement('li');
        // Title element
        const titleEl = document.createElement('strong');
        titleEl.textContent = item.title;
        li.appendChild(titleEl);
        // Extract plain text from description or content
        const tmp = document.createElement('div');
        tmp.innerHTML = item.description || item.content || item.contentSnippet || '';
        const descEl = document.createElement('p');
        descEl.textContent = tmp.textContent || '';
        li.appendChild(descEl);
        container.appendChild(li);
      });
    } catch (err) {
      console.error('Failed to load news feed:', err);
    }
  }

  // Determine which news sections exist on the current page and load them
  if (document.getElementById('health-news')) {
    loadNews('health');
  }
  if (document.getElementById('food-news')) {
    loadNews('food');
  }
  if (document.getElementById('fitness-news')) {
    loadNews('fitness');
  }
  if (document.getElementById('sports-news')) {
    loadNews('sports');
  }
});
