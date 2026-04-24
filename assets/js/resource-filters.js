(function () {
  function splitValues(value) {
    return (value || "")
      .split("|")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function uniqueValues(values) {
    var seen = Object.create(null);
    return (values || []).filter(function (value) {
      if (!value || seen[value]) return false;
      seen[value] = true;
      return true;
    });
  }

  function compareText(a, b) {
    return (a || "").localeCompare(b || "", undefined, { sensitivity: "base" });
  }

  function parseDate(value) {
    if (!value) return null;
    var parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  function matchesSelection(itemValues, selectedValues) {
    if (!selectedValues.length) return true;
    return selectedValues.some(function (value) {
      return itemValues.indexOf(value) !== -1;
    });
  }

  function compareDates(leftValue, rightValue, descending) {
    var leftDate = parseDate(leftValue);
    var rightDate = parseDate(rightValue);
    var leftHasDate = leftDate !== null;
    var rightHasDate = rightDate !== null;

    if (leftHasDate && rightHasDate) {
      return descending ? rightDate - leftDate : leftDate - rightDate;
    }

    if (leftHasDate && !rightHasDate) return -1;
    if (!leftHasDate && rightHasDate) return 1;
    return 0;
  }

  function isMobileViewport() {
    return window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
  }

  function scrollToVisibleTarget(target, extraOffset) {
    if (!target) return;

    var masthead = document.querySelector(".masthead");
    var mastheadOffset = masthead ? masthead.getBoundingClientRect().height : 0;
    var targetTop = target.getBoundingClientRect().top + window.scrollY - mastheadOffset - (extraOffset || 0);

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth"
    });
  }

  function jumpToGlossaryItem(root, glossaryId) {
    if (!glossaryId) return;

    var glossaryBrowser = root && root.IFCGlossaryBrowser;
    var browser = root && root.IFCFilterBrowser;
    var selector = '[data-glossary-id="' + glossaryId + '"]';
    var target = root ? root.querySelector(selector) : null;

    if (glossaryBrowser && target && target.hidden) {
      glossaryBrowser.clearFilters();
      target = root.querySelector(selector);
    }

    if (browser && browser.controls.tag && browser.controls.tag.value && target && target.hidden) {
      browser.controls.tag.value = "";
      browser.render();
      target = root.querySelector(selector);
    }

    if (!target) return;

    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, "", window.location.pathname + window.location.search + "#glossary-" + glossaryId);
    }

    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.classList.remove("is-targeted");
    window.setTimeout(function () {
      target.classList.add("is-targeted");
    }, 0);
    window.setTimeout(function () {
      target.classList.remove("is-targeted");
    }, 1800);
  }

  function pruneEmptyGlossaryRelatedLists(root) {
    if (!root) return;

    Array.prototype.forEach.call(root.querySelectorAll(".ifc-related-list"), function (section) {
      var list = section.querySelector(".ifc-list");
      var hasLinks = list && list.querySelector("a[href]");

      if (!hasLinks) {
        section.remove();
      }
    });
  }

  function setupBrowser(root) {
    var list = root.querySelector("[data-filter-list]");
    if (!list) return;

    var items = Array.prototype.slice.call(list.querySelectorAll("[data-filter-item]"));
    var emptyState = root.querySelector("[data-filter-empty]");
    var summary = root.querySelector("[data-filter-summary]");
    var controls = {
      domain: root.querySelector('[data-filter="domain"]'),
      concern: root.querySelector('[data-filter="concern"]'),
      tag: root.querySelector('[data-filter="tag"]'),
      sort: root.querySelector('[data-filter="sort"]')
    };
    var defaultSort = root.getAttribute("data-default-sort") || "alphabetical";
    var syncQuery = root.hasAttribute("data-sync-query");
    var params = new URLSearchParams(window.location.search);

    ["domain", "concern", "tag", "sort"].forEach(function (key) {
      var control = controls[key];
      var value = params.get(key);
      if (control && value) {
        control.value = value;
      }
    });

    function matches(item) {
      if (controls.domain && controls.domain.value) {
        if (splitValues(item.dataset.domain).indexOf(controls.domain.value) === -1) return false;
      }
      if (controls.concern && controls.concern.value) {
        if (splitValues(item.dataset.concern).indexOf(controls.concern.value) === -1) return false;
      }
      if (controls.tag && controls.tag.value) {
        if (splitValues(item.dataset.tags).indexOf(controls.tag.value) === -1) return false;
      }
      return true;
    }

    function sortItems(visibleItems) {
      var sortValue = controls.sort ? controls.sort.value : defaultSort;
      return visibleItems.sort(function (left, right) {
        var leftDate = left.dataset.date ? Date.parse(left.dataset.date) : 0;
        var rightDate = right.dataset.date ? Date.parse(right.dataset.date) : 0;
        var leftTitle = left.dataset.title || "";
        var rightTitle = right.dataset.title || "";

        if (sortValue === "newest") return rightDate - leftDate || compareText(leftTitle, rightTitle);
        if (sortValue === "oldest") return leftDate - rightDate || compareText(leftTitle, rightTitle);
        if (sortValue === "featured") {
          var leftFeatured = Number(left.dataset.featured || 0);
          var rightFeatured = Number(right.dataset.featured || 0);
          return rightFeatured - leftFeatured || rightDate - leftDate || compareText(leftTitle, rightTitle);
        }
        return compareText(leftTitle, rightTitle);
      });
    }

    function updateQueryString() {
      if (!syncQuery) return;
      var nextParams = new URLSearchParams(window.location.search);

      ["domain", "concern", "tag", "sort"].forEach(function (key) {
        var control = controls[key];
        var defaultValue = key === "sort" ? defaultSort : "";
        if (!control) {
          nextParams.delete(key);
          return;
        }
        if (control.value && control.value !== defaultValue) {
          nextParams.set(key, control.value);
        } else {
          nextParams.delete(key);
        }
      });

      var nextQuery = nextParams.toString();
      var nextUrl = window.location.pathname + (nextQuery ? "?" + nextQuery : "");
      window.history.replaceState({}, "", nextUrl);
    }

    function render() {
      var visibleItems = items.filter(matches);
      sortItems(visibleItems).forEach(function (item) {
        list.appendChild(item);
        item.hidden = false;
        item.style.display = "";
      });

      items.forEach(function (item) {
        if (visibleItems.indexOf(item) === -1) {
          item.hidden = true;
          item.style.display = "none";
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleItems.length !== 0;
      }

      if (summary) {
        summary.textContent = visibleItems.length === 1 ? "1 item" : visibleItems.length + " items";
      }

      updateQueryString();
    }

    root.IFCFilterBrowser = {
      controls: controls,
      render: render
    };

    Object.keys(controls).forEach(function (key) {
      if (controls[key]) {
        controls[key].addEventListener("change", render);
      }
    });

    root.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-related-glossary-link]");
      if (!trigger) return;
      event.preventDefault();
      jumpToGlossaryItem(root, trigger.getAttribute("data-related-glossary-link"));
    });

    render();
  }

  function setupGlossaryBrowser(root) {
    var list = root.querySelector("[data-glossary-list]");
    if (!list) return;

    pruneEmptyGlossaryRelatedLists(root);

    var items = Array.prototype.slice.call(list.querySelectorAll("[data-filter-item]"));
    var summary = root.querySelector("[data-filter-summary]");
    var emptyState = root.querySelector("[data-filter-empty]");
    var activeFilters = root.querySelector("[data-active-filters]");
    var mobilePanel = root.querySelector("[data-mobile-filter-panel]");
    var mobileBackdrop = root.querySelector("[data-mobile-filter-backdrop]");
    var glossaryPath = root.getAttribute("data-glossary-path") || "/resources/glossary/";
    var glossaryTopTarget = root.querySelector("[data-glossary-top-target]") || root;
    var openMenu = null;
    var isMobilePanelOpen = false;

    var groupNode = root.querySelector("[data-filter-kind='multi'][data-filter-group='tag']");
    if (!groupNode) return;

    var desktopOptions = Array.prototype.slice.call(groupNode.querySelectorAll("input[type='checkbox']"));
    var mobileMenu = root.querySelector("[data-mobile-filter-menu]");
    var mobileOptions = mobileMenu ? Array.prototype.slice.call(mobileMenu.querySelectorAll("input[type='checkbox']")) : [];
    var mobileToggle = groupNode.querySelector("[data-filter-toggle]");
    var options = desktopOptions.concat(mobileOptions);
    var tagGroup = {
      node: groupNode,
      toggle: mobileToggle,
      menu: groupNode.querySelector("[data-filter-menu]"),
      mobileMenu: mobileMenu,
      labelNode: groupNode.querySelector("[data-filter-trigger-label]"),
      allLabel: groupNode.getAttribute("data-all-label") || "All Tags",
      groupLabel: groupNode.getAttribute("data-group-label") || "Tags",
      mobileLabel: groupNode.getAttribute("data-mobile-label") || "Tags",
      options: options,
      values: uniqueValues(
        options.map(function (option) {
          return option.value;
        })
      ),
      labels: options.reduce(function (memo, option) {
        memo[option.value] = option.getAttribute("data-option-label") || option.value;
        return memo;
      }, {})
    };

    var uiState = {
      tag: []
    };

    function normalizeTagValues(selectedValues) {
      var allowedLookup = tagGroup.values.reduce(function (memo, value) {
        memo[value] = true;
        return memo;
      }, {});

      var normalized = uniqueValues(selectedValues).filter(function (value) {
        return allowedLookup[value];
      });

      if (!normalized.length || normalized.length === tagGroup.values.length) {
        return [];
      }

      return normalized;
    }

    function getCanonicalState() {
      return {
        tag: normalizeTagValues(uiState.tag)
      };
    }

    function parseUiState(search) {
      var params = new URLSearchParams(search || "");
      var allowedLookup = tagGroup.values.reduce(function (memo, value) {
        memo[value] = true;
        return memo;
      }, {});

      return {
        tag: uniqueValues(params.getAll("tag")).filter(function (value) {
          return allowedLookup[value];
        })
      };
    }

    function buildButtonLabel() {
      var count = uiState.tag.length;

      if (isMobileViewport()) {
        if (!count || count === tagGroup.values.length) {
          return tagGroup.mobileLabel;
        }
        return tagGroup.mobileLabel + ": " + count;
      }

      if (!count || count === tagGroup.values.length) {
        return tagGroup.allLabel;
      }
      return tagGroup.groupLabel + ": " + count;
    }

    function updateControls() {
      var selectedLookup = uniqueValues(uiState.tag).reduce(function (memo, value) {
        memo[value] = true;
        return memo;
      }, {});

      tagGroup.options.forEach(function (option) {
        option.checked = !!selectedLookup[option.value];
      });

      if (tagGroup.labelNode) {
        tagGroup.labelNode.textContent = buildButtonLabel();
      }
    }

    function buildUrl(canonicalState) {
      var nextParams = new URLSearchParams(window.location.search);
      nextParams.delete("tag");
      canonicalState.tag.forEach(function (value) {
        nextParams.append("tag", value);
      });
      var nextQuery = nextParams.toString();
      return glossaryPath + (nextQuery ? "?" + nextQuery : "") + window.location.hash;
    }

    function updateHistory(canonicalState) {
      if (!window.history || !window.history.replaceState) return;
      var nextUrl = buildUrl(canonicalState);
      var currentUrl = window.location.pathname + window.location.search + window.location.hash;
      if (nextUrl !== currentUrl) {
        window.history.replaceState({}, "", nextUrl);
      }
    }

    function sortVisibleItems(visibleItems) {
      return visibleItems.sort(function (left, right) {
        return compareText(left.getAttribute("data-title") || "", right.getAttribute("data-title") || "");
      });
    }

    function renderActiveFilters(canonicalState) {
      if (!activeFilters) return;

      activeFilters.innerHTML = "";
      var fragment = document.createDocumentFragment();

      canonicalState.tag.forEach(function (value) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "ifc-active-filters__pill ifc-active-filters__pill--tag";
        chip.setAttribute("data-clear-tag-value", value);
        chip.textContent = (tagGroup.labels[value] || value) + " ×";
        fragment.appendChild(chip);
      });

      if (canonicalState.tag.length > 0) {
        var clearButton = document.createElement("button");
        clearButton.type = "button";
        clearButton.className = "ifc-active-filters__clear";
        clearButton.setAttribute("data-clear-all-tags", "true");
        clearButton.textContent = "Clear all";
        fragment.appendChild(clearButton);
      }

      var hasActiveFilters = fragment.childNodes.length > 0;
      activeFilters.appendChild(fragment);
      activeFilters.hidden = !hasActiveFilters;
    }

    function syncMobileStatus(canonicalState) {
      return canonicalState.tag.length;
    }

    function render(canonicalState) {
      var visibleItems = items.filter(function (item) {
        return matchesSelection(splitValues(item.getAttribute("data-tags")), canonicalState.tag);
      });

      sortVisibleItems(visibleItems).forEach(function (item) {
        list.appendChild(item);
        item.hidden = false;
        item.style.display = "";
      });

      items.forEach(function (item) {
        if (visibleItems.indexOf(item) === -1) {
          item.hidden = true;
          item.style.display = "none";
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleItems.length !== 0;
      }

      if (summary) {
        summary.textContent = visibleItems.length === 1 ? "1 item" : visibleItems.length + " items";
      }

      renderActiveFilters(canonicalState);
      syncMobileStatus(canonicalState);
      updateHistory(canonicalState);
    }

    function closeMenu() {
      tagGroup.node.classList.remove("is-open");
      tagGroup.menu.hidden = true;
      tagGroup.toggle.setAttribute("aria-expanded", "false");
      openMenu = null;
    }

    function closeMobilePanel() {
      if (!mobilePanel || !mobileToggle) return;
      isMobilePanelOpen = false;
      if (mobileBackdrop) {
        mobileBackdrop.hidden = true;
      }
      mobileToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("ifc-resource-browser--panel-open");
    }

    function openMobilePanel() {
      if (!mobilePanel || !mobileToggle) return;
      isMobilePanelOpen = true;
      if (mobileBackdrop) {
        mobileBackdrop.hidden = false;
      }
      mobileToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("ifc-resource-browser--panel-open");
    }

    function toggleMenu() {
      if (isMobileViewport()) {
        if (isMobilePanelOpen) {
          closeMobilePanel();
        } else {
          openMobilePanel();
        }
        return;
      }

      var isOpen = tagGroup.node.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
        return;
      }

      tagGroup.node.classList.add("is-open");
      tagGroup.menu.hidden = false;
      tagGroup.toggle.setAttribute("aria-expanded", "true");
      openMenu = tagGroup;
    }

    function scrollToGlossaryTopTarget() {
      var masthead = document.querySelector(".masthead");
      var mastheadOffset = masthead ? masthead.getBoundingClientRect().height : 0;
      var extraOffset = 16;
      var targetTop = glossaryTopTarget.getBoundingClientRect().top + window.scrollY - mastheadOffset - extraOffset;

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: "smooth"
      });

      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, "", window.location.pathname + window.location.search);
      }
    }

    function applyUiState(nextState) {
      uiState = {
        tag: uniqueValues(nextState.tag || [])
      };

      updateControls();
      render(getCanonicalState());
    }

    function updateTagSelection(selectedValues) {
      applyUiState({
        tag: selectedValues
      });

      if (isMobileViewport()) {
        updateControls();
      }
    }

    function toggleTagValue(value, checked) {
      var nextValues;

      options.forEach(function (input) {
        if (input.value === value) {
          input.checked = checked;
        }
      });

      if (checked) {
        nextValues = uiState.tag.concat([value]);
      } else {
        nextValues = uiState.tag.filter(function (selectedValue) {
          return selectedValue !== value;
        });
      }

      updateTagSelection(nextValues);
    }

    root.IFCGlossaryBrowser = {
      clearFilters: function () {
        applyUiState({ tag: [] });
      }
    };

    root.addEventListener("change", function (event) {
      var option = event.target.closest(".ifc-resource-filter__option input[type='checkbox']");
      if (!option) return;

      toggleTagValue(option.value, option.checked);
    });

    root.addEventListener("click", function (event) {
      var toggle = event.target.closest("[data-filter-toggle]");
      if (toggle) {
        event.preventDefault();
        toggleMenu();
        return;
      }

      var bulkAction = event.target.closest("[data-filter-action]");
      if (bulkAction) {
        event.preventDefault();
        var action = bulkAction.getAttribute("data-filter-action");
        updateTagSelection(action === "check-all" ? tagGroup.values.slice() : []);
        return;
      }

      var clearValue = event.target.closest("[data-clear-tag-value]");
      if (clearValue) {
        event.preventDefault();
        updateTagSelection(
          uiState.tag.filter(function (value) {
            return value !== clearValue.getAttribute("data-clear-tag-value");
          })
        );
        return;
      }

      var clearAll = event.target.closest("[data-clear-all-tags]");
      if (clearAll) {
        event.preventDefault();
        applyUiState({ tag: [] });
        closeMobilePanel();
        return;
      }

      var mobileCloseTrigger = event.target.closest("[data-mobile-filter-close]");
      if (mobileCloseTrigger) {
        event.preventDefault();
        closeMobilePanel();
        return;
      }

      var topLink = event.target.closest("[data-glossary-top-link]");
      if (topLink) {
        event.preventDefault();
        scrollToGlossaryTopTarget();
        return;
      }

      var trigger = event.target.closest("[data-related-glossary-link]");
      if (trigger) {
        event.preventDefault();
        jumpToGlossaryItem(root, trigger.getAttribute("data-related-glossary-link"));
      }
    });

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener("click", closeMobilePanel);
    }

    document.addEventListener("click", function (event) {
      if (openMenu && !openMenu.node.contains(event.target)) {
        closeMenu();
      }

      if (isMobilePanelOpen && mobilePanel && !mobilePanel.contains(event.target) && (!mobileToggle || !mobileToggle.contains(event.target))) {
        closeMobilePanel();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (openMenu) {
        closeMenu();
      } else if (isMobilePanelOpen) {
        closeMobilePanel();
      }
    });

    window.addEventListener("popstate", function () {
      closeMenu();
      closeMobilePanel();
      applyUiState(parseUiState(window.location.search));
    });

    window.addEventListener("resize", updateControls);
    applyUiState(parseUiState(window.location.search));
  }

  function setupResourceBrowser(root) {
    var resourcesPath = root.getAttribute("data-resource-path") || "/resources/";
    var resultsList = root.querySelector("[data-resource-results-list]");
    if (!resultsList) return;

    var items = Array.prototype.slice.call(resultsList.querySelectorAll("[data-result-item]"));
    var summary = root.querySelector("[data-filter-summary]");
    var glossaryAction = root.querySelector("[data-results-glossary-action]");
    var emptyState = root.querySelector("[data-filter-empty]");
    var activeFilters = root.querySelector("[data-active-filters]");
    var resultsSection = root.querySelector("[data-resource-results]");
    var resultsHeading = root.querySelector("[data-resource-results-heading]");
    var landingSections = Array.prototype.slice.call(root.querySelectorAll("[data-resource-landing-section]"));
    var mobileToggle = root.querySelector("[data-mobile-filter-toggle]");
    var mobileCount = root.querySelector("[data-mobile-filter-count]");
    var mobilePanel = root.querySelector("[data-mobile-filter-panel]");
    var mobileBackdrop = root.querySelector("[data-mobile-filter-backdrop]");
    var mobileClose = root.querySelector("[data-mobile-filter-close]");
    var mobileSortNode = root.querySelector("[data-mobile-sort-control]");
    var resourceTopTarget = root.querySelector("[data-mobile-filter-panel]") || root;
    var mobileTopTarget = root.querySelector("[data-mobile-filter-toggle]") || root;
    var defaultSort = root.getAttribute("data-default-sort") || "recent-published-desc";
    var resultLabelSingular = root.getAttribute("data-result-label-singular") || "resource";
    var resultLabelPlural = root.getAttribute("data-result-label-plural") || "resources";
    var openMenu = null;
    var isMobilePanelOpen = false;

    var groups = {};
    Array.prototype.slice.call(root.querySelectorAll("[data-filter-kind='multi']")).forEach(function (groupNode) {
      var key = groupNode.getAttribute("data-filter-group");
      var options = Array.prototype.slice.call(groupNode.querySelectorAll("input[type='checkbox']"));
      groups[key] = {
        key: key,
        node: groupNode,
        kind: "multi",
        toggle: groupNode.querySelector("[data-filter-toggle]"),
        menu: groupNode.querySelector("[data-filter-menu]"),
        labelNode: groupNode.querySelector("[data-filter-trigger-label]"),
        allLabel: groupNode.getAttribute("data-all-label") || "",
        groupLabel: groupNode.getAttribute("data-group-label") || "",
        options: options,
        values: options.map(function (option) {
          return option.value;
        }),
        labels: options.reduce(function (memo, option) {
          memo[option.value] = option.getAttribute("data-option-label") || option.value;
          return memo;
        }, {})
      };
    });

    var sortNode = root.querySelector("[data-filter-kind='single'][data-filter-group='sort']");
    var sortButtons = sortNode ? Array.prototype.slice.call(sortNode.querySelectorAll("[data-sort-option]")) : [];
    var sortLabels = {
      lexicographical: "Lexicographical",
      "recent-published-desc": "Most Recently Published First",
      "published-asc": "Oldest Published First",
      "recent-updated-desc": "Most Recently Updated First",
      "updated-asc": "Oldest Updated First"
    };
    var sortControl = sortNode
      ? {
          node: sortNode,
          toggle: sortNode.querySelector("[data-filter-toggle]"),
          menu: sortNode.querySelector("[data-filter-menu]"),
          buttons: sortButtons,
          screenReaderText: sortNode.querySelector("[data-sort-trigger-text]")
        }
      : null;
    var mobileSortControl = mobileSortNode
      ? {
          node: mobileSortNode,
          toggle: mobileSortNode.querySelector("[data-mobile-sort-toggle]"),
          menu: mobileSortNode.querySelector("[data-mobile-sort-menu]"),
          buttons: Array.prototype.slice.call(mobileSortNode.querySelectorAll("[data-mobile-sort-option]")),
          screenReaderText: mobileSortNode.querySelector("[data-mobile-sort-trigger-text]")
        }
      : null;
    var sortControls = [sortControl, mobileSortControl].filter(Boolean);

    var uiState = {
      format: [],
      domain: [],
      concern: [],
      tag: [],
      sort: defaultSort,
      sortExplicit: false
    };

    function normalizeMultiValues(selectedValues, group) {
      if (!group) return [];
      var allowedLookup = group.values.reduce(function (memo, value) {
        memo[value] = true;
        return memo;
      }, {});
      var normalized = uniqueValues(selectedValues).filter(function (value) {
        return allowedLookup[value];
      });

      // Empty and fully checked states are both canonical "unfiltered" states.
      if (!normalized.length || normalized.length === group.values.length) {
        return [];
      }

      return normalized;
    }

    function getCanonicalState() {
      return {
        format: normalizeMultiValues(uiState.format, groups.format),
        domain: normalizeMultiValues(uiState.domain, groups.domain),
        concern: normalizeMultiValues(uiState.concern, groups.concern),
        tag: normalizeMultiValues(uiState.tag, groups.tag),
        sort: uiState.sort,
        sortExplicit: uiState.sortExplicit
      };
    }

    function getActiveValueCount(canonicalState) {
      var count =
        canonicalState.format.length +
        canonicalState.domain.length +
        canonicalState.concern.length +
        canonicalState.tag.length;
      if (canonicalState.sortExplicit) count += 1;
      return count;
    }

    function getActiveFilterCount(canonicalState) {
      return canonicalState.format.length + canonicalState.domain.length + canonicalState.concern.length + canonicalState.tag.length;
    }

    function hasActiveState(canonicalState) {
      return getActiveValueCount(canonicalState) > 0;
    }

    function parseUiState(search) {
      var params = new URLSearchParams(search || "");
      var nextState = {
        format: [],
        domain: [],
        concern: [],
        tag: [],
        sort: defaultSort,
        sortExplicit: false
      };

      ["format", "domain", "concern", "tag"].forEach(function (key) {
        var group = groups[key];
        if (!group) return;
        var allowedLookup = group.values.reduce(function (memo, value) {
          memo[value] = true;
          return memo;
        }, {});
        nextState[key] = uniqueValues(params.getAll(key)).filter(function (value) {
          return allowedLookup[value];
        });
      });

      var sortValue = params.get("sort");
      if (sortValue && sortLabels[sortValue]) {
        nextState.sort = sortValue;
        nextState.sortExplicit = true;
      }

      return nextState;
    }

    function buildButtonLabel(groupKey) {
      var group = groups[groupKey];
      var selected = uiState[groupKey];
      var count = selected.length;

      if (!count || count === group.values.length) {
        return group.allLabel;
      }

      return group.groupLabel + ": " + count;
    }

    function updateControls() {
      Object.keys(groups).forEach(function (key) {
        var group = groups[key];
        var selectedLookup = uniqueValues(uiState[key]).reduce(function (memo, value) {
          memo[value] = true;
          return memo;
        }, {});

        group.options.forEach(function (option) {
          option.checked = !!selectedLookup[option.value];
        });

        if (group.labelNode) {
          group.labelNode.textContent = buildButtonLabel(key);
        }
      });

      sortControls.forEach(function (control) {
        control.buttons.forEach(function (button) {
          var optionValue = button.getAttribute("data-sort-option") || button.getAttribute("data-mobile-sort-option");
          var isActive = optionValue === uiState.sort;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        var currentSortLabel = sortLabels[uiState.sort] || "Sort resources";
        var triggerLabel = "Sort: " + currentSortLabel;
        control.toggle.setAttribute("aria-label", triggerLabel);
        control.toggle.setAttribute("title", triggerLabel);
        if (control.screenReaderText) {
          control.screenReaderText.textContent = triggerLabel;
        }
      });
    }

    function buildUrl(canonicalState) {
      var nextParams = new URLSearchParams(window.location.search);

      ["format", "domain", "concern", "tag", "sort"].forEach(function (key) {
        nextParams.delete(key);
      });

      ["format", "domain", "concern", "tag"].forEach(function (key) {
        canonicalState[key].forEach(function (value) {
          nextParams.append(key, value);
        });
      });

      if (canonicalState.sortExplicit) {
        nextParams.set("sort", canonicalState.sort);
      }

      var nextQuery = nextParams.toString();
      return resourcesPath + (nextQuery ? "?" + nextQuery : "") + window.location.hash;
    }

    function updateHistory(canonicalState) {
      if (!window.history || !window.history.replaceState) return;
      var nextUrl = buildUrl(canonicalState);
      var currentUrl = window.location.pathname + window.location.search + window.location.hash;
      if (nextUrl !== currentUrl) {
        window.history.replaceState({}, "", nextUrl);
      }
    }

    function sortVisibleItems(visibleItems, sortValue) {
      return visibleItems.sort(function (left, right) {
        var leftTitle = left.getAttribute("data-title") || "";
        var rightTitle = right.getAttribute("data-title") || "";

        if (sortValue === "lexicographical") {
          return compareText(leftTitle, rightTitle);
        }

        if (sortValue === "published-asc") {
          return compareDates(left.getAttribute("data-published"), right.getAttribute("data-published"), false) || compareText(leftTitle, rightTitle);
        }

        if (sortValue === "recent-updated-desc") {
          return compareDates(left.getAttribute("data-updated"), right.getAttribute("data-updated"), true) || compareText(leftTitle, rightTitle);
        }

        if (sortValue === "updated-asc") {
          return compareDates(left.getAttribute("data-updated"), right.getAttribute("data-updated"), false) || compareText(leftTitle, rightTitle);
        }

        return compareDates(left.getAttribute("data-published"), right.getAttribute("data-published"), true) || compareText(leftTitle, rightTitle);
      });
    }

    function matchesItem(item, canonicalState) {
      if (!matchesSelection(splitValues(item.getAttribute("data-format")), canonicalState.format)) return false;
      if (!matchesSelection(splitValues(item.getAttribute("data-domain")), canonicalState.domain)) return false;
      if (!matchesSelection(splitValues(item.getAttribute("data-concern")), canonicalState.concern)) return false;
      if (!matchesSelection(splitValues(item.getAttribute("data-tags")), canonicalState.tag)) return false;
      return true;
    }

    function renderActiveFilters(canonicalState) {
      if (!activeFilters) return;

      activeFilters.innerHTML = "";
      var fragment = document.createDocumentFragment();

      ["format", "domain", "concern", "tag"].forEach(function (key) {
        canonicalState[key].forEach(function (value) {
          var chip = document.createElement("button");
          chip.type = "button";
          chip.className = "ifc-active-filters__pill ifc-active-filters__pill--" + key;
          chip.setAttribute("data-clear-filter-value", key + ":" + value);
          chip.textContent = ((groups[key] && groups[key].labels[value]) || value) + " ×";
          fragment.appendChild(chip);
        });
      });

      if (fragment.childNodes.length > 0) {
        var clearButton = document.createElement("button");
        clearButton.type = "button";
        clearButton.className = "ifc-active-filters__clear";
        clearButton.setAttribute("data-clear-all-filters", "true");
        clearButton.textContent = "Clear all";
        fragment.appendChild(clearButton);
      }

      var hasActiveFilters = fragment.childNodes.length > 0;
      activeFilters.appendChild(fragment);
      activeFilters.hidden = !hasActiveFilters;
    }

    function syncMobileStatus(canonicalState) {
      var activeCount = getActiveFilterCount(canonicalState);
      if (mobileCount) {
        mobileCount.hidden = activeCount === 0;
        mobileCount.textContent = String(activeCount);
      }
    }

    function renderResults(canonicalState) {
      var visibleItems = items.filter(function (item) {
        return matchesItem(item, canonicalState);
      });

      sortVisibleItems(visibleItems, canonicalState.sort).forEach(function (item) {
        resultsList.appendChild(item);
        item.hidden = false;
        item.style.display = "";
      });

      items.forEach(function (item) {
        if (visibleItems.indexOf(item) === -1) {
          item.hidden = true;
          item.style.display = "none";
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleItems.length !== 0;
      }

      return visibleItems.length;
    }

    function setMode(resultsMode) {
      landingSections.forEach(function (section) {
        section.hidden = resultsMode;
      });

      if (resultsSection) {
        resultsSection.hidden = false;
      }

      if (resultsHeading) {
        resultsHeading.hidden = resultsMode;
      }

      root.classList.toggle("is-results-mode", resultsMode);
      root.classList.toggle("is-landing-mode", !resultsMode);
    }

    function closeAllMenus() {
      Object.keys(groups).forEach(function (key) {
        var group = groups[key];
        group.node.classList.remove("is-open");
        group.menu.hidden = true;
        group.toggle.setAttribute("aria-expanded", "false");
      });

      sortControls.forEach(function (control) {
        control.node.classList.remove("is-open");
        control.menu.hidden = true;
        control.toggle.setAttribute("aria-expanded", "false");
      });

      openMenu = null;
    }

    function closeMobilePanel() {
      if (!mobilePanel || !mobileToggle) return;
      isMobilePanelOpen = false;
      if (mobileBackdrop) {
        mobileBackdrop.hidden = true;
      }
      mobileToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("ifc-resource-browser--panel-open");
      closeAllMenus();
    }

    function openMobilePanel() {
      if (!mobilePanel || !mobileToggle) return;
      isMobilePanelOpen = true;
      if (mobileBackdrop) {
        mobileBackdrop.hidden = false;
      }
      mobileToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("ifc-resource-browser--panel-open");
    }

    function toggleMenu(control) {
      if (!control) return;

      if (openMenu && openMenu !== control) {
        closeAllMenus();
      }

      var isOpen = control.node.classList.contains("is-open");
      if (isOpen) {
        closeAllMenus();
        return;
      }

      control.node.classList.add("is-open");
      control.menu.hidden = false;
      control.toggle.setAttribute("aria-expanded", "true");
      openMenu = control;
    }

    function applyUiState(nextState) {
      uiState = {
        format: uniqueValues(nextState.format || []),
        domain: uniqueValues(nextState.domain || []),
        concern: uniqueValues(nextState.concern || []),
        tag: uniqueValues(nextState.tag || []),
        sort: nextState.sort || defaultSort,
        sortExplicit: !!nextState.sortExplicit
      };

      updateControls();

      var canonicalState = getCanonicalState();
      var resultsMode = hasActiveState(canonicalState);
      var visibleCount = renderResults(canonicalState);

      setMode(resultsMode);
      renderActiveFilters(canonicalState);
      syncMobileStatus(canonicalState);

      if (summary) {
        if (resultsMode) {
          summary.hidden = false;
          summary.textContent = visibleCount === 1 ? "1 " + resultLabelSingular : visibleCount + " " + resultLabelPlural;
        } else {
          summary.hidden = true;
          summary.textContent = "";
        }
      }

      if (glossaryAction) {
        glossaryAction.hidden = !resultsMode;
      }

      updateHistory(canonicalState);
    }

    function updateMultiSelection(key, selectedValues) {
      var nextState = {
        format: uiState.format.slice(),
        domain: uiState.domain.slice(),
        concern: uiState.concern.slice(),
        tag: uiState.tag.slice(),
        sort: uiState.sort,
        sortExplicit: uiState.sortExplicit
      };

      nextState[key] = uniqueValues(selectedValues);
      applyUiState(nextState);
    }

    function applyShortcutSearch(search) {
      closeAllMenus();
      applyUiState(parseUiState(search));
      scrollToVisibleTarget(isMobileViewport() ? mobileTopTarget : resourceTopTarget, 16);
    }

    root.addEventListener("change", function (event) {
      var option = event.target.closest(".ifc-resource-filter__option input[type='checkbox']");
      if (!option) return;

      var groupKey = option.closest("[data-filter-group]").getAttribute("data-filter-group");
      var nextValues = groups[groupKey].options
        .filter(function (input) {
          return input.checked;
        })
        .map(function (input) {
          return input.value;
        });

      updateMultiSelection(groupKey, nextValues);
    });

    root.addEventListener("click", function (event) {
      var toggle = event.target.closest("[data-filter-toggle]");
      if (toggle) {
        event.preventDefault();
        var controlNode = toggle.closest("[data-filter-group]");
        var key = controlNode.getAttribute("data-filter-group");
        toggleMenu(key === "sort" ? sortControl : groups[key]);
        return;
      }

      var bulkAction = event.target.closest("[data-filter-action]");
      if (bulkAction) {
        event.preventDefault();
        var actionGroup = bulkAction.closest("[data-filter-group]").getAttribute("data-filter-group");
        var action = bulkAction.getAttribute("data-filter-action");
        updateMultiSelection(actionGroup, action === "check-all" ? groups[actionGroup].values.slice() : []);
        return;
      }

      var sortOption = event.target.closest("[data-sort-option]");
      if (sortOption) {
        event.preventDefault();
        var selectedSort = sortOption.getAttribute("data-sort-option");
        applyUiState({
          format: uiState.format,
          domain: uiState.domain,
          concern: uiState.concern,
          tag: uiState.tag,
          sort: selectedSort,
          sortExplicit: true
        });
        closeAllMenus();
        return;
      }

      var clearValue = event.target.closest("[data-clear-filter-value]");
      if (clearValue) {
        event.preventDefault();
        var payload = clearValue.getAttribute("data-clear-filter-value").split(":");
        var clearGroup = payload[0];
        var clearItem = payload[1];
        updateMultiSelection(
          clearGroup,
          uiState[clearGroup].filter(function (value) {
            return value !== clearItem;
          })
        );
        return;
      }

      var clearAll = event.target.closest("[data-clear-all-filters]");
      if (clearAll) {
        event.preventDefault();
        applyUiState({
          format: [],
          domain: [],
          concern: [],
          tag: [],
          sort: defaultSort,
          sortExplicit: false
        });
        closeMobilePanel();
        return;
      }

      var mobileToggleTrigger = event.target.closest("[data-mobile-filter-toggle]");
      if (mobileToggleTrigger) {
        event.preventDefault();
        if (isMobilePanelOpen) {
          closeMobilePanel();
        } else {
          openMobilePanel();
        }
        return;
      }

      var mobileSortToggle = event.target.closest("[data-mobile-sort-toggle]");
      if (mobileSortToggle && mobileSortControl) {
        event.preventDefault();
        toggleMenu(mobileSortControl);
        return;
      }

      var mobileCloseTrigger = event.target.closest("[data-mobile-filter-close]");
      if (mobileCloseTrigger) {
        event.preventDefault();
        closeMobilePanel();
        return;
      }

      var mobileSortOption = event.target.closest("[data-mobile-sort-option]");
      if (mobileSortOption) {
        event.preventDefault();
        var selectedMobileSort = mobileSortOption.getAttribute("data-mobile-sort-option");
        applyUiState({
          format: uiState.format,
          domain: uiState.domain,
          concern: uiState.concern,
          tag: uiState.tag,
          sort: selectedMobileSort,
          sortExplicit: true
        });
        closeAllMenus();
        return;
      }

      var shortcut = event.target.closest("a[data-resource-shortcut], a[href]");
      if (shortcut) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        var shortcutUrl = new URL(shortcut.href, window.location.origin);
        if (shortcutUrl.origin === window.location.origin && shortcutUrl.pathname === resourcesPath) {
          event.preventDefault();
          applyShortcutSearch(shortcutUrl.search);
          closeMobilePanel();
        }
      }
    });

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener("click", closeMobilePanel);
    }

    document.addEventListener("click", function (event) {
      if (openMenu && !openMenu.node.contains(event.target)) {
        closeAllMenus();
      }

      if (isMobilePanelOpen && mobilePanel && !mobilePanel.contains(event.target) && (!mobileToggle || !mobileToggle.contains(event.target))) {
        closeMobilePanel();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (openMenu) {
        closeAllMenus();
      } else if (isMobilePanelOpen) {
        closeMobilePanel();
      }
    });

    window.addEventListener("popstate", function () {
      closeAllMenus();
      closeMobilePanel();
      applyUiState(parseUiState(window.location.search));
    });

    window.addEventListener("resize", updateControls);
    applyUiState(parseUiState(window.location.search));
  }

  document.querySelectorAll("[data-filter-browser]").forEach(setupBrowser);
  document.querySelectorAll("[data-glossary-browser]").forEach(setupGlossaryBrowser);
  document.querySelectorAll("[data-resource-browser]").forEach(setupResourceBrowser);
})();
