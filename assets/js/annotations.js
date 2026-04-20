/*
  Shared annotation behavior for glossary and citation popovers.

  Responsibilities:
  - support hover and focus on desktop
  - support tap/click toggling on touch devices
  - dismiss on outside click and Escape
  - keep popovers within the viewport as reasonably as possible

  Markup contract:
  - root: [data-annotation]
  - trigger: [data-annotation-trigger]
  - popover: [data-annotation-popover]
*/

(function () {
  const annotations = Array.from(document.querySelectorAll("[data-annotation]"));
  const glossaryData = (window.IFC_ANNOTATIONS && window.IFC_ANNOTATIONS.glossary) || {};
  const citationData = (window.IFC_ANNOTATIONS && window.IFC_ANNOTATIONS.citation) || {};
  const pageCitations = (window.IFC_ANNOTATIONS && window.IFC_ANNOTATIONS.pageCitations) || {};

  decorateExternalLinks(document);

  if (!annotations.length) {
    return;
  }

  const viewportMargin = 12;
  const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
  const WORD_JOINER = "\u2060";
  let activePinned = null;
  let lastPopoverLinkHandledAt = 0;
  document.documentElement.classList.add("ifc-annotations-enhanced");

  function syncPinnedMode() {
    document.documentElement.classList.toggle("ifc-annotation-pinned", !!activePinned);
  }

  function getParts(annotation) {
    return {
      trigger: annotation.querySelector("[data-annotation-trigger]"),
      popover: annotation.querySelector("[data-annotation-popover]"),
      heading: annotation.querySelector(".ifc-annotation__heading"),
      body: annotation.querySelector(".ifc-annotation__body"),
      extra: annotation.querySelector(".ifc-annotation__extra"),
      back: annotation.querySelector("[data-annotation-back]"),
      close: annotation.querySelector("[data-annotation-close]")
    };
  }

  function getEventElement(event) {
    const target = event.target;

    if (!target) {
      return null;
    }

    if (target.nodeType === Node.ELEMENT_NODE) {
      return target;
    }

    if (target.nodeType === Node.TEXT_NODE) {
      return target.parentElement || null;
    }

    return null;
  }

  function normalizeGlossarySpacing() {
    annotations.forEach(function (annotation) {
      let sibling = annotation.nextSibling;

      while (sibling && sibling.nodeType === Node.COMMENT_NODE) {
        sibling = sibling.nextSibling;
      }

      if (!sibling || sibling.nodeType !== Node.TEXT_NODE || !sibling.nodeValue) {
        return;
      }

      if (/^\s+$/u.test(sibling.nodeValue)) {
        sibling.nodeValue = "";
        return;
      }

      sibling.nodeValue = sibling.nodeValue.replace(/^(\s+)([.,;:!?"'“”‘’)\]}\u2014\u2013-])/u, "$2");
    });
  }

  function previousSignificantSibling(node) {
    let sibling = node ? node.previousSibling : null;

    while (
      sibling &&
      (
        sibling.nodeType === Node.COMMENT_NODE ||
        (sibling.nodeType === Node.TEXT_NODE && !sibling.nodeValue.replace(/\u2060/g, "").trim())
      )
    ) {
      sibling = sibling.previousSibling;
    }

    return sibling;
  }

  function nextSignificantSibling(node) {
    let sibling = node ? node.nextSibling : null;

    while (
      sibling &&
      (
        sibling.nodeType === Node.COMMENT_NODE ||
        (sibling.nodeType === Node.TEXT_NODE && !sibling.nodeValue.replace(/\u2060/g, "").trim())
      )
    ) {
      sibling = sibling.nextSibling;
    }

    return sibling;
  }

  function appendWordJoinerToTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE || !node.nodeValue) {
      return false;
    }

    if (/\s$/u.test(node.nodeValue) || node.nodeValue.endsWith(WORD_JOINER)) {
      return false;
    }

    node.nodeValue += WORD_JOINER;
    return true;
  }

  function prependWordJoinerToNode(node) {
    if (!node || !node.parentNode) {
      return false;
    }

    const previous = previousSignificantSibling(node);

    if (previous && previous.nodeType === Node.TEXT_NODE) {
      return appendWordJoinerToTextNode(previous);
    }

    if (previous && previous.nodeType === Node.ELEMENT_NODE) {
      node.parentNode.insertBefore(document.createTextNode(WORD_JOINER), node);
      return true;
    }

    return false;
  }

  function bindAnnotationLineWrapping() {
    annotations.forEach(function (annotation) {
      const previous = previousSignificantSibling(annotation);
      const next = nextSignificantSibling(annotation);

      if (annotation.dataset.annotationKind === "citation") {
        prependWordJoinerToNode(annotation);
      }

      if (next && next.nodeType === Node.TEXT_NODE && next.nodeValue) {
        const trimmed = next.nodeValue.replace(/^(\s+)([.,;:!?"'“”‘’)\]}\u2014\u2013-])/u, "$2");

        if (trimmed !== next.nodeValue) {
          next.nodeValue = trimmed;
        }

        if (/^[.,;:!?"'“”‘’)\]}\u2014\u2013-]/u.test(next.nodeValue) && !next.nodeValue.startsWith(WORD_JOINER)) {
          next.nodeValue = WORD_JOINER + next.nodeValue;
        }
      } else if (next && next.nodeType === Node.ELEMENT_NODE && next.matches("[data-annotation]")) {
        prependWordJoinerToNode(next);
      }

      if (annotation.dataset.annotationKind === "glossary" && previous && previous.nodeType === Node.TEXT_NODE && previous.nodeValue) {
        previous.nodeValue = previous.nodeValue.replace(/\s+$/u, function (match) {
          return /\s/u.test(match) ? match : "";
        });
      }
    });
  }

  function normalizeCitationSeparatorSpacing() {
    const separators = Array.from(document.querySelectorAll(".ifc-citation-marker"));

    separators.forEach(function (marker) {
      if ((marker.textContent || "").trim() !== ",") {
        return;
      }

      marker.classList.add("ifc-citation-marker--sep");

      let previous = marker.previousSibling;

      while (previous && previous.nodeType === Node.COMMENT_NODE) {
        previous = previous.previousSibling;
      }

      if (previous && previous.nodeType === Node.TEXT_NODE && previous.nodeValue) {
        previous.nodeValue = previous.nodeValue.replace(/\s+$/u, "");
      }

      let next = marker.nextSibling;

      while (next && next.nodeType === Node.COMMENT_NODE) {
        next = next.nextSibling;
      }

      if (next && next.nodeType === Node.TEXT_NODE && next.nodeValue) {
        next.nodeValue = next.nodeValue.replace(/^\s+/u, "");
      }
    });
  }

  function bindCitationRuns() {
    const citationTriggers = Array.from(document.querySelectorAll('.ifc-annotation--citation'));

    citationTriggers.forEach(function (annotation) {
      if (annotation.closest(".ifc-citation-cluster")) {
        return;
      }

      const previous = previousSignificantSibling(annotation);
      const chain = [annotation];
      let cursor = annotation;

      while (true) {
        const separator = nextSignificantSibling(cursor);

        if (!separator || separator.nodeType !== Node.ELEMENT_NODE || !separator.classList || !separator.classList.contains("ifc-citation-marker")) {
          break;
        }

        const followingCitation = nextSignificantSibling(separator);

        if (!followingCitation || followingCitation.nodeType !== Node.ELEMENT_NODE || !followingCitation.matches("[data-annotation][data-annotation-kind=\"citation\"]")) {
          break;
        }

        chain.push(separator, followingCitation);
        cursor = followingCitation;
      }

      if (!previous || previous.nodeType !== Node.TEXT_NODE || !previous.nodeValue || !/\S/u.test(previous.nodeValue)) {
        return;
      }

      const tailMatch = previous.nodeValue.match(/(\S+)$/u);

      if (!tailMatch) {
        return;
      }

      const tail = tailMatch[1];
      const prefix = previous.nodeValue.slice(0, previous.nodeValue.length - tail.length);
      const cluster = document.createElement("span");
      cluster.className = "ifc-citation-cluster";
      cluster.appendChild(document.createTextNode(tail));

      chain.forEach(function (node) {
        if (node.parentNode) {
          cluster.appendChild(node);
        }
      });

      const afterRun = nextSignificantSibling(cursor);

      if (afterRun && afterRun.nodeType === Node.TEXT_NODE && afterRun.nodeValue) {
        const punctuationMatch = afterRun.nodeValue.match(/^([.,;:!?"'“”‘’)\]}\u2014\u2013-]+)/u);

        if (punctuationMatch) {
          cluster.appendChild(document.createTextNode(punctuationMatch[1]));
          afterRun.nodeValue = afterRun.nodeValue.slice(punctuationMatch[1].length);
        }
      }

      if (prefix) {
        previous.nodeValue = prefix;
        previous.parentNode.insertBefore(cluster, previous.nextSibling);
      } else if (previous.parentNode) {
        previous.parentNode.insertBefore(cluster, previous);
        previous.parentNode.removeChild(previous);
      }
    });
  }

  function isOpen(annotation) {
    return annotation.dataset.open === "true";
  }

  function isPinned(annotation) {
    return annotation.dataset.pinned === "true";
  }

  function setExpanded(annotation, expanded) {
    const { trigger, popover, close } = getParts(annotation);

    if (trigger) {
      trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
    }

    if (popover) {
      popover.setAttribute("aria-hidden", expanded ? "false" : "true");
    }

    if (close) {
      close.hidden = !expanded || (!isPinned(annotation) && !coarsePointerQuery.matches);
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function decorateExternalLinks(root) {
    const scope = root || document;
    const links = scope.querySelectorAll('a[target="_blank"]:not([data-no-external-icon])');

    links.forEach(function (link) {
      if (
        link.querySelector(".ifc-link-icon") ||
        link.closest(".ifc-mini-action") ||
        link.querySelector(".ifc-mini-action__aside")
      ) {
        return;
      }

      const icon = document.createElement("i");
      icon.className = "fas fa-external-link-alt ifc-link-icon";
      icon.setAttribute("aria-hidden", "true");
      link.appendChild(icon);
    });
  }

  function renderGlossaryBody(entry) {
    if (!entry) {
      return "";
    }

    const parts = [];

    if (entry.short) {
      parts.push('<span class="ifc-annotation__para ifc-annotation__lede">' + escapeHtml(entry.short) + "</span>");
    }

    if (entry.long) {
      parts.push('<span class="ifc-annotation__para">' + escapeHtml(entry.long) + "</span>");
    }

    if (Array.isArray(entry.see_also) && entry.see_also.length) {
      const pills = entry.see_also.map(function (relatedId) {
        const relatedEntry = glossaryData[relatedId] || {};
        const label = relatedEntry.term || relatedId;
        return '<button class="ifc-annotation__pill" type="button" data-related-glossary="' + escapeHtml(relatedId) + '">' + escapeHtml(label) + "</button>";
      }).join("");

      parts.push('<span class="ifc-annotation__para ifc-annotation__meta"><strong>See also:</strong>' + pills + "</span>");
    }

    if (Array.isArray(entry.links) && entry.links.length) {
      const links = entry.links.map(function (link) {
        return '<span class="ifc-annotation__link-item">' + renderAnnotationLink({
          href: link.url,
          label: link.label,
          newtab: link.newtab,
          defaultNewtab: false
        }) + "</span>";
      }).join("");

      parts.push('<span class="ifc-annotation__link-list">' + links + "</span>");
    }

    return parts.join("");
  }

  function normalizeNewtabValue(value, fallback) {
    if (value === true || value === "true") {
      return true;
    }

    if (value === false || value === "false") {
      return false;
    }

    return fallback;
  }

  function renderAnnotationLink(options) {
    const href = options && options.href ? String(options.href) : "";

    if (!href) {
      return "";
    }

    const label = options && options.label ? String(options.label) : href;
    const defaultNewtab = !!(options && options.defaultNewtab);
    const openNewtab = normalizeNewtabValue(options && options.newtab, defaultNewtab);
    const icon = "<i class=\"fas fa-external-link-alt ifc-link-icon\" aria-hidden=\"true\"></i>";
    const targetAttrs = openNewtab ? " target=\"_blank\" rel=\"noopener noreferrer\"" : "";

    return "<a href=\"" + escapeHtml(href) + "\"" + targetAttrs + ">" + escapeHtml(label) + (openNewtab ? icon : "") + "</a>";
  }

  function formatCitationAuthors(source) {
    if (Array.isArray(source.authors) && source.authors.length) {
      return source.authors
        .map(function (author) {
          if (author.literal) {
            return author.literal;
          }

          const name = [author.given, author.family].filter(Boolean).join(" ").trim();
          return author.suffix ? (name ? name + ", " + author.suffix : author.suffix) : name;
        })
        .filter(Boolean)
        .join(", ")
        .replace(/, ([^,]+)$/, ", and $1")
        .replace(/^([^,]+), and /, "$1 and ");
    }

    return source.organization || "";
  }

  function formatCitationIssued(source) {
    const issued = source.issued;

    if (issued && issued.year) {
      if (issued.month && issued.day) {
        return issued.month + "/" + issued.day + "/" + issued.year;
      }

      if (issued.month) {
        return issued.month + "/" + issued.year;
      }

      return String(issued.year);
    }

    return source.year ? String(source.year) : "";
  }

  function formatCitationReference(source) {
    if (!source) {
      return "";
    }

    const authors = formatCitationAuthors(source);
    const title = escapeHtml(source.title || "");
    const subtitle = source.subtitle ? ": <span class=\"ifc-citation-ref__subtitle\">" + escapeHtml(source.subtitle) + "</span>" : "";
    const titleLine = "<span class=\"ifc-citation-ref__title\">" + title + "</span>" + subtitle;
    const containerTitle = source.container_title || source.publication || source.journal || "";
    const issued = formatCitationIssued(source);
    let html = "<span class=\"ifc-citation-ref ifc-citation-ref--popover ifc-citation-ref--" + escapeHtml(source.type || "source") + "\">";

    if (source.type === "journal-article") {
      if (authors) {
        html += "<span class=\"ifc-citation-ref__authors\">" + escapeHtml(authors) + "</span>. ";
      }
      html += titleLine + ".";
      if (containerTitle) {
        html += " <span class=\"ifc-citation-ref__container\">" + escapeHtml(containerTitle) + "</span>";
      }
      if (source.volume) {
        html += " <span class=\"ifc-citation-ref__volume\">" + escapeHtml(source.volume) + "</span>";
      }
      if (source.issue) {
        html += "<span class=\"ifc-citation-ref__issue\">, no. " + escapeHtml(source.issue) + "</span>";
      }
      if (issued) {
        html += " (" + escapeHtml(issued) + ")";
      }
      if (source.pages) {
        html += ": <span class=\"ifc-citation-ref__pages\">" + escapeHtml(source.pages) + "</span>";
      }
      html += ".";
      if (source.doi) {
        const doiHref = "https://doi.org/" + String(source.doi).replace(/^https:\/\/doi\.org\//, "");
        html += " DOI: " + renderAnnotationLink({
          href: doiHref,
          label: source.doi,
          newtab: source.doi_newtab,
          defaultNewtab: true
        }) + ".";
      } else if (source.url) {
        html += " " + renderAnnotationLink({
          href: source.url,
          label: "Source",
          newtab: source.url_newtab,
          defaultNewtab: true
        }) + ".";
      }
    } else {
      if (authors) {
        html += "<span class=\"ifc-citation-ref__authors\">" + escapeHtml(authors) + "</span>. ";
      }
      html += titleLine + ".";
      if (containerTitle) {
        html += " <span class=\"ifc-citation-ref__container\">" + escapeHtml(containerTitle) + "</span>.";
      } else if (issued) {
        html += " " + escapeHtml(issued) + ".";
      }
      if (source.url) {
        html += " " + renderAnnotationLink({
          href: source.url,
          label: "Source",
          newtab: source.url_newtab,
          defaultNewtab: true
        }) + ".";
      }
    }

    if (Array.isArray(source.links) && source.links.length) {
      html += " ";
      html += source.links.map(function (link) {
        return renderAnnotationLink({
          href: link.url,
          label: link.label,
          newtab: link.newtab,
          defaultNewtab: true
        });
      }).join(" ");
    }

    html += "</span>";
    return html;
  }

  function resolveCitationSourceId(annotation) {
    const directSourceId = annotation.dataset.sourceId;
    const label = annotation.dataset.citationLabel;

    if (directSourceId) {
      return directSourceId;
    }

    if (!label) {
      return "";
    }

    if (Array.isArray(pageCitations)) {
      for (let index = 0; index < pageCitations.length; index += 1) {
        const entry = pageCitations[index];

        if (entry && String(entry.label) === String(label)) {
          return entry.id || "";
        }
      }

      return "";
    }

    if (pageCitations && typeof pageCitations === "object") {
      const keys = Object.keys(pageCitations);

      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];

        if (String(key) === String(label)) {
          return pageCitations[key] || "";
        }
      }
    }

    return "";
  }

  function hydrateCitation(annotation) {
    if (annotation.dataset.annotationKind !== "citation") {
      return;
    }

    const sourceId = resolveCitationSourceId(annotation);
    const source = sourceId ? citationData[sourceId] : null;

    if (!source) {
      return;
    }

    annotation.dataset.sourceId = sourceId;

    const parts = getParts(annotation);
    const label = annotation.dataset.citationLabel || "";
    const referenceHtml = formatCitationReference(source);
    let bodyHtml = "<span class=\"ifc-annotation__para ifc-annotation__lede ifc-annotation__lede--citation\">" + referenceHtml + "</span>";

    if (source.quote) {
      bodyHtml += "<span class=\"ifc-annotation__quote\">" + escapeHtml(source.quote) + "</span>";
    } else if (source.excerpt) {
      bodyHtml += "<span class=\"ifc-annotation__quote\">" + escapeHtml(source.excerpt) + "</span>";
    }

    if (source.notes) {
      bodyHtml += "<span class=\"ifc-annotation__para ifc-annotation__meta\">" + escapeHtml(source.notes) + "</span>";
    }

    if (parts.body) {
      parts.body.innerHTML = bodyHtml;
    }

    if (parts.trigger) {
      parts.trigger.setAttribute("aria-label", "Show citation" + (label ? " " + label : "") + " for " + (source.short_title || source.title || "Citation"));
    }
  }

  function captureGlossaryState(annotation) {
    const parts = getParts(annotation);

    return {
      entryId: annotation.dataset.entryId || "",
      heading: parts.heading ? parts.heading.textContent : "",
      body: parts.body ? parts.body.innerHTML : "",
      extra: parts.extra && !parts.extra.hidden ? parts.extra.innerHTML : ""
    };
  }

  function setGlossaryState(annotation, state) {
    const parts = getParts(annotation);

    if (parts.heading) {
      parts.heading.textContent = state.heading || "";
    }

    if (parts.body) {
      parts.body.innerHTML = state.body || "";
    }

    if (parts.extra) {
      const hasExtra = !!state.extra;
      parts.extra.innerHTML = state.extra || "";
      parts.extra.hidden = !hasExtra;
    }

    if (state.entryId) {
      annotation.dataset.entryId = state.entryId;
    }
  }

  function syncBackButton(annotation) {
    const { back } = getParts(annotation);
    const history = annotation._glossaryHistory || [];

    if (back) {
      back.hidden = history.length === 0;
    }
  }

  function loadRelatedGlossary(annotation, relatedId) {
    const entry = glossaryData[relatedId];

    if (!entry) {
      return;
    }

    annotation._glossaryHistory = annotation._glossaryHistory || [];
    annotation._glossaryHistory.push(captureGlossaryState(annotation));

    setGlossaryState(annotation, {
      entryId: relatedId,
      heading: entry.term || relatedId,
      body: renderGlossaryBody(entry),
      extra: ""
    });

    syncBackButton(annotation);
    openAnnotation(annotation, { pin: true });
  }

  function goBackGlossary(annotation) {
    const history = annotation._glossaryHistory || [];

    if (!history.length) {
      return;
    }

    setGlossaryState(annotation, history.pop());
    syncBackButton(annotation);
    openAnnotation(annotation, { pin: true });
  }

  function positionPopover(annotation) {
    const { popover } = getParts(annotation);

    if (!popover) {
      return;
    }

    annotation.style.removeProperty("--ifc-annotation-shift");
    annotation.style.removeProperty("--ifc-annotation-pointer");

    const annotationRect = annotation.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const centeredLeft = annotationRect.left + (annotationRect.width / 2) - (popoverRect.width / 2);
    const minLeft = viewportMargin;
    const maxLeft = window.innerWidth - popoverRect.width - viewportMargin;
    const clampedLeft = Math.min(Math.max(centeredLeft, minLeft), Math.max(minLeft, maxLeft));
    const shift = clampedLeft - centeredLeft;
    const pointerLeft = (annotationRect.left + (annotationRect.width / 2)) - clampedLeft;

    annotation.style.setProperty("--ifc-annotation-shift", shift.toFixed(2) + "px");
    annotation.style.setProperty("--ifc-annotation-pointer", pointerLeft.toFixed(2) + "px");
  }

  function openAnnotation(annotation, options) {
    const settings = options || {};
    const pin = coarsePointerQuery.matches || settings.pin === true || isPinned(annotation) || activePinned === annotation;

    if (pin) {
      annotations.forEach(function (item) {
        if (item !== annotation && isOpen(item)) {
          closeAnnotation(item);
        }
      });
    }

    hydrateCitation(annotation);
    annotation.dataset.open = "true";
    annotation.dataset.pinned = pin ? "true" : "false";
    setExpanded(annotation, true);
    positionPopover(annotation);

    if (pin) {
      activePinned = annotation;
    }

    syncPinnedMode();
  }

  function openPopoverLink(link) {
    if (!link || !link.href) {
      return false;
    }

    if (link.target === "_blank") {
      const opened = window.open(link.href, "_blank", "noopener,noreferrer");

      if (opened) {
        opened.opener = null;
      }
    } else {
      window.location.assign(link.href);
    }

    return true;
  }

  function handlePopoverLink(event, annotation) {
    const eventElement = getEventElement(event);
    const link = eventElement ? eventElement.closest("[data-annotation-popover] a[href]") : null;

    if (!link || !annotation.contains(link)) {
      return false;
    }

    if (event.type === "mousedown") {
      event.stopPropagation();
      return true;
    }

    if (event.type === "mouseup") {
      event.preventDefault();
      event.stopPropagation();
      lastPopoverLinkHandledAt = Date.now();
      return openPopoverLink(link);
    }

    return false;
  }

  function closeAnnotation(annotation) {
    if (!annotation) {
      return;
    }

    annotation.dataset.open = "false";
    annotation.dataset.pinned = "false";
    annotation.style.removeProperty("--ifc-annotation-shift");
    annotation.style.removeProperty("--ifc-annotation-pointer");
    if (annotation.dataset.annotationKind === "glossary" && annotation._glossaryRoot) {
      setGlossaryState(annotation, annotation._glossaryRoot);
      annotation._glossaryHistory = [];
      syncBackButton(annotation);
    }

    if (annotation.contains(document.activeElement)) {
      document.activeElement.blur();
    }

    setExpanded(annotation, false);

    if (activePinned === annotation) {
      activePinned = null;
    }

    syncPinnedMode();
  }

  function closeAll() {
    annotations.forEach(closeAnnotation);
  }

  normalizeGlossarySpacing();
  normalizeCitationSeparatorSpacing();
  bindAnnotationLineWrapping();
  bindCitationRuns();

  annotations.forEach(function (annotation) {
    const { trigger, close } = getParts(annotation);

    if (!trigger) {
      return;
    }

    annotation.dataset.open = "false";
    annotation.dataset.pinned = "false";
    annotation.dataset.suspendHover = "false";
    annotation._glossaryHistory = [];
    annotation._suppressTriggerClickOnce = false;
    annotation._suppressControlClickOnce = false;
    if (annotation.dataset.annotationKind === "glossary") {
      syncBackButton(annotation);
      annotation._glossaryRoot = captureGlossaryState(annotation);
    }
    hydrateCitation(annotation);

    annotation.addEventListener("mouseenter", function () {
      if (activePinned && activePinned !== annotation) {
        return;
      }

      if (coarsePointerQuery.matches) {
        return;
      }

      openAnnotation(annotation);
    });

    annotation.addEventListener("mouseleave", function (event) {
      if (event.relatedTarget && annotation.contains(event.relatedTarget)) {
        return;
      }

      annotation.dataset.suspendHover = "false";

      if (!isPinned(annotation) && !annotation.matches(":focus-within")) {
        closeAnnotation(annotation);
      }
    });

    annotation.addEventListener("focusin", function () {
      if (activePinned && activePinned !== annotation) {
        return;
      }

      openAnnotation(annotation);
    });

    annotation.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!annotation.contains(document.activeElement) && !isPinned(annotation) && !annotation.matches(":hover")) {
          closeAnnotation(annotation);
        }
      }, 0);
    });

    function pinTrigger(event) {
      event.preventDefault();
      event.stopPropagation();

      if (isOpen(annotation) && isPinned(annotation)) {
        closeAnnotation(annotation);
        return true;
      }

      if (annotation.dataset.annotationKind === "glossary" && annotation._glossaryRoot) {
        setGlossaryState(annotation, annotation._glossaryRoot);
        annotation._glossaryHistory = [];
        syncBackButton(annotation);
      }
      openAnnotation(annotation, { pin: true });
      return true;
    }

    trigger.addEventListener("mousedown", function (event) {
      annotation._suppressTriggerClickOnce = true;
      pinTrigger(event);
    });

    trigger.addEventListener("click", function (event) {
      if (annotation._suppressTriggerClickOnce) {
        annotation._suppressTriggerClickOnce = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      pinTrigger(event);
    });

    function forceCloseAnnotation(event) {
      event.preventDefault();
      event.stopPropagation();
      annotation.dataset.suspendHover = "true";
      closeAnnotation(annotation);
      return true;
    }

    if (close) {
      close.addEventListener("pointerdown", function (event) {
        forceCloseAnnotation(event);
      });

      close.addEventListener("click", function (event) {
        if (annotation.dataset.open === "false") {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        forceCloseAnnotation(event);
      });
    }

    function handleGlossaryControl(event) {
      if (event.type === "click" && annotation._suppressControlClickOnce) {
        annotation._suppressControlClickOnce = false;
        event.preventDefault();
        event.stopPropagation();
        return true;
      }

      const relatedGlossary = event.target.closest("[data-related-glossary]");
      const backButton = event.target.closest("[data-annotation-back]");
      const closeButton = event.target.closest("[data-annotation-close]");

      if (event.type === "mousedown" && (relatedGlossary || backButton || closeButton)) {
        annotation._suppressControlClickOnce = true;
      }

      if (relatedGlossary) {
        event.preventDefault();
        event.stopPropagation();
        loadRelatedGlossary(annotation, relatedGlossary.getAttribute("data-related-glossary"));
        return true;
      }

      if (backButton) {
        event.preventDefault();
        event.stopPropagation();
        goBackGlossary(annotation);
        return true;
      }

      if (closeButton) {
        event.preventDefault();
        event.stopPropagation();
        annotation.dataset.suspendHover = "true";
        closeAnnotation(annotation);
        return true;
      }

      return false;
    }

    annotation.addEventListener("mousedown", function (event) {
      if (handlePopoverLink(event, annotation)) {
        return;
      }

      handleGlossaryControl(event);
    });

    annotation.addEventListener("mouseup", function (event) {
      if (handlePopoverLink(event, annotation)) {
        return;
      }
    });

    annotation.addEventListener("click", function (event) {
      if (handlePopoverLink(event, annotation)) {
        return;
      }

      handleGlossaryControl(event);
    });
  });

  document.addEventListener("click", function (event) {
    if (activePinned && !activePinned.contains(event.target)) {
      closeAnnotation(activePinned);
    }
  });

  document.addEventListener(
    "click",
    function (event) {
      const eventElement = getEventElement(event);
      const link = eventElement ? eventElement.closest("[data-annotation-popover] a[href]") : null;

      if (!link) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (Date.now() - lastPopoverLinkHandledAt < 750) {
        return;
      }

      openPopoverLink(link);
    },
    true
  );

  document.addEventListener(
    "mouseup",
    function (event) {
      const eventElement = getEventElement(event);
      const link = eventElement ? eventElement.closest("[data-annotation-popover] a[href]") : null;

      if (!link) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openPopoverLink(link);
    },
    true
  );

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }

    if (!activePinned) {
      return;
    }

    const { trigger } = getParts(activePinned);
    const annotationToClose = activePinned;

    closeAnnotation(annotationToClose);

    if (trigger) {
      trigger.focus();
    }
  });

  window.addEventListener("resize", function () {
    annotations.forEach(function (annotation) {
      if (isOpen(annotation)) {
        positionPopover(annotation);
      }
    });
  });

  window.addEventListener(
    "scroll",
    function () {
      annotations.forEach(function (annotation) {
        if (isOpen(annotation)) {
          positionPopover(annotation);
        }
      });
    },
    true
  );
})();
