---
title: "References"
permalink: /resources/references/
description: "References and citations used across the Integrated Fitness Coaching resource library."
excerpt: "A browsable reference library for sources cited across articles, FAQs, glossary entries, and other resources."
header:
  kicker: "Resource Library"
  overlay_title: "References"
  # overlay_image: /assets/images/ifc-references-hero-banner-1.jpg
  overlay_filter: linear-gradient(135deg, rgba(17, 33, 45, 0.7), rgba(17, 33, 45, 0.22))
  actions:
  - label: ← Back to All Resources
    url: /resources/
    class: btn--light-outline
  - label: Glossary
    url: /resources/glossary/
    class: btn--light-outline
  - label: Fitness FAQ
    url: /resources/faq/
    class: btn--light-outline
---

{% assign references_path = '/resources/references/' | relative_url %}
{% assign citation_tags = "" | split: "" %}
{% assign citation_types = "" | split: "" %}
{% for citation_pair in site.data.citation %}
  {% assign citation_tags = citation_tags | concat: citation_pair[1].tags %}
  {% assign citation_type = citation_pair[1].type | split: "|" %}
  {% assign citation_types = citation_types | concat: citation_type %}
{% endfor %}
{% assign citation_tags = citation_tags | uniq | sort_natural %}
{% assign citation_types = citation_types | uniq | sort_natural %}

<div id="references-top" class="ifc-resource-browser ifc-resource-browser--references" data-resource-browser data-resource-path="{{ references_path }}" data-default-sort="title-asc" data-result-label-singular="reference" data-result-label-plural="references" data-summary-mode="always">
  <div class="ifc-resource-browser__toolbar">
    <button
      class="ifc-resource-browser__mobile-toggle"
      type="button"
      data-mobile-filter-toggle
      aria-expanded="false"
      aria-controls="ifc-references-filter-panel"
    >
      <span>Filters</span>
      <span class="ifc-resource-browser__mobile-count" data-mobile-filter-count hidden>0</span>
    </button>

    <div class="ifc-resource-filter ifc-resource-filter--sort ifc-resource-filter--mobile-sort" data-mobile-sort-control>
      <button
        class="ifc-resource-filter__trigger ifc-resource-filter__trigger--icon"
        type="button"
        data-mobile-sort-toggle
        aria-expanded="false"
        aria-label="Sort references"
        title="Sort references"
      >
        <span class="screen-reader-text" data-mobile-sort-trigger-text>Sort references</span>
        <span aria-hidden="true"><i class="fas fa-sort-amount-down"></i></span>
      </button>
      <div class="ifc-resource-filter__menu ifc-resource-filter__menu--sort" data-mobile-sort-menu hidden>
        <p class="ifc-resource-filter__menu-title">Sort</p>
        <div class="ifc-resource-filter__choices">
          <button type="button" class="ifc-resource-filter__choice" data-mobile-sort-option="title-asc">Lexicographical by Title</button>
          <button type="button" class="ifc-resource-filter__choice" data-mobile-sort-option="author-asc">Lexicographical by Author</button>
          <button type="button" class="ifc-resource-filter__choice" data-mobile-sort-option="publication-asc">Lexicographical by Publication</button>
          <button type="button" class="ifc-resource-filter__choice" data-mobile-sort-option="recent-published-desc">Most Recently Published First</button>
          <button type="button" class="ifc-resource-filter__choice" data-mobile-sort-option="published-asc">Oldest Published First</button>
        </div>
      </div>
    </div>
  </div>

  <div class="ifc-resource-browser__backdrop" data-mobile-filter-backdrop hidden></div>

  <div class="ifc-resource-browser__panel" id="ifc-references-filter-panel" data-mobile-filter-panel>
    <div class="ifc-resource-browser__panel-header">
      <p class="ifc-resource-browser__panel-title">Filters</p>
      <button class="ifc-resource-browser__panel-close" type="button" data-mobile-filter-close aria-label="Close filters">
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <div class="ifc-resource-browser__controls">
      <div
        class="ifc-resource-filter"
        data-filter-kind="multi"
        data-filter-group="type"
        data-group-label="Reference Types"
        data-all-label="All Reference Types"
      >
        <button class="ifc-resource-filter__trigger" type="button" data-filter-toggle aria-expanded="false">
          <span class="ifc-resource-filter__trigger-label" data-filter-trigger-label>All Reference Types</span>
          <span class="ifc-resource-filter__trigger-icon" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
        </button>
        <div class="ifc-resource-filter__menu" data-filter-menu hidden>
          <div class="ifc-resource-filter__actions">
            <button type="button" data-filter-action="check-all">Check all</button>
            <button type="button" data-filter-action="clear-all">Clear all</button>
          </div>
          <div class="ifc-resource-filter__options">
            {% for type_slug in citation_types %}
              {% assign type_data = site.data["reference-types"][type_slug] %}
              <label class="ifc-resource-filter__option">
                <input type="checkbox" value="{{ type_slug }}" data-option-label="{{ type_data.label | default: type_slug }}">
                <span>{{ type_data.label | default: type_slug }}</span>
              </label>
            {% endfor %}
          </div>
        </div>
      </div>

      <div
        class="ifc-resource-filter"
        data-filter-kind="multi"
        data-filter-group="tag"
        data-group-label="Tags"
        data-all-label="All Tags"
      >
        <button class="ifc-resource-filter__trigger" type="button" data-filter-toggle aria-expanded="false">
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

      <div class="ifc-resource-filter ifc-resource-filter--sort" data-filter-kind="single" data-filter-group="sort">
        <button
          class="ifc-resource-filter__trigger ifc-resource-filter__trigger--icon"
          type="button"
          data-filter-toggle
          aria-expanded="false"
          aria-label="Sort references"
          title="Sort references"
        >
          <span class="screen-reader-text" data-sort-trigger-text>Sort references</span>
          <span class="ifc-resource-filter__sort-label" aria-hidden="true">Sort</span>
          <span aria-hidden="true"><i class="fas fa-sort-amount-down"></i></span>
        </button>
        <div class="ifc-resource-filter__menu ifc-resource-filter__menu--sort" data-filter-menu hidden>
          <p class="ifc-resource-filter__menu-title">Sort</p>
          <div class="ifc-resource-filter__choices">
            <button type="button" class="ifc-resource-filter__choice" data-sort-option="title-asc">Lexicographical by Title</button>
            <button type="button" class="ifc-resource-filter__choice" data-sort-option="author-asc">Lexicographical by Author</button>
            <button type="button" class="ifc-resource-filter__choice" data-sort-option="publication-asc">Lexicographical by Publication</button>
            <button type="button" class="ifc-resource-filter__choice" data-sort-option="recent-published-desc">Most Recently Published First</button>
            <button type="button" class="ifc-resource-filter__choice" data-sort-option="published-asc">Oldest Published First</button>
          </div>
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

  <section class="ifc-section ifc-section--tight" data-resource-results>
    <h2 class="screen-reader-text" data-resource-results-heading>All references</h2>
    <div class="ifc-glossary-list ifc-reference-list" data-resource-results-list>
      {% for citation_pair in site.data.citation %}
        {% assign source = citation_pair[1] %}
        {% assign display_title = source.short_title | default: source.title %}
        {% assign title_remainder = source.title | default: "" %}
        {% if display_title != "" and title_remainder != "" %}
          {% assign title_remainder = title_remainder | remove_first: display_title | replace_first: ': ', '' | replace_first: ':', '' | replace_first: ' - ', '' | strip %}
        {% endif %}
        {% assign type_data = site.data["reference-types"][source.type] %}
        {% assign type_label = type_data.label | default: source.type %}
        {% assign publication_sort = source.container_title | default: source.publication | default: source.journal %}
        {% if source.type == "book" or publication_sort == blank %}
          {% assign publication_sort = source.title %}
        {% endif %}
        {% capture first_author %}
          {% if source.authors and source.authors.size > 0 %}
            {% assign author = source.authors[0] %}
            {% assign author_name = author.literal %}
            {% if author_name == blank %}
              {% capture author_name %}{{ author.given }}{% if author.given and author.family %} {% endif %}{{ author.family }}{% if author.suffix %}, {{ author.suffix }}{% endif %}{% endcapture %}
            {% endif %}
            {{ author_name | strip }}
          {% elsif source.organization %}
            {{ source.organization }}
          {% endif %}
        {% endcapture %}
        {% assign first_author = first_author | strip %}
        {% capture published_sort %}
          {% if source.issued %}
            {{ source.issued.year }}{% if source.issued.month %}-{{ source.issued.month | prepend: '00' | slice: -2, 2 }}{% endif %}{% if source.issued.day %}-{{ source.issued.day | prepend: '00' | slice: -2, 2 }}{% endif %}
          {% elsif source.year %}
            {{ source.year }}
          {% endif %}
        {% endcapture %}
        {% assign published_sort = published_sort | strip %}
        <article
          class="ifc-panel ifc-glossary-entry ifc-reference-entry"
          id="reference-{{ source.id }}"
          data-result-item
          data-glossary-id="{{ source.id }}"
          data-title="{{ display_title | escape }}"
          data-author="{{ first_author | escape }}"
          data-publication="{{ publication_sort | escape }}"
          data-published="{{ published_sort }}"
          data-type="{{ source.type }}"
          data-tags="{{ source.tags | join: '|' }}"
          tabindex="-1"
        >
          <h2>
            {{ display_title }}
            {% if title_remainder != "" %}
              <span class="ifc-reference-entry__subtitle">{{ title_remainder }}</span>
            {% endif %}
          </h2>
          {% if type_label != "" %}
            <p class="ifc-reference-entry__short">{{ type_label }}</p>
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

          <div class="ifc-reference-entry__footer">
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

            <a class="ifc-glossary-entry__to-top" href="#references-top" data-resource-top-link aria-label="Back to top" title="Back to top">
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </article>
      {% endfor %}
    </div>
  </section>

  <div class="notice--info ifc-empty-state" data-filter-empty hidden>
    No references match the current filters.
  </div>
</div>
