(function () {
  var platformConfig;
  var loadingScripts = {};

  function getPlatformConfig() {
    var configElement;

    if (platformConfig) return platformConfig;

    configElement = document.querySelector("[data-visual-embed-config]");
    platformConfig = {};

    if (!configElement) return platformConfig;

    try {
      platformConfig = JSON.parse(configElement.textContent || "{}");
    } catch (error) {
      platformConfig = {};
    }

    if (platformConfig.facebook && configElement.dataset.facebookAppId) {
      platformConfig.facebook.app_id = configElement.dataset.facebookAppId;
    }

    return platformConfig;
  }

  function ensureRoot(id) {
    var root;

    if (!id || document.getElementById(id)) return;

    root = document.createElement("div");
    root.id = id;
    document.body.insertBefore(root, document.body.firstChild);
  }

  function appendQuery(url, key, value) {
    var separator;

    if (!url || !key || !value || url.indexOf(key + "=") !== -1) return url;

    separator = url.indexOf("?") === -1 && url.indexOf("#") === -1 ? "?" : "&";
    return url + separator + encodeURIComponent(key) + "=" + encodeURIComponent(value);
  }

  function loadPlatformScript(platformKey) {
    var config = getPlatformConfig()[platformKey];
    var embedConfig = config && config.embed;
    var scriptId = embedConfig && embedConfig.script_id;
    var scriptUrl = embedConfig && embedConfig.script_url;
    var existingScript;
    var script;

    if (!embedConfig || embedConfig.supported === false || !scriptUrl) {
      return Promise.resolve();
    }

    ensureRoot(embedConfig.root_id);

    if (platformKey === "facebook" && config.app_id) {
      scriptUrl = appendQuery(scriptUrl, "appId", config.app_id);
    }

    if (loadingScripts[platformKey]) return loadingScripts[platformKey];

    if (scriptId) {
      existingScript = document.getElementById(scriptId);
      if (existingScript) {
        loadingScripts[platformKey] = new Promise(function (resolve) {
          if (existingScript.dataset.visualMediaLoaded === "true" || existingScript.readyState === "complete") {
            resolve();
            return;
          }

          existingScript.addEventListener("load", function () {
            existingScript.dataset.visualMediaLoaded = "true";
            resolve();
          }, { once: true });
          existingScript.addEventListener("error", resolve, { once: true });
          window.setTimeout(resolve, 2000);
        });
        return loadingScripts[platformKey];
      }
    }

    loadingScripts[platformKey] = new Promise(function (resolve) {
      script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.src = scriptUrl;
      if (scriptId) script.id = scriptId;
      script.onload = function () {
        script.dataset.visualMediaLoaded = "true";
        resolve();
      };
      script.onerror = resolve;
      document.body.appendChild(script);
    });

    return loadingScripts[platformKey];
  }

  function refreshPlatformEmbeds(panel) {
    var embedElements;
    var platforms = {};

    if (!panel) return;

    embedElements = Array.prototype.slice.call(panel.querySelectorAll("[data-platform-embed]"));

    embedElements.forEach(function (element) {
      var platformKey = element.getAttribute("data-platform-embed");
      if (platformKey) platforms[platformKey] = true;
    });

    applyEmbedSizing(panel);

    Object.keys(platforms).forEach(function (platformKey) {
      loadPlatformScript(platformKey).then(function () {
        applyEmbedSizing(panel);
        if (platformKey === "facebook" && window.FB && window.FB.XFBML && typeof window.FB.XFBML.parse === "function") {
          window.FB.XFBML.parse(panel);
        } else if (platformKey === "instagram" && window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === "function") {
          window.instgrm.Embeds.process();
        } else if (platformKey === "x" && window.twttr && window.twttr.widgets && typeof window.twttr.widgets.load === "function") {
          window.twttr.widgets.load(panel);
        }
        scheduleEmbedSizing(panel);
      });
    });

    scheduleEmbedSizing(panel);
  }

  function cssLengthToNumber(value) {
    var parsed = parseFloat(value);
    return Number.isFinite(parsed) ? String(Math.round(parsed)) : "";
  }

  function applyEmbedSizing(scope) {
    var shells;

    if (!scope) return;

    shells = Array.prototype.slice.call(scope.querySelectorAll("[data-visual-embed-shell]"));

    shells.forEach(function (shell) {
      var computedStyle = window.getComputedStyle(shell);
      var width = (computedStyle.getPropertyValue("--ifc-platform-embed-width") || "").trim();
      var height = (computedStyle.getPropertyValue("--ifc-platform-embed-height") || "").trim();
      var platformEmbed = shell.querySelector("[data-platform-embed]");
      var platformKey = shell.getAttribute("data-visual-platform") || platformEmbed && platformEmbed.getAttribute("data-platform-embed");
      var candidates = [];
      var dataWidth = (shell.getAttribute("data-visual-embed-width") || "").trim();
      var dataHeight = (shell.getAttribute("data-visual-embed-height") || "").trim();
      var widthNumber;
      var constrainedWidth;
      var iframe;

      if (dataWidth) width = dataWidth;
      if (dataHeight) height = dataHeight;
      widthNumber = cssLengthToNumber(width);
      constrainedWidth = width ? "min(" + width + ", calc(100vw - 2rem))" : "min(100%, calc(100vw - 2rem))";

      if (width) {
        shell.style.width = constrainedWidth;
        shell.style.maxWidth = "100%";
      }

      if (platformEmbed && widthNumber) {
        if (platformKey === "facebook" && platformEmbed.classList.contains("fb-post")) {
          platformEmbed.setAttribute("data-width", widthNumber);
        } else if (platformKey === "x" && platformEmbed.classList.contains("twitter-tweet")) {
          platformEmbed.setAttribute("data-width", widthNumber);
          platformEmbed.style.width = "100%";
        } else if (platformKey === "linkedin") {
          platformEmbed.style.justifySelf = "stretch";
        }
      }

      candidates = candidates.concat(Array.prototype.slice.call(shell.querySelectorAll(
        ".instagram-media, .twitter-tweet, .twitter-tweet-rendered, .fb_iframe_widget, .fb_iframe_widget span, iframe"
      )));

      if (platformEmbed && candidates.indexOf(platformEmbed) === -1) {
        candidates.push(platformEmbed);
      }

      candidates.forEach(function (element) {
        element.style.maxWidth = "100%";
        element.style.marginLeft = "auto";
        element.style.marginRight = "auto";
        element.style.minWidth = "0";

        if (platformKey === "facebook" && width) {
          element.style.width = constrainedWidth;
        } else if (platformKey === "linkedin") {
          element.style.width = "100%";
        }

        if (platformKey === "linkedin" && height && element.tagName && element.tagName.toLowerCase() === "iframe") {
          element.style.height = "100%";
        }
      });

      if (platformKey === "linkedin" && height) {
        shell.style.setProperty("--ifc-platform-embed-height", height);
        iframe = shell.querySelector("iframe");
        if (iframe) {
          iframe.setAttribute("height", cssLengthToNumber(height));
          if (widthNumber) iframe.setAttribute("width", widthNumber);
        }
      }

      updateEmbedLoadingState(shell);
    });
  }

  function hasRenderedEmbedBox(element, minimumHeight) {
    var rect;
    var style;

    if (!element) return false;

    rect = element.getBoundingClientRect();
    style = window.getComputedStyle(element);

    return rect.width > 0 &&
      rect.height >= minimumHeight &&
      style.display !== "none" &&
      style.visibility !== "hidden";
  }

  function isEmbedLoaded(shell) {
    var platformKey;

    if (!shell) return false;

    platformKey = shell.getAttribute("data-visual-platform");

    if (platformKey === "facebook") {
      return hasRenderedEmbedBox(shell.querySelector(".fb_iframe_widget iframe"), 80) ||
        hasRenderedEmbedBox(shell.querySelector(".fb_iframe_widget"), 80);
    }

    if (platformKey === "instagram") {
      return hasRenderedEmbedBox(shell.querySelector("iframe"), 80) ||
        hasRenderedEmbedBox(shell.querySelector(".instagram-media-registered"), 80);
    }

    if (platformKey === "x") {
      return hasRenderedEmbedBox(shell.querySelector("iframe"), 80) ||
        hasRenderedEmbedBox(shell.querySelector(".twitter-tweet-rendered"), 80);
    }

    if (platformKey === "linkedin" || platformKey === "youtube") {
      return !!shell.querySelector("iframe");
    }

    return hasRenderedEmbedBox(shell.querySelector("[data-platform-embed]"), 80);
  }

  function updateEmbedLoadingState(shell) {
    if (!shell || !shell.hasAttribute("data-visual-embed-shell")) return;

    shell.setAttribute("data-visual-embed-state", isEmbedLoaded(shell) ? "loaded" : "loading");
  }

  function updateEmbedLoadingStates(scope) {
    if (!scope) return;

    Array.prototype.forEach.call(scope.querySelectorAll("[data-visual-embed-shell]"), updateEmbedLoadingState);
  }

  function scheduleEmbedSizing(scope) {
    applyEmbedSizing(scope);
    updateEmbedLoadingStates(scope);

    window.requestAnimationFrame(function () {
      applyEmbedSizing(scope);
      updateEmbedLoadingStates(scope);
    });

    window.setTimeout(function () {
      applyEmbedSizing(scope);
      updateEmbedLoadingStates(scope);
    }, 300);

    window.setTimeout(function () {
      applyEmbedSizing(scope);
      updateEmbedLoadingStates(scope);
    }, 1200);

    window.setTimeout(function () {
      applyEmbedSizing(scope);
      updateEmbedLoadingStates(scope);
    }, 3000);
  }

  function preloadPlatformEmbeds(scope) {
    var embedElements;
    var platforms = {};

    if (!scope) return;

    embedElements = Array.prototype.slice.call(scope.querySelectorAll("[data-platform-embed]"));

    embedElements.forEach(function (element) {
      var platformKey = element.getAttribute("data-platform-embed");
      if (platformKey) platforms[platformKey] = true;
    });

    window.setTimeout(function () {
      Object.keys(platforms).forEach(function (platformKey) {
        loadPlatformScript(platformKey).then(function () {
          if (platformKey === "facebook" && window.FB && window.FB.XFBML && typeof window.FB.XFBML.parse === "function") {
            window.FB.XFBML.parse(scope);
          } else if (platformKey === "instagram" && window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === "function") {
            window.instgrm.Embeds.process();
          } else if (platformKey === "x" && window.twttr && window.twttr.widgets && typeof window.twttr.widgets.load === "function") {
            window.twttr.widgets.load(scope);
          }
          scheduleEmbedSizing(scope);
        });
      });
    }, 0);
  }

  function setupCarousel(root) {
    if (root.dataset.visualCarouselReady === "true") return;

    var viewport = root.querySelector("[data-visual-carousel-viewport]");
    var track = root.querySelector("[data-visual-carousel-track]");
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-visual-carousel-slide]"));
    var firstButton = root.querySelector("[data-visual-carousel-first]");
    var prevButton = root.querySelector("[data-visual-carousel-prev]");
    var nextButton = root.querySelector("[data-visual-carousel-next]");
    var lastButton = root.querySelector("[data-visual-carousel-last]");
    var count = root.querySelector("[data-visual-carousel-count]");
    var shouldLoop = root.getAttribute("data-visual-carousel-loop") === "true";
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var scrollFrame;
    var index = 0;

    if (!viewport || !track || slides.length < 2) return;

    function normalizeIndex(nextIndex) {
      if (!shouldLoop) {
        return Math.max(0, Math.min(slides.length - 1, nextIndex));
      }

      if (nextIndex < 0) return slides.length - 1;
      if (nextIndex >= slides.length) return 0;
      return nextIndex;
    }

    function render() {
      slides.forEach(function (slide, slideIndex) {
        var isActive = slideIndex === index;
        var previousIndex = shouldLoop || index > 0 ? normalizeIndex(index - 1) : -1;
        var nextIndex = shouldLoop || index < slides.length - 1 ? normalizeIndex(index + 1) : -1;
        slide.classList.toggle("is-active", isActive);
        slide.classList.toggle("is-prev", slideIndex === previousIndex);
        slide.classList.toggle("is-next", slideIndex === nextIndex);
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      if (count) {
        count.textContent = index + 1 + " / " + slides.length;
      }

      if (firstButton) firstButton.disabled = index === 0;
      if (lastButton) lastButton.disabled = index === slides.length - 1;
      if (prevButton) prevButton.disabled = !shouldLoop && index === 0;
      if (nextButton) nextButton.disabled = !shouldLoop && index === slides.length - 1;
    }

    function scrollToIndex(targetIndex, behavior) {
      var targetSlide = slides[targetIndex];
      var scrollBehavior;
      var targetLeft;
      var maxScrollLeft;

      if (!targetSlide) return;

      scrollBehavior = reduceMotion ? "auto" : behavior || "auto";
      targetLeft = targetSlide.offsetLeft - viewport.offsetLeft + targetSlide.offsetWidth / 2 - viewport.clientWidth / 2;
      maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      targetLeft = Math.max(0, Math.min(maxScrollLeft, targetLeft));

      viewport.scrollTo({
        left: targetLeft,
        behavior: scrollBehavior,
      });

      if (scrollBehavior === "auto") {
        window.requestAnimationFrame(syncFromScroll);
      }
    }

    function focusRoot() {
      if (typeof root.focus !== "function") return;

      try {
        root.focus({ preventScroll: true });
      } catch (error) {
        root.focus();
      }
    }

    function goTo(nextIndex, options) {
      var normalizedIndex = normalizeIndex(nextIndex);
      var shouldFocusRoot = options && options.focusRoot;

      scrollToIndex(normalizedIndex, options && options.behavior);

      if (shouldFocusRoot) {
        focusRoot();
      }
    }

    function closestSlideIndex() {
      var viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
      var closestIndex = index;
      var closestDistance = Infinity;

      slides.forEach(function (slide, slideIndex) {
        var slideCenter = slide.offsetLeft - viewport.offsetLeft + slide.offsetWidth / 2;
        var distance = Math.abs(slideCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = slideIndex;
        }
      });

      return closestIndex;
    }

    function syncFromScroll() {
      scrollFrame = null;

      var nextIndex = closestSlideIndex();

      if (nextIndex !== index) {
        index = nextIndex;
        render();
      }
    }

    function scheduleScrollUpdate() {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(syncFromScroll);
    }

    viewport.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
    viewport.addEventListener("scrollend", syncFromScroll);

    if (firstButton) {
      firstButton.addEventListener("click", function () {
        goTo(0);
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        goTo(closestSlideIndex() - 1, { behavior: "smooth" });
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        goTo(closestSlideIndex() + 1, { behavior: "smooth" });
      });
    }

    if (lastButton) {
      lastButton.addEventListener("click", function () {
        goTo(slides.length - 1);
      });
    }

    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(closestSlideIndex() - 1, { behavior: "smooth" });
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(closestSlideIndex() + 1, { behavior: "smooth" });
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(slides.length - 1);
      }
    });

    window.addEventListener("resize", function () {
      window.requestAnimationFrame(function () {
        scrollToIndex(index, "auto");
        window.requestAnimationFrame(syncFromScroll);
      });
    });

    slides.forEach(function (slide) {
      Array.prototype.forEach.call(slide.querySelectorAll("img"), function (image) {
        if (image.complete) return;
        image.addEventListener("load", function () {
          scrollToIndex(index, "auto");
          window.requestAnimationFrame(syncFromScroll);
        }, { once: true });
        image.addEventListener("error", syncFromScroll, { once: true });
      });
    });

    root.classList.add("is-ready");
    root.dataset.visualCarouselReady = "true";
    render();
    window.requestAnimationFrame(function () {
      scrollToIndex(index, "auto");
      window.requestAnimationFrame(syncFromScroll);
    });
    root.visualCarouselRender = function () {
      scrollToIndex(index, "auto");
      window.requestAnimationFrame(syncFromScroll);
    };
  }

  function setupViewer(viewer) {
    if (viewer.dataset.visualViewerReady === "true") return;

    var tabs = Array.prototype.slice.call(viewer.querySelectorAll("[data-visual-tab]"));
    var panels = Array.prototype.slice.call(viewer.querySelectorAll("[data-visual-panel]"));
    var tabsContainer = viewer.querySelector(".ifc-visual-tabs");
    var tabsRail = viewer.querySelector(".ifc-visual-tabs__rail");

    if (!tabs.length || !panels.length) return;

    function updateTabRailMetrics() {
      var containerRect;
      var railRect;
      var solidStart;
      var solidEnd;

      if (!tabsContainer || !tabsRail) return;

      containerRect = tabsContainer.getBoundingClientRect();
      railRect = tabsRail.getBoundingClientRect();
      solidStart = Math.max(0, railRect.left - containerRect.left);
      solidEnd = Math.min(containerRect.width, railRect.right - containerRect.left);

      tabsContainer.style.setProperty("--ifc-visual-tabs-solid-start", solidStart + "px");
      tabsContainer.style.setProperty("--ifc-visual-tabs-solid-end", solidEnd + "px");
    }

    function activateTab(tab, shouldFocus) {
      var key = tab.getAttribute("data-visual-tab-key");

      tabs.forEach(function (candidate) {
        var isActive = candidate === tab;
        candidate.classList.toggle("is-active", isActive);
        candidate.setAttribute("aria-selected", isActive ? "true" : "false");
        candidate.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      panels.forEach(function (panel) {
        var isActive = panel.getAttribute("data-visual-panel-key") === key;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
        panel.setAttribute("aria-hidden", isActive ? "false" : "true");

        if (isActive) {
          Array.prototype.forEach.call(panel.querySelectorAll("[data-visual-carousel]"), function (carousel) {
            if (typeof carousel.visualCarouselRender === "function") {
              window.requestAnimationFrame(carousel.visualCarouselRender);
            }
          });
          refreshPlatformEmbeds(panel);
        }
      });

      if (shouldFocus) {
        tab.focus();
      }
    }

    function getRequestedInitialViewKey() {
      var params;
      var requested;

      if (!window.location || !window.location.search) return "";

      try {
        params = new window.URLSearchParams(window.location.search);
        requested = params.get("view");
      } catch (error) {
        requested = "";
      }

      requested = (requested || "").toLowerCase().trim();
      if (requested === "twitter") return "x";
      return requested;
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activateTab(tab, false);
      });

      tab.addEventListener("keydown", function (event) {
        var nextIndex = index;

        if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        activateTab(tabs[nextIndex], true);
      });
    });

    viewer.classList.add("is-enhanced");
    viewer.dataset.visualViewerReady = "true";

    var requestedInitialViewKey = getRequestedInitialViewKey();
    var requestedInitialTab = requestedInitialViewKey ? tabs.filter(function (tab) {
      return (tab.getAttribute("data-visual-tab-key") || "").toLowerCase() === requestedInitialViewKey;
    })[0] : null;
    var activeTab = requestedInitialTab || tabs.filter(function (tab) {
      return tab.getAttribute("aria-selected") === "true";
    })[0] || tabs[0];

    preloadPlatformEmbeds(viewer);
    activateTab(activeTab, false);
    updateTabRailMetrics();
    window.addEventListener("resize", updateTabRailMetrics);
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-visual-carousel]"), setupCarousel);
    Array.prototype.forEach.call(document.querySelectorAll("[data-visual-viewer]"), setupViewer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
