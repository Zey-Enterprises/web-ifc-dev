---
title: "References"
permalink: /resources/references/
description: "Single-page reference library for the citations used across the resource library."
header:
  # kicker: References
  overlay_image: /assets/images/ifc-references-hero-banner-1.jpg
  overlay_filter: linear-gradient(135deg, rgba(17, 33, 45, 0.7), rgba(17, 33, 45, 0.22))
  actions:
  - label: ← Back to All Resources
    url: /resources/
    class: btn--light-outline
  - label: Go to Glossary
    url: /resources/glossary/
    class: btn--light-outline
---

{% assign references_path = '/resources/references/' | relative_url %}
{% assign citation_tags = "" | split: "" %}
{% for citation_pair in site.data.citation %}
  {% assign citation_tags = citation_tags | concat: citation_pair[1].tags %}
{% endfor %}
{% assign citation_tags = citation_tags | uniq | sort_natural %}

<div id="references-top" class="ifc-resource-browser ifc-resource-browser--glossary ifc-resource-browser--references" data-glossary-browser data-glossary-path="{{ references_path }}">
  <div class="ifc-resource-browser__backdrop" data-mobile-filter-backdrop hidden></div>

  <div class="ifc-resource-browser__controls ifc-resource-browser__controls--glossary" data-glossary-top-target>
    <div
      class="ifc-resource-filter"
      data-filter-kind="multi"
      data-filter-group="tag"
      data-group-label="Tags"
      data-all-label="All Tags"
      data-mobile-label="Tags"
    >
      <button class="ifc-resource-filter__trigger" type="button" data-filter-toggle aria-expanded="false" aria-controls="ifc-references-filter-panel">
        <span class="ifc-resource-filter__trigger-label" data-filter-trigger-label>All Tags</span>
        <span class="ifc-resource-filter__trigger-icon" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
      </button>
      <div class="ifc-resource-filter__menu" data-filter-menu hidden>
        <div class="ifc-resource-filter__actions">
          <button type="button" data-filter-action="check-all">Check all</button>
          <button type="button" data-filter-action="clear-all">Clear all</button>
        </div>
        <div class="ifc-resource-filter__options">
          {% for tag_slug in citation_tags %}
            {% assign tag_data = site.data.tags[tag_slug] %}
            <label class="ifc-resource-filter__option">
              <input type="checkbox" value="{{ tag_slug }}" data-option-label="{{ tag_data.label | default: tag_slug }}">
              <span>{{ tag_data.label | default: tag_slug }}</span>
            </label>
          {% endfor %}
        </div>
      </div>
    </div>
  </div>

  <div class="ifc-resource-browser__panel ifc-resource-browser__panel--glossary" id="ifc-references-filter-panel" data-mobile-filter-panel>
    <div class="ifc-resource-browser__panel-header">
      <p class="ifc-resource-browser__panel-title">Tags</p>
      <button class="ifc-resource-browser__panel-close" type="button" data-mobile-filter-close aria-label="Close tags">
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <div class="ifc-resource-browser__panel-body">
      <div class="ifc-resource-filter__menu ifc-resource-filter__menu--panel" data-mobile-filter-menu>
        <div class="ifc-resource-filter__actions">
          <button type="button" data-filter-action="check-all">Check all</button>
          <button type="button" data-filter-action="clear-all">Clear all</button>
        </div>
        <div class="ifc-resource-filter__options">
          {% for tag_slug in citation_tags %}
            {% assign tag_data = site.data.tags[tag_slug] %}
            <label class="ifc-resource-filter__option">
              <input type="checkbox" value="{{ tag_slug }}" data-option-label="{{ tag_data.label | default: tag_slug }}">
              <span>{{ tag_data.label | default: tag_slug }}</span>
            </label>
          {% endfor %}
        </div>
      </div>
    </div>
  </div>

  <div class="ifc-resource-browser__status">
    <div class="ifc-active-filters" data-active-filters hidden></div>
    <div class="ifc-resource-browser__status-row">
      <p class="ifc-filter-summary" data-filter-summary></p>
    </div>
  </div>

  <div class="ifc-glossary-list ifc-reference-list" data-glossary-list>
    {% for citation_pair in site.data.citation %}
      {% assign source = citation_pair[1] %}
      {% assign display_title = source.short_title | default: source.title %}
      {% capture summary_line %}
        {% if source.type %}{{ source.type | replace: '-', ' ' | capitalize }}{% endif %}
      {% endcapture %}
      {% assign summary_line = summary_line | strip %}
      <article
        class="ifc-panel ifc-glossary-entry ifc-reference-entry"
        id="reference-{{ source.id }}"
        data-filter-item
        data-glossary-id="{{ source.id }}"
        data-title="{{ display_title | escape }}"
        data-tags="{{ source.tags | join: '|' }}"
        tabindex="-1"
      >
        <h2>{{ display_title }}</h2>
        {% if summary_line != "" %}
          <p class="ifc-reference-entry__short">{{ summary_line }}</p>
        {% endif %}

        <div class="ifc-reference-entry__reference">
          {% include _citation_card.html source=source display_title=display_title %}
        </div>

        {% if source.quote or source.excerpt %}
          <div class="ifc-reference-entry__quote">{{ source.quote | default: source.excerpt }}</div>
        {% endif %}

        {% if source.notes %}
          <p class="ifc-reference-entry__notes">{{ source.notes }}</p>
        {% endif %}

        {% if source.tags and source.tags.size > 0 %}
          <div class="ifc-glossary-entry__meta-group">
            <p class="ifc-glossary-entry__label">Tags</p>
            <p class="ifc-taxonomy-pills">
              {% for tag_slug in source.tags %}
                {% assign tag_data = site.data.tags[tag_slug] %}
                <span class="ifc-taxonomy-pill ifc-taxonomy-pill--light">{{ tag_data.label | default: tag_slug }}</span>
              {% endfor %}
            </p>
          </div>
        {% endif %}

        <a class="ifc-glossary-entry__to-top" href="#references-top" data-glossary-top-link aria-label="Back to top" title="Back to top">
          <span aria-hidden="true">↑</span>
        </a>
      </article>
    {% endfor %}
  </div>

  <div class="notice--info ifc-empty-state" data-filter-empty hidden>
    No references match the current tag filter.
  </div>
</div>
