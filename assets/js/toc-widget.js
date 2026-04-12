(function () {
  const widgets = Array.from(document.querySelectorAll("[data-toc-widget]"));

  if (!widgets.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 767px)");
  const masthead = document.querySelector(".masthead");

  function clampLevel(value, fallback) {
    const number = Number.parseInt(value, 10);

    if (Number.isNaN(number)) {
      return fallback;
    }

    return Math.max(1, Math.min(6, number));
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/['".,()/:[\]!?]+/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getScrollOffset() {
    const rootOffset = window.getComputedStyle(document.documentElement).getPropertyValue("--ifc-masthead-offset");
    const parsedOffset = Number.parseFloat(rootOffset);

    if (!Number.isNaN(parsedOffset) && parsedOffset > 0) {
      return parsedOffset + 12;
    }

    if (!masthead) {
      return 12;
    }

    return Math.ceil(masthead.getBoundingClientRect().height) + 12;
  }

  function getAbsoluteTop(element) {
    return Math.round(element.getBoundingClientRect().top + window.scrollY);
  }

  function isMobileViewport() {
    return mobileQuery.matches;
  }

  function scrollToTarget(target) {
    const top = Math.max(0, getAbsoluteTop(target) - getScrollOffset());

    window.scrollTo({
      top: top,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth"
    });
  }

  function scrollToPageTop() {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth"
    });
  }

  function getHeadingLabel(heading) {
    const clone = heading.cloneNode(true);

    Array.from(clone.querySelectorAll(".header-link, .sr-only")).forEach(function (node) {
      node.remove();
    });

    return (clone.textContent || "").replace(/\s+/g, " ").trim();
  }

  function initWidget(widget) {
    const toggle = widget.querySelector("[data-toc-widget-toggle]");
    const panel = widget.querySelector("[data-toc-widget-panel]");
    const closeButton = widget.querySelector("[data-toc-widget-close]");
    const list = widget.querySelector("[data-toc-widget-list]");
    const page = widget.closest(".page");
    const content = page ? page.querySelector(".page__content") : null;
    const topTarget = content || page;
    const pageFooter = document.querySelector(".page__footer");
    const minLevel = clampLevel(widget.dataset.minLevel, 2);
    const maxLevel = Math.max(minLevel, clampLevel(widget.dataset.maxLevel, 4));
    const minHeadings = Math.max(1, Number.parseInt(widget.dataset.minHeadings || "2", 10));
    const selectors = [];
    let items = [];
    let activeId = "";
    let isOpen = false;
    let scrollTicking = false;

    if (!toggle || !panel || !list || !topTarget || !content) {
      widget.hidden = true;
      return;
    }

    if (widget.parentNode !== document.body) {
      document.body.appendChild(widget);
    }

    for (let level = minLevel; level <= maxLevel; level += 1) {
      selectors.push("h" + level);
    }

    function hideWidget() {
      widget.hidden = true;
      closePanel();
    }

    function ensureId(heading, usedIds) {
      if (heading.id) {
        usedIds.add(heading.id);
        return heading.id;
      }

      const base = slugify(heading.textContent || "") || "section";
      let candidate = base;
      let index = 2;

      while (usedIds.has(candidate) || document.getElementById(candidate)) {
        candidate = base + "-" + index;
        index += 1;
      }

      heading.id = candidate;
      usedIds.add(candidate);
      return candidate;
    }

    function buildItem(target, label, level, id) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ifc-toc-widget__link";
      button.dataset.targetId = id;
      button.textContent = label;

      if (level > 0) {
        button.classList.add("ifc-toc-widget__link--level-" + level);
      }

      button.addEventListener("click", function () {
        if (id === "top") {
          scrollToPageTop();
        } else {
          scrollToTarget(target);
        }

        if (isMobileViewport()) {
          closePanel();
        }
      });

      item.appendChild(button);
      return item;
    }

    function render() {
      const usedIds = new Set(Array.from(document.querySelectorAll("[id]"), function (element) {
        return element.id;
      }));

      const headings = Array.from(content.querySelectorAll(selectors.join(","))).filter(function (heading) {
        const label = getHeadingLabel(heading);

        if (!label) {
          return false;
        }

        return !heading.closest(".sidebar__right, .toc, nav, aside:not(.sidebar__right), .page__meta, footer");
      });

      items = headings.map(function (heading) {
        const level = Number.parseInt(heading.tagName.slice(1), 10);

        return {
          id: ensureId(heading, usedIds),
          label: getHeadingLabel(heading),
          level: level,
          target: heading
        };
      });

      if (items.length < minHeadings) {
        hideWidget();
        return;
      }

      widget.hidden = false;
      list.innerHTML = "";
      list.appendChild(buildItem(topTarget, "Top", 0, "top"));

      items.forEach(function (item) {
        list.appendChild(buildItem(item.target, item.label, item.level, item.id));
      });

      syncPlacement();
      syncFooterClearance();
      updateActiveItem();
    }

    function syncPlacement() {
      const shouldUseSidePanel = !isMobileViewport() && window.innerHeight < 640 && window.innerWidth >= 1100;
      widget.classList.toggle("is-panel-side", shouldUseSidePanel);
    }

    function syncFooterClearance() {
      if (!pageFooter) {
        widget.style.setProperty("--ifc-toc-widget-lift", "0px");
        return;
      }

      const footerRect = pageFooter.getBoundingClientRect();
      const widgetStyles = window.getComputedStyle(widget);
      const baseBottom = Number.parseFloat(widgetStyles.getPropertyValue("--ifc-toc-widget-base-bottom")) || 0;
      const requiredLift = Math.max(0, Math.ceil(window.innerHeight - footerRect.top + 16 - baseBottom));

      widget.style.setProperty("--ifc-toc-widget-lift", requiredLift + "px");
    }

    function syncBodyLock() {
      document.body.classList.toggle("ifc-toc-widget--overlay-open", isOpen && isMobileViewport());
    }

    function openPanel() {
      isOpen = true;
      widget.dataset.open = "true";
      toggle.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      syncBodyLock();
    }

    function closePanel() {
      isOpen = false;
      widget.dataset.open = "false";
      toggle.setAttribute("aria-expanded", "false");
      panel.hidden = true;
      syncBodyLock();
    }

    function togglePanel() {
      if (isOpen) {
        closePanel();
        return;
      }

      openPanel();
    }

    function updateActiveItem() {
      if (!items.length) {
        return;
      }

      const marker = window.scrollY + getScrollOffset() + 16;
      const documentBottom = Math.ceil(window.scrollY + window.innerHeight);
      const pageBottom = Math.ceil(document.documentElement.scrollHeight);
      let nextActiveId = "top";

      items.forEach(function (item) {
        if (getAbsoluteTop(item.target) <= marker) {
          nextActiveId = item.id;
        }
      });

      if (documentBottom >= pageBottom - 4) {
        nextActiveId = items[items.length - 1].id;
      }

      if (activeId === nextActiveId) {
        return;
      }

      activeId = nextActiveId;

      Array.from(list.querySelectorAll(".ifc-toc-widget__link")).forEach(function (button) {
        const isActive = button.dataset.targetId === activeId;
        button.classList.toggle("is-active", isActive);

        if (isActive) {
          button.setAttribute("aria-current", "true");

          if (isOpen) {
            button.scrollIntoView({ block: "nearest", inline: "nearest" });
          }
        } else {
          button.removeAttribute("aria-current");
        }
      });
    }

    toggle.addEventListener("click", function () {
      togglePanel();
    });

    closeButton.addEventListener("click", function () {
      closePanel();
      toggle.focus();
    });

    document.addEventListener("click", function (event) {
      if (!isOpen) {
        return;
      }

      if (widget.contains(event.target)) {
        return;
      }

      closePanel();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !isOpen) {
        return;
      }

      closePanel();
      toggle.focus();
    });

    window.addEventListener("resize", function () {
      syncPlacement();
      syncBodyLock();
      syncFooterClearance();
      updateActiveItem();
    });

    window.addEventListener("orientationchange", function () {
      syncPlacement();
      syncBodyLock();
      syncFooterClearance();
      updateActiveItem();
    });

    window.addEventListener("scroll", function () {
      if (scrollTicking) {
        return;
      }

      scrollTicking = true;
      window.requestAnimationFrame(function () {
        scrollTicking = false;
        syncFooterClearance();
        updateActiveItem();
      });
    }, { passive: true });

    window.addEventListener("load", function () {
      render();
      syncFooterClearance();
      updateActiveItem();
    });

    render();
    syncFooterClearance();
    closePanel();
  }

  widgets.forEach(initWidget);
})();
