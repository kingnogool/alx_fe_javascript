// --- Global Variables ---
let quotes = []; // All quotes (local)
let filteredQuotes = []; // Quotes currently displayed based on filter
let currentCategoryFilter = 'all'; // Current category filter setting

const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock server endpoint
const SYNC_INTERVAL_MS = 5000; // Sync every 5 seconds (for demonstration)

// --- Web Storage Functions ---

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes if no quotes are in local storage AND no server data yet
    quotes = [
      { id: 'local-1', text: "The only way to do great work is to love what you do.", category: "Inspiration" },
      { id: 'local-2', text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
      { id: 'local-3', text: "Strive not to be a success, but rather to be of value.", category: "Inspiration" },
      { id: 'local-4', text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { id: 'local-5', text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
    ];
    saveQuotes(); // Save defaults if starting fresh
  }
}

// --- DOM Manipulation & Display Functions ---

function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const quotesToDisplay = filteredQuotes.length > 0 ? filteredQuotes : quotes;

  if (quotesToDisplay.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available for the selected category. Add some or change filter!</p>`;
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotesToDisplay.length);
  const randomQuote = quotesToDisplay[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <span>- ${randomQuote.category}</span>
  `;
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  // Map quotes to their categories, filter out null/empty, then get unique values
  const uniqueCategories = ['all', ...new Set(quotes.map(quote => quote.category).filter(Boolean))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.forEach(category => {
    if (category !== 'all') { // Don't add 'all' again
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    }
  });
  categoryFilter.value = currentCategoryFilter; // Set dropdown to current filter
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  currentCategoryFilter = selectedCategory;
  localStorage.setItem('lastCategoryFilter', selectedCategory);

  if (selectedCategory === 'all') {
    filteredQuotes = [...quotes];
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }
  showRandomQuote();
}

// --- Quote Management Functions (Local) ---

function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim(); // Trim whitespace
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim(); // Trim whitespace

  if (newQuoteText && newQuoteCategory) {
    // Generate a temporary local ID for new quotes before syncing with server
    const newQuote = {
      id: `local-${Date.now()}`, // Simple local ID
      text: newQuoteText,
      category: newQuoteCategory
    };
    quotes.push(newQuote);
    saveQuotes(); // Save to local storage

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    populateCategories();
    filterQuotes();
    showRandomQuote();
    alert('Quote added successfully locally! Will attempt to sync with server.');

    postQuoteToServer(newQuote); // Attempt to post
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// --- JSON Import/Export Functions ---

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes) && importedQuotes.every(q => typeof q === 'object' && q.text && q.category)) {
        const quotesToAdd = importedQuotes.map(q => ({
            id: q.id || `local-${Date.now()}-${Math.random().toString(36).substring(7)}`, // Assign ID if missing
            text: q.text,
            category: q.category
        }));
        
        quotesToAdd.forEach(newQuote => {
            const existingIndex = quotes.findIndex(q => q.id === newQuote.id);
            if (existingIndex > -1) {
                quotes[existingIndex] = newQuote; // Update existing
            } else {
                quotes.push(newQuote); // Add new
            }
        });

        saveQuotes();
        populateCategories();
        filterQuotes();
        showRandomQuote();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON file format. Please ensure it contains an array of quote objects with "text" and "category" properties.');
      }
    } catch (e) {
      alert('Error parsing JSON file: ' + e.message);
    }
  };
  if (event.target.files.length > 0) {
    fileReader.readAsText(event.target.files[0]);
  } else {
    alert('No file selected for import.');
  }
}

// --- Server Sync Functions ---

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const serverPosts = await response.json();
    const serverQuotes = serverPosts.map(post => ({
      id: `server-${post.id}`,
      text: post.title,
      category: post.body ? post.body.substring(0, 50) : 'General' // Ensure body exists before substring
    }));
    return serverQuotes;
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
    return [];
  }
}

async function postQuoteToServer(quote) {
    try {
        const serverPayload = {
            title: quote.text,
            body: quote.category,
            userId: 1 // Example user ID
        };
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serverPayload),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log("Quote posted to server (mock):", responseData);
        
        const localIndex = quotes.findIndex(q => q.id === quote.id);
        if (localIndex > -1) {
            // Update local quote ID only if it's still a 'local-' temporary ID
            if (quotes[localIndex].id.startsWith('local-')) {
                quotes[localIndex].id = `server-${responseData.id}`;
                saveQuotes();
                console.log(`Local quote ID updated to server ID: ${quotes[localIndex].id}`);
            }
        }
        return responseData;
    } catch (error) {
        console.error("Failed to post quote to server:", error);
        return null;
    }
}

async function syncQuotes() {
  console.log("Syncing quotes with server...");
  const serverQuotes = await fetchQuotesFromServer();
  let conflictsResolved = 0;
  let newQuotesAdded = 0;
  let localQuotesToPost = [];

  // Create a working copy of local quotes
  const localQuotesCopy = [...quotes];
  const updatedQuotes = []; // This will be the new merged list

  // Process server quotes first
  serverQuotes.forEach(serverQ => {
    const localIndex = localQuotesCopy.findIndex(localQ => localQ.id === serverQ.id);
    if (localIndex > -1) {
      // Conflict or match: Server takes precedence
      if (JSON.stringify(localQuotesCopy[localIndex]) !== JSON.stringify(serverQ)) {
        conflictsResolved++;
      }
      updatedQuotes.push(serverQ); // Add server version
      localQuotesCopy.splice(localIndex, 1); // Remove from copy so it's not processed again
    } else {
      // Server quote is new to us
      updatedQuotes.push(serverQ);
      newQuotesAdded++;
    }
  });

  // Now, add any remaining local-only quotes from localQuotesCopy
  // Also identify local-only quotes that need to be posted to server
  localQuotesCopy.forEach(localQ => {
    if (localQ.id.startsWith('local-')) {
      localQuotesToPost.push(localQ);
    }
    updatedQuotes.push(localQ); // Add remaining local quotes to the merged list
  });

  // If there were actual changes, update state
  if (conflictsResolved > 0 || newQuotesAdded > 0 || localQuotesToPost.length > 0 || updatedQuotes.length !== quotes.length) {
    quotes = updatedQuotes; // Update the main quotes array
    saveQuotes(); // Save to local storage
    populateCategories();
    filterQuotes();
    showRandomQuote(); // Refresh UI

    let message = 'Sync complete!';
    if (newQuotesAdded > 0) message += ` ${newQuotesAdded} new quotes from server.`;
    if (conflictsResolved > 0) message += ` ${conflictsResolved} conflicts resolved (server data took precedence).`;
    if (message !== 'Sync complete!') {
      alert(message);
    }
    console.log(message);
  } else {
    console.log("No changes during sync.");
  }

  // Post any local-only quotes that need to be pushed to the server (if they haven't been already)
  // This helps catch cases where an immediate postQuoteToServer failed.
  // Note: For JSONPlaceholder, this will create new mock posts each time.
  for (const quote of localQuotesToPost) {
      await postQuoteToServer(quote);
  }
}


// --- Initialisation ---

document.addEventListener('DOMContentLoaded', () => {
  loadQuotes(); // Load local quotes first

  // Load last selected filter from local storage
  const storedFilter = localStorage.getItem('lastCategoryFilter');
  if (storedFilter) {
    currentCategoryFilter = storedFilter;
  }

  populateCategories();
  filterQuotes(); // Apply the filter (either stored or 'all')

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportJson').addEventListener('click', exportToJsonFile); // Corrected ID reference
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  document.getElementById('syncQuotesBtn').addEventListener('click', syncQuotes);

  // Restore last viewed quote from session storage if exists
  const lastViewed = sessionStorage.getItem('lastViewedQuote');
  if (lastViewed) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const parsedQuote = JSON.parse(lastViewed);
    quoteDisplay.innerHTML = `
      <p>"${parsedQuote.text}"</p>
      <span>- ${parsedQuote.category}</span>
    `;
  } else {
    showRandomQuote(); // Show a random quote if no last viewed quote in session storage
  }

  // Start periodic sync with the server
  setInterval(syncQuotes, SYNC_INTERVAL_MS);
});