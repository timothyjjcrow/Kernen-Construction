/**
 * Kernen Construction Site Search
 *
 * This script provides site-wide search functionality.
 */

// Page content indexed for search
const pagesIndex = [
  {
    title: "Home",
    url: "index.html",
    content: "", // Will be populated dynamically
  },
  {
    title: "About Us",
    url: "about.html",
    content: "", // Will be populated dynamically
  },
  {
    title: "Services",
    url: "services.html",
    content: "", // Will be populated dynamically
  },
  {
    title: "Careers",
    url: "careers.html",
    content: "", // Will be populated dynamically
  },
  {
    title: "Contact Us",
    url: "contact.html",
    content: "", // Will be populated dynamically
  },
  // Service pages
  {
    title: "Bridges",
    url: "services/bridges.html",
    content: "", // Will be populated dynamically
  },
  {
    title: "Concrete Construction",
    url: "services/concrete-construction.html",
    content: "", // Will be populated dynamically
  },
  {
    title: "Varco Pruden Metal Buildings",
    url: "services/varco-pruden-metal-buildings.html",
    content: "", // Will be populated dynamically
  },
  {
    title: "Machine Shop/Welding/Repairs",
    url: "services/machine-shop-welding-repairs.html",
    content: "", // Will be populated dynamically
  },
  {
    title: "Excavating/Grading/Paving",
    url: "services/excavating-grading-paving.html",
    content: "", // Will be populated dynamically
  },
  {
    title: "Rock & Asphalt Products/Services",
    url: "services/rock-asphalt-products-services.html",
    content: "", // Will be populated dynamically
  },
  {
    title: "Trucking and Lowboy Services",
    url: "services/trucking-lowboy-services.html",
    content: "", // Will be populated dynamically
  },
];

// Function to fetch and index content from all pages
async function indexAllPages() {
  for (let page of pagesIndex) {
    try {
      const response = await fetch(page.url);
      const html = await response.text();

      // Create a temporary element to parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Extract all text content from the main content sections
      // We're excluding header, footer, and navigation
      const mainContent = doc.querySelector("main") || doc.body;

      // Remove script tags to avoid indexing JS code
      const scriptTags = mainContent.querySelectorAll("script");
      scriptTags.forEach((script) => script.remove());

      // Get text content and clean it up
      let content = mainContent.textContent;
      content = content.replace(/\s+/g, " ").trim(); // Normalize whitespace

      // Update the index with the content
      page.content = content;
    } catch (error) {
      console.error(`Error indexing ${page.url}:`, error);
    }
  }

  console.log("Site indexing complete");
  // Store the index in localStorage to avoid re-indexing on every page load
  localStorage.setItem("kernenSiteIndex", JSON.stringify(pagesIndex));
}

// Function to perform search
function searchSite(query) {
  if (!query || query.trim() === "") {
    return [];
  }

  query = query.toLowerCase().trim();
  const terms = query.split(/\s+/);

  // Get index from localStorage or index if not available
  let index = JSON.parse(localStorage.getItem("kernenSiteIndex")) || pagesIndex;

  // If index hasn't been populated, schedule indexing
  if (!index[0].content) {
    setTimeout(indexAllPages, 100);
    return [];
  }

  // Search through the index
  const results = index
    .filter((page) => {
      const pageContent =
        page.title.toLowerCase() + " " + page.content.toLowerCase();
      // Check if all search terms are found in the content
      return terms.every((term) => pageContent.includes(term));
    })
    .map((page) => {
      // Calculate relevance score (simple version - can be improved)
      let score = 0;
      terms.forEach((term) => {
        // Title matches are weighted higher
        if (page.title.toLowerCase().includes(term)) {
          score += 10;
        }

        // Content matches
        const contentMatches = (
          page.content.toLowerCase().match(new RegExp(term, "g")) || []
        ).length;
        score += contentMatches;
      });

      return {
        ...page,
        score,
        // Extract a snippet of text around the first match
        snippet: extractSnippet(page.content, terms[0]),
      };
    });

  // Sort by relevance score
  return results.sort((a, b) => b.score - a.score);
}

// Extract a contextual snippet from the content
function extractSnippet(content, term) {
  if (!content) return "";

  const lowerContent = content.toLowerCase();
  const termIndex = lowerContent.indexOf(term);

  if (termIndex === -1) return content.substring(0, 150) + "...";

  // Get some context around the first match
  const snippetStart = Math.max(0, termIndex - 50);
  const snippetEnd = Math.min(content.length, termIndex + term.length + 100);
  let snippet = content.substring(snippetStart, snippetEnd);

  // Add ellipsis if we're not at the beginning/end
  if (snippetStart > 0) snippet = "..." + snippet;
  if (snippetEnd < content.length) snippet += "...";

  return snippet;
}

// Handle search form submission
function handleSearchSubmit(event) {
  event.preventDefault();
  const searchInput = document.querySelector("#site-search-input");
  const query = searchInput.value.trim();

  if (query) {
    // Redirect to search results page with query
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  }
}

// Initialize search functionality
document.addEventListener("DOMContentLoaded", function () {
  // Attach event listener to search form
  const searchForm = document.querySelector("#site-search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", handleSearchSubmit);
  }

  // If on search results page, display results
  if (window.location.pathname.includes("search.html")) {
    displaySearchResults();
  }

  // Start indexing pages in the background
  // Check if we've already indexed
  if (!localStorage.getItem("kernenSiteIndex")) {
    indexAllPages();
  }
});

// Display search results on the search page
function displaySearchResults() {
  const resultsContainer = document.querySelector("#search-results");
  const searchCountElement = document.querySelector("#search-count");
  const searchQueryElement = document.querySelector("#search-query");

  if (!resultsContainer) return;

  // Get search query from URL
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");

  if (!query) {
    resultsContainer.innerHTML = "<p>No search query provided.</p>";
    return;
  }

  // Show the query in the UI
  if (searchQueryElement) {
    searchQueryElement.textContent = query;
  }

  // Perform search
  const results = searchSite(query);

  // Update results count
  if (searchCountElement) {
    searchCountElement.textContent = results.length;
  }

  // Display results
  if (results.length === 0) {
    resultsContainer.innerHTML = `<p>No results found for "${query}". Please try a different search term.</p>`;
  } else {
    const resultItems = results
      .map(
        (result) => `
      <div class="search-result">
        <h3><a href="${result.url}">${result.title}</a></h3>
        <p>${result.snippet}</p>
        <a href="${result.url}" class="result-link">Read more</a>
      </div>
    `
      )
      .join("");

    resultsContainer.innerHTML = resultItems;
  }
}
