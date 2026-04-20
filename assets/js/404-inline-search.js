(function () {
  "use strict";

  var selectors = {
    input: "ifc-404-search-input",
    requestedPath: "ifc-404-requested-path",
    results: "ifc-404-search-results",
  };

  function getElement(id) {
    return document.getElementById(id);
  }

  function safeDecodeURIComponent(value) {
    try {
      return decodeURIComponent(value);
    } catch (error) {
      return value;
    }
  }

  function normalizeRequestedPath(pathname) {
    var normalizedPath = safeDecodeURIComponent(pathname || "");

    normalizedPath = normalizedPath.replace(/\/+$/, "");
    normalizedPath = normalizedPath.replace(/^\/+/, "");
    normalizedPath = normalizedPath.replace(/\.html?$/i, "");
    normalizedPath = normalizedPath.replace(/[-/]+/g, " ");
    normalizedPath = normalizedPath.replace(/\s+/g, " ").trim();

    if (normalizedPath === "404" || normalizedPath === "404 html") {
      return "";
    }

    return normalizedPath;
  }

  function shortenExcerpt(text, wordCount) {
    var words = String(text || "").trim().split(/\s+/).filter(Boolean);

    if (words.length <= wordCount) {
      return words.join(" ");
    }

    return words.slice(0, wordCount).join(" ") + "...";
  }

  function clearChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function buildSearchIndex() {
    if (window.IFC404SearchIndex) {
      return window.IFC404SearchIndex;
    }

    window.IFC404SearchIndex = lunr(function () {
      this.field("title");
      this.field("excerpt");
      this.field("categories");
      this.field("tags");
      this.ref("id");

      this.pipeline.remove(lunr.trimmer);

      for (var item in store) {
        this.add({
          title: store[item].title,
          excerpt: store[item].excerpt,
          categories: store[item].categories,
          tags: store[item].tags,
          id: item,
        });
      }
    });

    return window.IFC404SearchIndex;
  }

  function runSearch(index, query) {
    var normalizedQuery = String(query || "").toLowerCase().trim();

    if (!normalizedQuery) {
      return [];
    }

    return index.query(function (q) {
      normalizedQuery.split(lunr.tokenizer.separator).forEach(function (term) {
        if (!term) {
          return;
        }

        q.term(term, { boost: 100 });

        if (normalizedQuery.lastIndexOf(" ") !== normalizedQuery.length - 1) {
          q.term(term, {
            usePipeline: false,
            wildcard: lunr.Query.wildcard.TRAILING,
            boost: 10,
          });
        }

        q.term(term, {
          usePipeline: false,
          editDistance: 1,
          boost: 1,
        });
      });
    });
  }

  function renderResultItem(entry) {
    var listItem = document.createElement("div");
    var article = document.createElement("article");
    var heading = document.createElement("h2");
    var link = document.createElement("a");
    var excerpt = document.createElement("p");

    listItem.className = "list__item";

    article.className = "archive__item";
    article.setAttribute("itemscope", "");
    article.setAttribute("itemtype", "https://schema.org/CreativeWork");

    heading.className = "archive__item-title";
    heading.setAttribute("itemprop", "headline");

    link.href = entry.url;
    link.rel = "permalink";
    link.textContent = entry.title;

    heading.appendChild(link);
    article.appendChild(heading);

    if (entry.teaser) {
      var teaser = document.createElement("div");
      var image = document.createElement("img");

      teaser.className = "archive__item-teaser";
      image.src = entry.teaser;
      image.alt = "";
      teaser.appendChild(image);
      article.appendChild(teaser);
    }

    excerpt.className = "archive__item-excerpt";
    excerpt.setAttribute("itemprop", "description");
    excerpt.textContent = shortenExcerpt(entry.excerpt, 20);

    article.appendChild(excerpt);
    listItem.appendChild(article);

    return listItem;
  }

  function renderResults(resultsElement, queryResults) {
    clearChildren(resultsElement);

    var count = document.createElement("p");
    count.className = "results__found";
    count.textContent = queryResults.length + " Result(s) found";
    resultsElement.appendChild(count);

    queryResults.forEach(function (result) {
      var entry = store[result.ref];

      if (!entry) {
        return;
      }

      resultsElement.appendChild(renderResultItem(entry));
    });
  }

  function waitForSearchDependencies(callback, attempts) {
    var maxAttempts = 200;
    var currentAttempts = attempts || 0;

    if (window.lunr && Array.isArray(window.store)) {
      callback();
      return;
    }

    if (currentAttempts >= maxAttempts) {
      callback(new Error("Search dependencies did not load in time."));
      return;
    }

    window.setTimeout(function () {
      waitForSearchDependencies(callback, currentAttempts + 1);
    }, 50);
  }

  function initInline404Search() {
    var input = getElement(selectors.input);
    var requestedPath = getElement(selectors.requestedPath);
    var results = getElement(selectors.results);

    if (!input || !requestedPath || !results) {
      return;
    }

    var rawPathname = safeDecodeURIComponent(window.location.pathname || "");
    var derivedQuery = normalizeRequestedPath(window.location.pathname);

    if (rawPathname) {
      requestedPath.hidden = false;
      requestedPath.textContent = "Requested path: " + rawPathname;
    }

    function performSearch(query) {
      var normalizedQuery = String(query || "").trim();

      if (!normalizedQuery) {
        clearChildren(results);
        return;
      }

      var index = window.idx || buildSearchIndex();
      var queryResults = runSearch(index, normalizedQuery);

      renderResults(results, queryResults);
    }

    input.addEventListener("input", function () {
      performSearch(input.value);
    });

    input.value = derivedQuery;
    performSearch(derivedQuery);
  }

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  onReady(function () {
    waitForSearchDependencies(function (error) {
      if (error) {
        var results = getElement(selectors.results);

        if (results) {
          clearChildren(results);

          var message = document.createElement("p");
          message.className = "results__found";
          message.textContent = "Search is temporarily unavailable.";
          results.appendChild(message);
        }

        return;
      }

      initInline404Search();
    });
  });
})();
