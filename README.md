# DOM Manipulation, Web Storage, and Working with JSON Data Project

## Project Overview

This repository contains the solution for the "DOM Manipulation, Web Storage, and Working with JSON Data" project, developed as part of the alx_fe_javascript curriculum. The project focuses on building a dynamic web application that generates, manages, and filters content based on user interactions, leveraging advanced JavaScript concepts.

The core application developed is a **"Dynamic Quote Generator"** which allows users to:
*   Display random quotes from a collection.
*   Dynamically add new quotes and categories through a user interface.
*   Persist quotes and user preferences across browser sessions using Web Storage (Local and Session Storage).
*   Import and export quotes in JSON format.
*   Filter displayed quotes by category.
*   Simulate data syncing with a server and handle potential conflicts.

## Learning Objectives

By completing this project, the following learning objectives were met:

*   **Utilized Advanced DOM Manipulation Techniques:** Created and manipulated dynamic content, and implemented event-driven programming for enhanced interactivity.
*   **Implemented and Used Web Storage:** Leveraged local storage and session storage to persist data, and managed data stored in the browser.
*   **Handled JSON Data:** Imported and exported JSON data, ensuring data consistency and integrity.
*   **Filtered and Synced Data:** Implemented dynamic content filtering and simulated data syncing with a server, including basic conflict resolution.

## Project Structure

The main project files are located in the `dom-manipulation` directory (or directly in the root if you're keeping it simple for this repository).

*   `index.html`: The main HTML file providing the basic structure and placeholders for dynamic content.
*   `script.js`: The JavaScript file containing all the logic for DOM manipulation, quote generation, web storage integration, JSON handling, filtering, and server syncing simulation.
*   `style.css` (Optional, but recommended for styling): A CSS file for basic styling to make the application visually appealing.
*   `quotes.json` (Optional): A sample JSON file that could be used for initial quote import.

## How to Run the Application

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/kingnogool/alx_fe_javascript.git
    ```
  https://github.com/kingnogool/ 
2.  **Navigate to the Project Directory:**
    ```bash
    cd alx_fe_javascript/dom-manipulation 
    # Or simply `cd alx_fe_javascript` if your files are in the root
    ```
3.  **Open `index.html`:** Open the `index.html` file in your preferred web browser. You can usually do this by double-clicking the file or by using your browser's "File > Open File" option.

## Features Implemented

### Task 0: Dynamic Content Generator
*   Displays random quotes from an internal array.
*   Allows users to add new quotes with specified text and category.
*   Dynamically updates the DOM to display new quotes and an add quote form.

### Task 1: Web Storage and JSON Handling
*   **Local Storage:** Quotes are saved to local storage upon addition and loaded from local storage on application initialization, ensuring persistence across browser sessions.
*   **JSON Export:** Provides a button to export all current quotes into a JSON file for download.
*   **JSON Import:** Allows users to upload a JSON file to import new quotes into the application.

### Task 2: Dynamic Content Filtering System
*   **Category Filter:** A dropdown menu is dynamically populated with unique categories from the existing quotes.
*   **Filter Logic:** Users can select a category to display only quotes belonging to that category.
*   **Persistent Filter:** The last selected category filter is saved in local storage and restored when the page is revisited.
*   New categories added via the "Add Quote" form automatically update the filter dropdown.

### Task 3: Syncing Data with Server and Conflict Resolution
*   **Server Simulation:** Utilizes a mock API (e.g., JSONPlaceholder) to simulate fetching and posting data to a server.
*   **Periodic Syncing:** Implements logic to periodically check for server updates and synchronize local data.
*   **Conflict Resolution:** Employs a basic conflict resolution strategy, where server data takes precedence in case of discrepancies.
*   Includes UI elements or notifications to inform users about data updates or resolved conflicts.

## Author
 kingnogool

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details (if you create one).
