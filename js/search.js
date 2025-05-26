/**
 * Kernen Construction Site Search
 * Enhanced search functionality with proper content indexing
 */

// Comprehensive page content index
const pagesIndex = [
  {
    title: "Home",
    url: "index.html",
    content:
      "Kernen Construction Northern California construction services building engineering contractors site preparation highway construction asphalt concrete paving concrete construction bridges varco pruden metal buildings machine shop welding repairs excavating grading paving rock asphalt products trucking lowboy services quality job performance referrals word mouth repeat business McKinleyville Humboldt County",
    description:
      "Northern California Construction Services - Building & Engineering Contractors",
  },
  {
    title: "About Us",
    url: "about.html",
    content:
      "Scott Farley Kurt Kernen founded 1986 reputation quality job completed time budget demand services construction related employ 50 qualified team members experience training certificates qualifications civil mechanical construction California Partnership B A C-21 C-8 Hazmat licenses services widespread core business building engineering construction McKinleyville CA concrete construction building slabs sidewalks curbs precision durability excavating grading solutions site prepared standards supplier rock asphalt products Humboldt County materials recycled aggregate base rip rap project needs authorized Varco Pruden builder custom metal building solutions specifications commendation Bonnie Neely award Humboldt County Division Environmental Health",
    description:
      "Learn about our history, team, and commitment to quality construction services since 1986",
  },
  {
    title: "Services",
    url: "services.html",
    content:
      "construction services bridges concrete construction varco pruden metal buildings machine shop welding repairs excavating grading paving rock asphalt products services trucking lowboy services comprehensive solutions northern california building engineering contractors quality workmanship experienced team",
    description:
      "Comprehensive construction services including bridges, concrete, metal buildings, and more",
  },
  {
    title: "Contact Us",
    url: "contact.html",
    content:
      "contact Kernen Construction office phone email address McKinleyville Humboldt County California consultation quote project requirements asphalt products sand gravel quarry rock gravel Miranda quarry machine shop welding repairs trucking dispatch",
    description: "Get in touch with Kernen Construction for your project needs",
  },
  {
    title: "Careers",
    url: "careers.html",
    content:
      "careers employment opportunities Kernen Construction join team construction industry experience qualified professionals northern california jobs positions",
    description: "Join our team - Career opportunities at Kernen Construction",
  },
  {
    title: "Bridges",
    url: "services/bridges.html",
    content:
      "bridges construction engineering design structural steel concrete bridge building infrastructure transportation projects highway bridges pedestrian bridges railroad bridges culverts drainage structures foundation work reinforcement professional engineering certified welding heavy equipment crane operations project management quality construction northern california",
    description: "Professional bridge construction and engineering services",
  },
  {
    title: "Concrete Construction",
    url: "services/concrete-construction.html",
    content:
      "concrete construction building slabs sidewalks curbs foundations walls driveways parking lots commercial residential industrial concrete pouring finishing reinforcement rebar placement quality materials experienced crews precision durability long lasting structures northern california",
    description:
      "Quality concrete construction services for commercial and residential projects",
  },
  {
    title: "Varco Pruden Metal Buildings",
    url: "services/varco-pruden-metal-buildings.html",
    content:
      "Varco Pruden metal buildings authorized builder pre-engineered metal building solutions commercial industrial agricultural applications retail spaces office buildings warehouses distribution centers self-storage facilities manufacturing facilities equipment storage processing plants vehicle maintenance shops heavy equipment facilities aviation hangars transportation facilities climate-controlled storage sports community buildings custom hybrid clear-span structures architectural flexibility superior engineering durability energy efficiency cost-effectiveness modifications expansions retrofits existing structures",
    description:
      "Authorized Varco Pruden builder for custom metal building solutions",
  },
  {
    title: "Machine Shop/Welding/Repairs",
    url: "services/machine-shop-welding-repairs.html",
    content:
      "machine shop welding repairs full service capabilities individual components complex assemblies certified welding ferrous metals carbon steel alloy steel stainless non-ferrous metals aluminum brass bronze machinable plastics acetal nylon gasoline ceramics marinite transite portable lineboring assembly on-site in-shop lineboring solutions equipment repair heavy equipment repair bore alignment pin bushing replacement precision machining custom components rapid turnaround customer service quality manufacturing quotation shipment attention detail",
    description:
      "Full-service machine shop with certified welding and repair capabilities",
  },
  {
    title: "Excavating/Grading/Paving",
    url: "services/excavating-grading-paving.html",
    content:
      "excavating grading paving site preparation earthwork land development road construction parking lot construction asphalt paving concrete paving drainage systems utility installation trenching backfill compaction soil stabilization erosion control environmental compliance heavy equipment operators experienced crews project management quality workmanship",
    description:
      "Comprehensive excavating, grading, and paving services for site development",
  },
  {
    title: "Rock & Asphalt Products/Services",
    url: "services/rock-asphalt-products-services.html",
    content:
      "rock asphalt products services crushed rock products multiple applications crushed base rock drain rock riprap landscape rock aggregate materials hot mix asphalt cold mix asphalt recycled asphalt products custom asphalt mixes quarry operations multiple quarries Humboldt County Miranda quarry custom crushing material screening quality control testing delivery services available",
    description: "Quality rock and asphalt products from our own quarries",
  },
  {
    title: "Trucking and Lowboy Services",
    url: "services/trucking-lowboy-services.html",
    content:
      "trucking lowboy services fleet local hauling needs comprehensive transportation northern california reliability efficiency professionalism material hauling 10 wheelers semi-trucks transfers end dumps bottom dumps heavy equipment transport specialized transport heavy oversized equipment heavy hauls equipment 5 axle 9 axle trailers construction machinery moving oversized load hauling project site equipment relocation flatbeds step decks demolition trailers reliable dispatch service professional experienced drivers",
    description:
      "Reliable trucking and lowboy services for material and equipment transport",
  },
];

// Enhanced search functionality
class SiteSearch {
  constructor() {
    this.index = pagesIndex;
    this.init();
  }

  init() {
    this.attachEventListeners();

    // If on search results page, display results
    if (window.location.pathname.includes("search.html")) {
      this.displaySearchResults();
    }
  }

  attachEventListeners() {
    // Main search form
    const searchForm = document.querySelector("#site-search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) =>
        this.handleSearchSubmit(e, "#site-search-input")
      );
    }

    // Mobile search form
    const mobileSearchForm = document.querySelector("#mobile-search-form");
    if (mobileSearchForm) {
      mobileSearchForm.addEventListener("submit", (e) =>
        this.handleSearchSubmit(e, "#mobile-search-input")
      );
    }

    // Refine search form (on search results page)
    const refineForm = document.querySelector("#refine-search-form");
    if (refineForm) {
      refineForm.addEventListener("submit", (e) =>
        this.handleSearchSubmit(e, "#refine-search-input")
      );

      // Pre-fill with current query
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get("q");
      const refineInput = document.querySelector("#refine-search-input");
      if (refineInput && query) {
        refineInput.value = query;
      }
    }
  }

  handleSearchSubmit(event, inputSelector) {
    event.preventDefault();
    const searchInput = document.querySelector(inputSelector);
    const query = searchInput ? searchInput.value.trim() : "";

    if (query) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  }

  searchSite(query) {
    if (!query || query.trim() === "") {
      return [];
    }

    query = query.toLowerCase().trim();
    const terms = query.split(/\s+/).filter((term) => term.length > 0);

    // Search through the index
    const results = this.index
      .map((page) => {
        const pageContent = (
          page.title +
          " " +
          page.content +
          " " +
          page.description
        ).toLowerCase();

        let score = 0;
        let matchedTerms = 0;

        terms.forEach((term) => {
          // Title matches are weighted highest
          if (page.title.toLowerCase().includes(term)) {
            score += 20;
            matchedTerms++;
          }

          // Description matches are weighted high
          if (page.description.toLowerCase().includes(term)) {
            score += 15;
            matchedTerms++;
          }

          // Content matches
          const contentMatches = (
            pageContent.match(new RegExp(term, "g")) || []
          ).length;
          if (contentMatches > 0) {
            score += contentMatches * 2;
            matchedTerms++;
          }

          // Exact phrase bonus
          if (pageContent.includes(query)) {
            score += 10;
          }
        });

        // Only return results that match at least one term
        if (matchedTerms > 0) {
          return {
            ...page,
            score,
            matchedTerms,
            snippet: this.extractSnippet(
              page.content + " " + page.description,
              terms[0]
            ),
          };
        }
        return null;
      })
      .filter((result) => result !== null)
      .sort((a, b) => {
        // Sort by number of matched terms first, then by score
        if (b.matchedTerms !== a.matchedTerms) {
          return b.matchedTerms - a.matchedTerms;
        }
        return b.score - a.score;
      });

    return results;
  }

  extractSnippet(content, term) {
    if (!content || !term) return "";

    const lowerContent = content.toLowerCase();
    const termIndex = lowerContent.indexOf(term.toLowerCase());

    if (termIndex === -1) {
      return content.substring(0, 150) + "...";
    }

    // Get context around the first match
    const snippetStart = Math.max(0, termIndex - 60);
    const snippetEnd = Math.min(content.length, termIndex + term.length + 120);
    let snippet = content.substring(snippetStart, snippetEnd);

    // Add ellipsis if we're not at the beginning/end
    if (snippetStart > 0) snippet = "..." + snippet;
    if (snippetEnd < content.length) snippet += "...";

    // Highlight the search term
    const regex = new RegExp(`(${term})`, "gi");
    snippet = snippet.replace(regex, "<mark>$1</mark>");

    return snippet;
  }

  displaySearchResults() {
    const resultsContainer = document.querySelector("#search-results");
    const searchCountElement = document.querySelector("#search-count");
    const searchQueryElement = document.querySelector("#search-query");

    if (!resultsContainer) return;

    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");

    if (!query) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <h3>No search query provided</h3>
          <p>Please enter a search term to find relevant content.</p>
        </div>
      `;
      return;
    }

    // Show the query in the UI
    if (searchQueryElement) {
      searchQueryElement.textContent = `"${query}"`;
    }

    // Perform search
    const results = this.searchSite(query);

    // Update results count
    if (searchCountElement) {
      searchCountElement.textContent = results.length;
    }

    // Display results
    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <h3>No results found for "${query}"</h3>
          <p>Try different keywords or check your spelling. You can also:</p>
          <ul>
            <li>Use more general terms</li>
            <li>Try synonyms or related words</li>
            <li>Remove quotes around phrases</li>
            <li>Check our <a href="services.html">Services</a> page for specific offerings</li>
          </ul>
        </div>
      `;
    } else {
      const resultItems = results
        .map(
          (result) => `
          <div class="search-result">
            <h3><a href="${result.url}">${result.title}</a></h3>
            <p class="result-description">${result.description}</p>
            <p class="result-snippet">${result.snippet}</p>
            <a href="${result.url}" class="result-link">Read more →</a>
          </div>
        `
        )
        .join("");

      resultsContainer.innerHTML = resultItems;
    }

    // Remove loading message
    const loadingElement = document.querySelector(".search-loading");
    if (loadingElement) {
      loadingElement.remove();
    }
  }
}

// Initialize search when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  new SiteSearch();
});
