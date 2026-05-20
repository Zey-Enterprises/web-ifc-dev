/*
  Shared annotation behavior for glossary and citation popovers.

  Phase 1 architecture:
  - article prose contains only text-like annotation triggers
  - the popover shell lives once in the global annotation layer
  - glossary/citation content hydrates from window.IFC_ANNOTATIONS
  - selected/copied prose serializes citations as bracketed references
*/

(function () {
  const annotationData = window.IFC_ANNOTATIONS || {};
  const glossaryData = annotationData.glossary || {};
  const citationData = annotationData.citation || {};
  const pageCitations = annotationData.pageCitations || {};
  const annotations = Array.from(document.querySelectorAll("[data-annotation]"));
  const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
  const viewportMargin = 12;
  const popoverGap = 10;
  const WORD_JOINER = "\u2060";

  let activeAnnotation = null;
  let activePinned = null;
  let hoverCloseTimer = 0;

  decorateExternalLinks(document);

  if (!annotations.length) {
    return;
  }

  const layer = ensureLayer();
  const popoverParts = ensurePopover(layer);

  document.documentElement.classList.add("ifc-annotations-enhanced");

  function ensureLayer() {
    let existingLayer = document.querySelector("[data-annotation-layer]");

    if (!existingLayer) {
      existingLayer = document.createElement("div");
      existingLayer.id = "ifc-annotation-layer";
      existingLayer.className = "ifc-annotation-layer";
      existingLayer.setAttribute("data-annotation-layer", "");
      document.body.appendChild(existingLayer);
    }

    return existingLayer;
  }

  function ensurePopover(layerElement) {
    let popover = layerElement.querySelector("[data-annotation-popover]");

    if (!popover) {
      popover = document.createElement("span");
      popover.className = "ifc-annotation__popover";
      popover.id = "ifc-annotation-popover";
      popover.setAttribute("data-annotation-popover", "");
      popover.setAttribute("role", "dialog");
      popover.setAttribute("aria-modal", "false");
      popover.setAttribute("aria-hidden", "true");
      popover.setAttribute("aria-labelledby", "ifc-annotation-heading");
      popover.innerHTML = [
        '<span class="ifc-annotation__card">',
        '<span class="ifc-annotation__nav">',
        '<button class="ifc-annotation__back" type="button" data-annotation-back hidden aria-label="Go back to the previous glossary entry"><span aria-hidden="true">&#8249;</span></button>',
        "</span>",
        '<button class="ifc-annotation__close" type="button" data-annotation-close hidden aria-label="Close popover"><span aria-hidden="true">&times;</span></button>',
        '<span class="ifc-annotation__eyebrow"></span>',
        '<span class="ifc-annotation__heading" id="ifc-annotation-heading"></span>',
        '<span class="ifc-annotation__body"></span>',
        '<span class="ifc-annotation__extra" hidden></span>',
        "</span>"
      ].join("");
      layerElement.appendChild(popover);
    }

    return {
      popover: popover,
      card: popover.querySelector(".ifc-annotation__card"),
      eyebrow: popover.querySelector(".ifc-annotation__eyebrow"),
      heading: popover.querySelector(".ifc-annotation__heading"),
      body: popover.querySelector(".ifc-annotation__body"),
      extra: popover.querySelector(".ifc-annotation__extra"),
      back: popover.querySelector("[data-annotation-back]"),
      close: popover.querySelector("[data-annotation-close]")
    };
  }

  function getTrigger(annotation) {
    if (!annotation) {
      return null;
    }

    if (annotation.matches("[data-annotation-trigger]")) {
      return annotation;
    }

    return annotation.querySelector("[data-annotation-trigger]");
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

  function getTriggerVisualRect(trigger) {
    const rects = trigger ? Array.from(trigger.getClientRects()).filter(function (rect) {
      return rect.width > 0 && rect.height > 0;
    }) : [];

    if (!rects.length) {
      return trigger ? trigger.getBoundingClientRect() : null;
    }

    return rects.reduce(function (selected, rect) {
      if (rect.bottom > selected.bottom) {
        return rect;
      }

      if (rect.bottom === selected.bottom && rect.left > selected.left) {
        return rect;
      }

      return selected;
    }, rects[0]);
  }

  function getGlossaryEntry(entryId) {
    return entryId ? glossaryData[entryId] || null : null;
  }

  function getPageCitationMap() {
    return pageCitations || {};
  }

  function resolveCitationSourceId(annotation) {
    const directSourceId = annotation && annotation.dataset ? annotation.dataset.sourceId : "";
    const label = annotation && annotation.dataset ? annotation.dataset.citationLabel : "";
    const citationMap = getPageCitationMap();

    if (directSourceId) {
      return directSourceId;
    }

    if (!label) {
      return "";
    }

    if (Array.isArray(citationMap)) {
      for (let index = 0; index < citationMap.length; index += 1) {
        const entry = citationMap[index];

        if (entry && String(entry.label) === String(label)) {
          return entry.id || "";
        }
      }

      return "";
    }

    if (citationMap && typeof citationMap === "object") {
      const keys = Object.keys(citationMap);

      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];

        if (String(key) === String(label)) {
          return citationMap[key] || "";
        }
      }
    }

    return "";
  }

  function getCitationSource(annotation) {
    const sourceId = resolveCitationSourceId(annotation);

    if (sourceId && annotation && annotation.dataset) {
      annotation.dataset.sourceId = sourceId;
    }

    return sourceId ? citationData[sourceId] || null : null;
  }

  function syncPinnedMode() {
    document.documentElement.classList.toggle("ifc-annotation-pinned", !!activePinned);
  }

  function isOpen(annotation) {
    return annotation && annotation.dataset.open === "true";
  }

  function isPinned(annotation) {
    return annotation && annotation.dataset.pinned === "true";
  }

  function setExpanded(annotation, expanded) {
    const trigger = getTrigger(annotation);

    if (trigger) {
      trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
    }
  }

  function resetAnnotationState(annotation) {
    if (!annotation) {
      return;
    }

    annotation.dataset.open = "false";
    annotation.dataset.pinned = "false";
    setExpanded(annotation, false);
  }

  function closeActive(options) {
    const settings = options || {};
    const annotation = activeAnnotation;
    const trigger = getTrigger(annotation);

    clearHoverTimer();

    if (annotation) {
      resetAnnotationState(annotation);
    }

    activeAnnotation = null;
    activePinned = null;
    layer.dataset.open = "false";
    layer.dataset.pinned = "false";
    layer.dataset.coarse = coarsePointerQuery.matches ? "true" : "false";
    layer.removeAttribute("data-kind");
    popoverParts.popover.setAttribute("aria-hidden", "true");
    popoverParts.popover.hidden = true;
    popoverParts.close.hidden = true;
    popoverParts.back.hidden = true;
    syncPinnedMode();

    if (settings.restoreFocus && trigger) {
      trigger.focus();
    }
  }

  function closeIfHoverInactive() {
    if (!activeAnnotation || isPinned(activeAnnotation)) {
      return;
    }

    const trigger = getTrigger(activeAnnotation);
    const triggerHovered = !!(trigger && trigger.matches(":hover"));
    const popoverHovered = popoverParts.popover.matches(":hover");
    const focusInside = !!(
      (trigger && trigger.contains(document.activeElement)) ||
      popoverParts.popover.contains(document.activeElement)
    );

    if (!triggerHovered && !popoverHovered && !focusInside) {
      closeActive();
    }
  }

  function scheduleHoverClose() {
    clearHoverTimer();
    hoverCloseTimer = window.setTimeout(closeIfHoverInactive, 160);
  }

  function clearHoverTimer() {
    if (hoverCloseTimer) {
      window.clearTimeout(hoverCloseTimer);
      hoverCloseTimer = 0;
    }
  }

  function openAnnotation(annotation, options) {
    const settings = options || {};
    const shouldPin = settings.pin === true || coarsePointerQuery.matches || isPinned(annotation) || activePinned === annotation;

    if (!annotation) {
      return;
    }

    if (activePinned && activePinned !== annotation && !shouldPin) {
      return;
    }

    if (activeAnnotation && activeAnnotation !== annotation) {
      resetAnnotationState(activeAnnotation);
    }

    if (annotation.dataset.annotationKind === "glossary" && !settings.preserveGlossary) {
      annotation._activeGlossaryEntryId = annotation.dataset.entryId || "";
      annotation._glossaryHistory = [];
    }

    activeAnnotation = annotation;
    activePinned = shouldPin ? annotation : null;
    annotation.dataset.open = "true";
    annotation.dataset.pinned = shouldPin ? "true" : "false";
    setExpanded(annotation, true);

    layer.dataset.open = "true";
    layer.dataset.pinned = shouldPin ? "true" : "false";
    layer.dataset.coarse = coarsePointerQuery.matches ? "true" : "false";
    layer.dataset.kind = annotation.dataset.annotationKind || "annotation";
    popoverParts.popover.hidden = false;
    popoverParts.popover.setAttribute("aria-hidden", "false");

    renderActivePopover();
    syncPinnedMode();
    positionPopover();

    window.requestAnimationFrame(function () {
      positionPopover();
    });
  }

  function pinActiveAnnotation() {
    if (!activeAnnotation) {
      return;
    }

    activePinned = activeAnnotation;
    activeAnnotation.dataset.pinned = "true";
    layer.dataset.pinned = "true";
    popoverParts.close.hidden = false;
    syncPinnedMode();
  }

  function renderActivePopover() {
    if (!activeAnnotation) {
      return;
    }

    const kind = activeAnnotation.dataset.annotationKind || "annotation";

    popoverParts.eyebrow.textContent = kind === "citation" ? "Citation" : "Glossary";
    popoverParts.heading.hidden = false;
    popoverParts.heading.textContent = "";
    popoverParts.body.innerHTML = "";
    popoverParts.extra.innerHTML = "";
    popoverParts.extra.hidden = true;
    popoverParts.back.hidden = true;
    popoverParts.close.hidden = !(isPinned(activeAnnotation) || coarsePointerQuery.matches);

    if (kind === "citation") {
      renderCitationPopover(activeAnnotation);
    } else if (kind === "glossary") {
      renderGlossaryPopover(activeAnnotation);
    }

    decorateExternalLinks(popoverParts.popover);
  }

  function renderGlossaryPopover(annotation) {
    const entryId = annotation._activeGlossaryEntryId || annotation.dataset.entryId || "";
    const entry = getGlossaryEntry(entryId);

    if (!entry) {
      popoverParts.heading.textContent = "Missing glossary entry";
      popoverParts.body.innerHTML = '<span class="ifc-annotation__para">No glossary entry was found for <code>' + escapeHtml(entryId) + "</code>.</span>";
      return;
    }

    annotation._activeGlossaryEntryId = entryId;
    popoverParts.heading.textContent = entry.term || entryId;
    popoverParts.body.innerHTML = renderGlossaryBody(entry);
    popoverParts.back.hidden = !(annotation._glossaryHistory && annotation._glossaryHistory.length);

    const extraHtml = annotation.dataset.extraHtml || "";

    if (extraHtml) {
      popoverParts.extra.innerHTML = extraHtml;
      popoverParts.extra.hidden = false;
    }
  }

  function renderCitationPopover(annotation) {
    const source = getCitationSource(annotation);
    const sourceId = resolveCitationSourceId(annotation);

    popoverParts.heading.hidden = true;

    if (!source) {
      popoverParts.heading.hidden = false;
      popoverParts.heading.textContent = "Missing citation";
      popoverParts.body.innerHTML = '<span class="ifc-annotation__para">No citation source was found' + (sourceId ? " for <code>" + escapeHtml(sourceId) + "</code>" : "") + ".</span>";
      return;
    }

    let bodyHtml = '<span class="ifc-annotation__para ifc-annotation__lede ifc-annotation__lede--citation">' + formatCitationReference(source) + "</span>";

    if (source.quote) {
      bodyHtml += '<span class="ifc-annotation__quote">' + escapeHtml(source.quote) + "</span>";
    } else if (source.excerpt) {
      bodyHtml += '<span class="ifc-annotation__quote">' + escapeHtml(source.excerpt) + "</span>";
    }

    if (source.notes) {
      bodyHtml += '<span class="ifc-annotation__para ifc-annotation__meta">' + escapeHtml(source.notes) + "</span>";
    }

    popoverParts.body.innerHTML = bodyHtml;

    const extraHtml = annotation.dataset.extraHtml || "";

    if (extraHtml) {
      popoverParts.extra.innerHTML = extraHtml;
      popoverParts.extra.hidden = false;
    }

    const trigger = getTrigger(annotation);
    const label = annotation.dataset.citationLabel || "";

    if (trigger) {
      trigger.setAttribute("aria-label", "Show citation" + (label ? " " + label : "") + " for " + (source.short_title || source.title || "source"));
    }
  }

  function positionPopover() {
    if (!activeAnnotation || popoverParts.popover.hidden) {
      return;
    }

    const trigger = getTrigger(activeAnnotation);

    if (!trigger) {
      return;
    }

    const triggerRect = getTriggerVisualRect(trigger);
    const popover = popoverParts.popover;

    if (!triggerRect) {
      return;
    }

    popover.style.removeProperty("--ifc-annotation-left");
    popover.style.removeProperty("--ifc-annotation-top");
    popover.style.removeProperty("--ifc-annotation-pointer");

    const popoverRect = popover.getBoundingClientRect();
    const width = popoverRect.width || Math.min(448, window.innerWidth - (viewportMargin * 2));
    const centeredLeft = triggerRect.left + (triggerRect.width / 2) - (width / 2);
    const maxLeft = window.innerWidth - width - viewportMargin;
    const left = Math.min(Math.max(centeredLeft, viewportMargin), Math.max(viewportMargin, maxLeft));
    const pointer = Math.min(Math.max((triggerRect.left + (triggerRect.width / 2)) - left, 18), width - 18);
    const top = Math.max(viewportMargin, triggerRect.bottom + popoverGap);

    popover.style.setProperty("--ifc-annotation-left", left.toFixed(2) + "px");
    popover.style.setProperty("--ifc-annotation-top", top.toFixed(2) + "px");
    popover.style.setProperty("--ifc-annotation-pointer", pointer.toFixed(2) + "px");
  }

  function loadRelatedGlossary(annotation, relatedId) {
    const entry = getGlossaryEntry(relatedId);

    if (!annotation || annotation.dataset.annotationKind !== "glossary" || !entry) {
      return;
    }

    annotation._glossaryHistory = annotation._glossaryHistory || [];
    annotation._glossaryHistory.push(annotation._activeGlossaryEntryId || annotation.dataset.entryId || "");
    annotation._activeGlossaryEntryId = relatedId;

    openAnnotation(annotation, { pin: true, preserveGlossary: true });
  }

  function goBackGlossary(annotation) {
    const history = annotation && annotation._glossaryHistory ? annotation._glossaryHistory : [];

    if (!history.length) {
      return;
    }

    annotation._activeGlossaryEntryId = history.pop();
    openAnnotation(annotation, { pin: true, preserveGlossary: true });
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
    const icon = '<i class="fas fa-external-link-alt ifc-link-icon" aria-hidden="true"></i>';
    const targetAttrs = openNewtab ? ' target="_blank" rel="noopener noreferrer"' : "";

    return '<a href="' + escapeHtml(href) + '"' + targetAttrs + '><span class="ifc-annotation__link-label">' + escapeHtml(label) + "</span>" + (openNewtab ? icon : "") + "</a>";
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
        const relatedEntry = getGlossaryEntry(relatedId) || {};
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
    const subtitle = source.subtitle ? ': <span class="ifc-citation-ref__subtitle">' + escapeHtml(source.subtitle) + "</span>" : "";
    const titleLine = '<span class="ifc-citation-ref__title">' + title + "</span>" + subtitle;
    const containerTitle = source.container_title || source.publication || source.journal || "";
    const issued = formatCitationIssued(source);
    let html = '<span class="ifc-citation-ref ifc-citation-ref--popover ifc-citation-ref--' + escapeHtml(source.type || "source") + '">';

    if (source.type === "journal-article") {
      if (authors) {
        html += '<span class="ifc-citation-ref__authors">' + escapeHtml(authors) + "</span>. ";
      }
      html += titleLine + ".";
      if (containerTitle) {
        html += ' <span class="ifc-citation-ref__container">' + escapeHtml(containerTitle) + "</span>";
      }
      if (source.volume) {
        html += ' <span class="ifc-citation-ref__volume">' + escapeHtml(source.volume) + "</span>";
      }
      if (source.issue) {
        html += '<span class="ifc-citation-ref__issue">, no. ' + escapeHtml(source.issue) + "</span>";
      }
      if (issued) {
        html += " (" + escapeHtml(issued) + ")";
      }
      if (source.pages) {
        html += ': <span class="ifc-citation-ref__pages">' + escapeHtml(source.pages) + "</span>";
      }
      html += ".";
      if (source.doi) {
        const doiHref = "https://doi.org/" + String(source.doi).replace(/^https:\/\/doi\.org\//, "");
        html += " DOI: " + renderAnnotationLink({
          href: doiHref,
          label: source.doi,
          newtab: source.doi_newtab,
          defaultNewtab: true
        });
      } else if (source.url) {
        html += " " + renderAnnotationLink({
          href: source.url,
          label: "Source",
          newtab: source.url_newtab,
          defaultNewtab: true
        });
      }
    } else {
      if (authors) {
        html += '<span class="ifc-citation-ref__authors">' + escapeHtml(authors) + "</span>. ";
      }
      html += titleLine + ".";
      if (containerTitle) {
        html += ' <span class="ifc-citation-ref__container">' + escapeHtml(containerTitle) + "</span>.";
      } else if (issued) {
        html += " " + escapeHtml(issued) + ".";
      }
      if (source.url) {
        html += " " + renderAnnotationLink({
          href: source.url,
          label: "Source",
          newtab: source.url_newtab,
          defaultNewtab: true
        });
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

  function formatCitationReferencePlain(source) {
    if (!source) {
      return "";
    }

    const authors = formatCitationAuthors(source);
    const title = source.title || "";
    const subtitle = source.subtitle ? ": " + source.subtitle : "";
    const containerTitle = source.container_title || source.publication || source.journal || "";
    const issued = formatCitationIssued(source);
    const parts = [];

    if (authors) {
      parts.push(authors + ".");
    }

    if (title) {
      parts.push(title + subtitle + ".");
    }

    if (source.type === "journal-article") {
      let journalLine = containerTitle;

      if (source.volume) {
        journalLine += (journalLine ? " " : "") + source.volume;
      }

      if (source.issue) {
        journalLine += (journalLine ? ", " : "") + "no. " + source.issue;
      }

      if (issued) {
        journalLine += (journalLine ? " " : "") + "(" + issued + ")";
      }

      if (source.pages) {
        journalLine += (journalLine ? ": " : "") + source.pages;
      }

      if (journalLine) {
        parts.push(journalLine + ".");
      }
    } else {
      if (containerTitle) {
        parts.push(containerTitle + ".");
      } else if (issued) {
        parts.push(issued + ".");
      }
    }

    if (source.doi) {
      parts.push("DOI: https://doi.org/" + String(source.doi).replace(/^https:\/\/doi\.org\//, ""));
    } else if (source.url) {
      parts.push("URL: " + source.url);
    }

    return parts.join(" ").replace(/\s+/g, " ").trim();
  }

  function setCitationLabel(annotation, label) {
    if (!annotation || annotation.dataset.annotationKind !== "citation") {
      return;
    }

    const normalizedLabel = String(label || "");
    annotation.dataset.citationLabel = normalizedLabel;

    let marker = annotation.querySelector(".ifc-citation-marker");

    if (!marker) {
      marker = document.createElement("span");
      marker.className = "ifc-citation-marker";
      marker.setAttribute("aria-hidden", "true");
      annotation.textContent = "";
      annotation.appendChild(marker);
    }

    marker.dataset.citationLabel = normalizedLabel;
    marker.textContent = normalizedLabel;
    annotation.setAttribute("aria-label", "Show citation " + normalizedLabel);
  }

  function applyScopedCitationNumbering() {
    const scopes = Array.from(document.querySelectorAll("[data-citation-numbering='global']"));

    scopes.forEach(function (scope) {
      const scopedCitations = Array.from(scope.querySelectorAll("[data-annotation][data-annotation-kind='citation']"));

      scopedCitations.forEach(function (annotation, index) {
        setCitationLabel(annotation, index + 1);
      });
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

  function normalizeCitationSeparatorSpacing() {
    Array.from(document.querySelectorAll(".ifc-citation-marker")).forEach(function (marker) {
      if ((marker.textContent || "").trim() !== "," && marker.dataset.citationSeparator !== ",") {
        return;
      }

      marker.classList.add("ifc-citation-marker--sep");
      marker.setAttribute("aria-hidden", "true");
      marker.dataset.citationSeparator = ",";
      marker.textContent = "";

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

  function bindAnnotationLineWrapping() {
    annotations.forEach(function (annotation) {
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
      } else if (next && next.nodeType === Node.ELEMENT_NODE && next.matches("[data-annotation][data-annotation-kind='citation']")) {
        prependWordJoinerToNode(next);
      }
    });
  }

  function getAnnotationCopyText(annotation) {
    if (!annotation) {
      return "";
    }

    if (annotation.dataset.annotationKind === "citation") {
      const label = annotation.dataset.citationLabel || "";
      return label ? "[" + label + "]" : "";
    }

    const clone = annotation.cloneNode(true);
    clone.querySelectorAll(".screen-reader-text, .ifc-link-icon").forEach(function (node) {
      node.remove();
    });

    return (clone.textContent || "").replace(/\u2060/g, "").trim();
  }

  function getCopiedCitationEntries(fragment) {
    const entries = [];
    const seen = {};

    if (!fragment) {
      return entries;
    }

    fragment.querySelectorAll('[data-annotation][data-annotation-kind="citation"]').forEach(function (annotation) {
      const label = annotation.dataset.citationLabel || "";
      const sourceId = resolveCitationSourceId(annotation);

      if (!label || !sourceId || seen[label]) {
        return;
      }

      seen[label] = true;
      entries.push({
        label: label,
        source: citationData[sourceId] || null
      });
    });

    return entries;
  }

  function normalizeCopiedText(text) {
    return String(text || "")
      .replace(/\u2060/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\[\d+[^\]]*\]\s*,\s*\[/g, function (match) {
        return match.replace(/\]\s*,\s*\[/g, "][");
      })
      .trim();
  }

  function serializeCopiedSelection(fragment) {
    if (!fragment) {
      return "";
    }

    const copiedCitations = getCopiedCitationEntries(fragment);

    fragment.querySelectorAll("[data-annotation-layer], [data-annotation-popover], [data-annotation-close], [data-annotation-back], .screen-reader-text, .ifc-link-icon").forEach(function (node) {
      node.remove();
    });

    fragment.querySelectorAll(".ifc-citation-marker--sep").forEach(function (node) {
      node.remove();
    });

    fragment.querySelectorAll("[data-annotation]").forEach(function (annotation) {
      const text = getAnnotationCopyText(annotation);
      annotation.replaceWith(document.createTextNode(text));
    });

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-99999px";
    container.style.top = "0";
    container.style.width = "99999px";
    container.style.opacity = "0";
    container.style.pointerEvents = "none";
    container.style.whiteSpace = "normal";
    container.appendChild(fragment);
    document.body.appendChild(container);

    const text = normalizeCopiedText(container.innerText || container.textContent || "");
    container.remove();

    if (!copiedCitations.length) {
      return text;
    }

    const references = copiedCitations
      .map(function (entry) {
        const reference = formatCitationReferencePlain(entry.source);
        return reference ? ("[" + entry.label + "] " + reference) : "";
      })
      .filter(Boolean);

    if (!references.length) {
      return text;
    }

    return text + "\n\n" + references.join("\n");
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

  applyScopedCitationNumbering();
  normalizeCitationSeparatorSpacing();
  bindAnnotationLineWrapping();

  annotations.forEach(function (annotation) {
    annotation.dataset.open = "false";
    annotation.dataset.pinned = "false";
    annotation._glossaryHistory = [];
    annotation._activeGlossaryEntryId = annotation.dataset.entryId || "";

    const trigger = getTrigger(annotation);

    if (!trigger) {
      return;
    }

    if (annotation.dataset.annotationKind === "citation") {
      const marker = annotation.querySelector(".ifc-citation-marker");

      if (marker && !marker.textContent.trim()) {
        marker.textContent = annotation.dataset.citationLabel || "";
      }
    }

    annotation.addEventListener("mouseenter", function () {
      if (activePinned && activePinned !== annotation) {
        return;
      }

      if (coarsePointerQuery.matches) {
        return;
      }

      clearHoverTimer();
      openAnnotation(annotation);
    });

    annotation.addEventListener("mouseleave", function () {
      scheduleHoverClose();
    });

    annotation.addEventListener("focusin", function () {
      if (activePinned && activePinned !== annotation) {
        return;
      }

      if (coarsePointerQuery.matches) {
        return;
      }

      openAnnotation(annotation);
    });

    annotation.addEventListener("focusout", function () {
      window.setTimeout(scheduleHoverClose, 0);
    });

    annotation.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (isOpen(annotation) && isPinned(annotation)) {
        closeActive();
        return;
      }

      openAnnotation(annotation, { pin: true });
    });

    annotation.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openAnnotation(annotation, { pin: true });
    });
  });

  popoverParts.popover.addEventListener("mouseenter", clearHoverTimer);
  popoverParts.popover.addEventListener("mouseleave", scheduleHoverClose);
  popoverParts.popover.addEventListener("focusin", clearHoverTimer);
  popoverParts.popover.addEventListener("focusout", function () {
    window.setTimeout(scheduleHoverClose, 0);
  });

  popoverParts.popover.addEventListener("pointerdown", function (event) {
    const eventElement = getEventElement(event);

    if (eventElement && eventElement.closest("[data-annotation-close], [data-annotation-back], [data-related-glossary], a[href]")) {
      event.stopPropagation();
    }
  });

  popoverParts.popover.addEventListener("click", function (event) {
    const eventElement = getEventElement(event);

    if (!eventElement) {
      return;
    }

    const closeButton = eventElement.closest("[data-annotation-close]");
    const backButton = eventElement.closest("[data-annotation-back]");
    const relatedGlossary = eventElement.closest("[data-related-glossary]");
    const link = eventElement.closest("a[href]");

    if (closeButton) {
      event.preventDefault();
      event.stopPropagation();
      closeActive();
      return;
    }

    if (backButton) {
      event.preventDefault();
      event.stopPropagation();
      goBackGlossary(activeAnnotation);
      return;
    }

    if (relatedGlossary) {
      event.preventDefault();
      event.stopPropagation();
      loadRelatedGlossary(activeAnnotation, relatedGlossary.getAttribute("data-related-glossary"));
      return;
    }

    if (link) {
      event.preventDefault();
      event.stopPropagation();
      openPopoverLink(link);
    }
  });

  document.addEventListener("click", function (event) {
    if (!activeAnnotation) {
      return;
    }

    const eventElement = getEventElement(event);

    if (
      eventElement &&
      (
        activeAnnotation.contains(eventElement) ||
        popoverParts.popover.contains(eventElement)
      )
    ) {
      return;
    }

    if (isPinned(activeAnnotation)) {
      closeActive();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || !activeAnnotation) {
      return;
    }

    closeActive({ restoreFocus: true });
  });

  document.addEventListener("copy", function (event) {
    if (!event.clipboardData) {
      return;
    }

    const selection = window.getSelection();

    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      return;
    }

    const anchorElement = selection.anchorNode && selection.anchorNode.nodeType === Node.ELEMENT_NODE
      ? selection.anchorNode
      : selection.anchorNode && selection.anchorNode.parentElement;
    const focusElement = selection.focusNode && selection.focusNode.nodeType === Node.ELEMENT_NODE
      ? selection.focusNode
      : selection.focusNode && selection.focusNode.parentElement;

    if (
      (anchorElement && anchorElement.closest("[data-annotation-popover]")) ||
      (focusElement && focusElement.closest("[data-annotation-popover]"))
    ) {
      return;
    }

    const fragment = selection.getRangeAt(0).cloneContents();
    const text = serializeCopiedSelection(fragment);

    if (!text) {
      return;
    }

    event.preventDefault();
    event.clipboardData.setData("text/plain", text);
  });

  window.addEventListener("resize", function () {
    if (activeAnnotation) {
      positionPopover();
    }
  });

  window.addEventListener(
    "scroll",
    function () {
      if (activeAnnotation) {
        positionPopover();
      }
    },
    true
  );
})();
