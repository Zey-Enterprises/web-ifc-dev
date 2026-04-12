(function () {
  const WORDS_PER_MINUTE = 225;
  const readingTime = document.querySelector("[data-reading-time]");
  const article = readingTime && readingTime.closest(".page__inner-wrap");

  if (!readingTime) {
    return;
  }

  const bodySelector = readingTime.getAttribute("data-reading-time-body-selector") || ".page__content";
  const articleBody = article ? article.querySelector(bodySelector) : document.querySelector(bodySelector);

  if (!articleBody) {
    return;
  }

  const content = articleBody.cloneNode(true);
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

  label.textContent = "Estimated reading time: " + minutes + " minutes";
  readingTime.hidden = false;
  readingTime.removeAttribute("aria-hidden");
})();
