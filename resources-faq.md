---
title: "Frequently Asked Questions"
permalink: /resources/faq/
excerpt: "FAQ library for substantive fitness questions."
toc_widget: 
  enabled: true
  min_level: 2
  max_level: 4
header:
  kicker: "Resource Library"
  overlay_filter: linear-gradient(135deg, rgba(17, 33, 45, 0.7), rgba(17, 33, 45, 0.22))
  actions:
  - label: ← Back to All Resources
    url: /resources/
    class: btn--light-outline
  - label: Go to Glossary
    url: /resources/glossary/
    class: btn--light-outline
  - label: Go to References
    url: /resources/references/
    class: btn--light-outline
---

{% assign faq_path = '/resources/faq/' | relative_url %}
{% assign faq_entries = site.resources | where: "resource_type", "faq" | sort_natural: "title" %}
{% assign concern_values = "fat-loss,muscle-gain,body-composition,adherence,sleep,stress,energy,recovery,behavior-change,mindset,self-direction,busy-life,beginners,maintenance,performance" | split: "," %}
{% assign domain_values = "diet,physical-exercise,psychology,philosophy" | split: "," %}
{% assign faq_domains = "" | split: "" %}
{% assign faq_concerns = "" | split: "" %}
{% assign faq_tags = "" | split: "" %}
{% for item in faq_entries %}
  {% assign faq_domains = faq_domains | concat: item.domains %}
  {% assign faq_concerns = faq_concerns | concat: item.concerns %}
  {% assign faq_tags = faq_tags | concat: item.tags %}
{% endfor %}
{% assign faq_domains = faq_domains | uniq %}
{% assign faq_concerns = faq_concerns | uniq %}
{% assign faq_tags = faq_tags | uniq | sort_natural %}

<div class="ifc-resource-browser ifc-resource-browser--faq" data-resource-browser data-resource-path="{{ faq_path }}" data-default-sort="lexicographical" data-result-label-singular="FAQ" data-result-label-plural="FAQs" data-citation-numbering="global">
  <div class="ifc-resource-browser__toolbar">
    <button
      class="ifc-resource-browser__mobile-toggle"
      type="button"
      data-mobile-filter-toggle
      aria-expanded="false"
      aria-controls="ifc-faq-filter-panel"
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
        aria-label="Sort FAQs"
        title="Sort FAQs"
      >
        <span class="screen-reader-text" data-mobile-sort-trigger-text>Sort FAQs</span>
        <span aria-hidden="true"><i class="fas fa-sort-amount-down"></i></span>
      </button>
      <div class="ifc-resource-filter__menu ifc-resource-filter__menu--sort" data-mobile-sort-menu hidden>
        <p class="ifc-resource-filter__menu-title">Sort</p>
        <div class="ifc-resource-filter__choices">
          <button type="button" class="ifc-resource-filter__choice" data-mobile-sort-option="lexicographical">Lexicographical</button>
          <button type="button" class="ifc-resource-filter__choice" data-mobile-sort-option="recent-published-desc">Most Recently Published First</button>
          <button type="button" class="ifc-resource-filter__choice" data-mobile-sort-option="published-asc">Oldest Published First</button>
          <button type="button" class="ifc-resource-filter__choice" data-mobile-sort-option="recent-updated-desc">Most Recently Updated First</button>
          <button type="button" class="ifc-resource-filter__choice" data-mobile-sort-option="updated-asc">Oldest Updated First</button>
        </div>
      </div>
    </div>
  </div>

  <div class="ifc-resource-browser__backdrop" data-mobile-filter-backdrop hidden></div>

  <div class="ifc-resource-browser__panel" id="ifc-faq-filter-panel" data-mobile-filter-panel>
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
        data-filter-group="domain"
        data-group-label="Domains"
        data-all-label="All Domains"
      >
        <button class="ifc-resource-filter__trigger" type="button" data-filter-toggle aria-expanded="false">
          <span class="ifc-resource-filter__trigger-label" data-filter-trigger-label>All Domains</span>
          <span class="ifc-resource-filter__trigger-icon" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
        </button>
        <div class="ifc-resource-filter__menu" data-filter-menu hidden>
          <div class="ifc-resource-filter__actions">
            <button type="button" data-filter-action="check-all">Check all</button>
            <button type="button" data-filter-action="clear-all">Clear all</button>
          </div>
          <div class="ifc-resource-filter__options">
            {% for domain in domain_values %}
              {% if faq_domains contains domain %}
                <label class="ifc-resource-filter__option">
                  <input type="checkbox" value="{{ domain }}" data-option-label="{{ domain | replace: '-', ' ' | capitalize }}">
                  <span>{{ domain | replace: "-", " " | capitalize }}</span>
                </label>
              {% endif %}
            {% endfor %}
          </div>
        </div>
      </div>

      <div
        class="ifc-resource-filter"
        data-filter-kind="multi"
        data-filter-group="concern"
        data-group-label="Concerns"
        data-all-label="All Concerns"
      >
        <button class="ifc-resource-filter__trigger" type="button" data-filter-toggle aria-expanded="false">
          <span class="ifc-resource-filter__trigger-label" data-filter-trigger-label>All Concerns</span>
          <span class="ifc-resource-filter__trigger-icon" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
        </button>
        <div class="ifc-resource-filter__menu" data-filter-menu hidden>
          <div class="ifc-resource-filter__actions">
            <button type="button" data-filter-action="check-all">Check all</button>
            <button type="button" data-filter-action="clear-all">Clear all</button>
          </div>
          <div class="ifc-resource-filter__options">
            {% for concern in concern_values %}
              {% if faq_concerns contains concern %}
                <label class="ifc-resource-filter__option">
                  <input type="checkbox" value="{{ concern }}" data-option-label="{{ concern | replace: '-', ' ' | capitalize }}">
                  <span>{{ concern | replace: "-", " " | capitalize }}</span>
                </label>
              {% endif %}
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
            {% for tag_slug in faq_tags %}
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
          aria-label="Sort FAQs"
          title="Sort FAQs"
        >
          <span class="screen-reader-text" data-sort-trigger-text>Sort FAQs</span>
          <span class="ifc-resource-filter__sort-label" aria-hidden="true">Sort</span>
          <span aria-hidden="true"><i class="fas fa-sort-amount-down"></i></span>
        </button>
        <div class="ifc-resource-filter__menu ifc-resource-filter__menu--sort" data-filter-menu hidden>
        <p class="ifc-resource-filter__menu-title">Sort</p>
        <div class="ifc-resource-filter__choices">
          <button type="button" class="ifc-resource-filter__choice" data-sort-option="lexicographical">Lexicographical</button>
          <button type="button" class="ifc-resource-filter__choice" data-sort-option="recent-published-desc">Most Recently Published First</button>
          <button type="button" class="ifc-resource-filter__choice" data-sort-option="published-asc">Oldest Published First</button>
          <button type="button" class="ifc-resource-filter__choice" data-sort-option="recent-updated-desc">Most Recently Updated First</button>
          <button type="button" class="ifc-resource-filter__choice" data-sort-option="updated-asc">Oldest Updated First</button>
        </div>
      </div>
    </div>
    </div>
  </div>

  <div class="ifc-resource-browser__status">
    <div class="ifc-active-filters" data-active-filters hidden></div>
    <div class="ifc-resource-browser__status-row">
      <p class="ifc-filter-summary" data-filter-summary hidden></p>
    </div>
  </div>

  <section class="ifc-section ifc-section--tight" data-resource-results>
    <h2 class="screen-reader-text" data-resource-results-heading>All FAQs</h2>
    <div class="ifc-faq-list" data-resource-results-list>
      {% for item in faq_entries %}
        <article
          class="ifc-panel ifc-faq-entry"
          id="{{ item.slug }}"
          data-result-item
          data-title="{{ item.title | escape }}"
          data-domain="{{ item.domains | join: '|' }}"
          data-concern="{{ item.concerns | join: '|' }}"
          data-tags="{{ item.tags | join: '|' }}"
          data-published="{{ item.date | date: '%Y-%m-%d' }}"
          data-updated="{{ item.last_modified_at | default: item.date | date: '%Y-%m-%d' }}"
          tabindex="-1"
        >
          <p class="ifc-resource-card__eyebrow">FAQ</p>
          <h2 class="ifc-faq-entry__title">{{ item.title }}</h2>
          <div class="ifc-faq-entry__content">
            {{ item.content }}
          </div>

          <div class="ifc-faq-entry__meta">
            {% if item.domains and item.domains.size > 0 %}
              <div class="ifc-faq-entry__meta-group">
                <p class="ifc-faq-entry__label">Domain</p>
                <p class="ifc-taxonomy-pills">
                  {% for domain in item.domains %}
                    <span class="ifc-taxonomy-pill">{{ domain | replace: "-", " " | capitalize }}</span>
                  {% endfor %}
                </p>
              </div>
            {% endif %}

            {% if item.concerns and item.concerns.size > 0 %}
              <div class="ifc-faq-entry__meta-group">
                <p class="ifc-faq-entry__label">Concerns</p>
                <p class="ifc-taxonomy-pills">
                  {% for concern in item.concerns %}
                    <span class="ifc-taxonomy-pill ifc-taxonomy-pill--soft">{{ concern | replace: "-", " " | capitalize }}</span>
                  {% endfor %}
                </p>
              </div>
            {% endif %}

            {% if item.tags and item.tags.size > 0 %}
              <div class="ifc-faq-entry__meta-group">
                <p class="ifc-faq-entry__label">Tags</p>
                <p class="ifc-taxonomy-pills">
                  {% for tag_slug in item.tags %}
                    {% assign tag_data = site.data.tags[tag_slug] %}
                    <span class="ifc-taxonomy-pill ifc-taxonomy-pill--light">{{ tag_data.label | default: tag_slug }}</span>
                  {% endfor %}
                </p>
              </div>
            {% endif %}
          </div>
        </article>
      {% endfor %}
    </div>

    <div class="notice--info ifc-empty-state" data-filter-empty hidden>
      No FAQs match the current filter set.
    </div>
  </section>
</div>
