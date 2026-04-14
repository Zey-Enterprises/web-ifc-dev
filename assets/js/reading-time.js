(function () {
  const WORDS_PER_MINUTE = 225;
  const readingTimes = Array.from(document.querySelectorAll("[data-reading-time]"));

  if (!readingTimes.length) {
    return;
  }
  const excludedSelectors = [
    ".sidebar__right",
    ".toc",
    "nav",
    "[data-bibliography]",
    ".ifc-bibliography",
    ".footnotes",
    ".footnote-backref",
    ".reversefootnote",
    "[data-annotation-popover]",
    ".screen-reader-text",
    ".sr-only",
    "script",
    "style",
    "noscript",
    "template",
    "[hidden]"
  ];

  readingTimes.forEach(function (readingTime) {
    const article = readingTime.closest(".page__inner-wrap");
    const bodySelector = readingTime.getAttribute("data-reading-time-body-selector") || ".page__content";
    const articleBody = article ? article.querySelector(bodySelector) : document.querySelector(bodySelector);

    if (!articleBody) {
      return;
    }

    const content = articleBody.cloneNode(true);

    content.querySelectorAll(excludedSelectors.join(",")).forEach(function (node) {
      node.remove();
    });

    const text = (content.textContent || "").replace(/\s+/gu, " ").trim();

    if (!text) {
      return;
    }

    const words = text.split(" ").length;

    if (!words) {
      return;
    }

    const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
    const label = readingTime.querySelector("[data-reading-time-label]");

    if (!label) {
      return;
    }

    label.textContent = "Estimated reading time: " + minutes + " " + (minutes === 1 ? "minute" : "minutes");
    readingTime.hidden = false;
    readingTime.removeAttribute("aria-hidden");
  });
})();
