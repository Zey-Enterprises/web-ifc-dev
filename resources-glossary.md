---
title: "Glossary"
permalink: /resources/glossary/
description: "Single-page glossary for recurring concepts across the resource library."
header:
  kicker: Glossary
  overlay_image: /assets/images/ifc-hero-banner-reading-1.jpg
  overlay_filter: linear-gradient(135deg, rgba(17, 33, 45, 0.7), rgba(17, 33, 45, 0.22))
  actions:
  - label: ← Back to All Resources
    url: /resources/
    class: btn--light-outline
---

{% assign glossary_path = '/resources/glossary/' | relative_url %}
{% assign glossary_tags = "" | split: "" %}
{% for glossary_pair in site.data.glossary %}
  {% assign glossary_tags = glossary_tags | concat: glossary_pair[1].tags %}
{% endfor %}
{% assign glossary_tags = glossary_tags | uniq | sort_natural %}

<div id="glossary-top" class="ifc-resource-browser ifc-resource-browser--glossary" data-glossary-browser data-glossary-path="{{ glossary_path }}">
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
      <button class="ifc-resource-filter__trigger" type="button" data-filter-toggle aria-expanded="false" aria-controls="ifc-glossary-filter-panel">
        <span class="ifc-resource-filter__trigger-label" data-filter-trigger-label>All Tags</span>
        <span class="ifc-resource-filter__trigger-icon" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
      </button>
      <div class="ifc-resource-filter__menu" data-filter-menu hidden>
        <div class="ifc-resource-filter__actions">
          <button type="button" data-filter-action="check-all">Check all</button>
          <button type="button" data-filter-action="clear-all">Clear all</button>
        </div>
        <div class="ifc-resource-filter__options">
          {% for tag_slug in glossary_tags %}
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

  <div class="ifc-resource-browser__panel ifc-resource-browser__panel--glossary" id="ifc-glossary-filter-panel" data-mobile-filter-panel>
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
          {% for tag_slug in glossary_tags %}
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

  <div class="ifc-glossary-list" data-glossary-list>
    {% for glossary_pair in site.data.glossary %}
      {% assign entry = glossary_pair[1] %}
      <article
        class="ifc-panel ifc-glossary-entry"
        id="glossary-{{ entry.id }}"
        data-filter-item
        data-glossary-id="{{ entry.id }}"
        data-title="{{ entry.term | escape }}"
        data-tags="{{ entry.tags | join: '|' }}"
        tabindex="-1"
      >
        <h2>{{ entry.term }}</h2>
        <p class="ifc-glossary-entry__short">{{ entry.short }}</p>
        <p>{{ entry.long }}</p>

        {% if entry.tags and entry.tags.size > 0 %}
          <div class="ifc-glossary-entry__meta-group">
            <p class="ifc-glossary-entry__label">Tags</p>
            <p class="ifc-taxonomy-pills">
              {% for tag_slug in entry.tags %}
                {% assign tag_data = site.data.tags[tag_slug] %}
                <span class="ifc-taxonomy-pill ifc-taxonomy-pill--light">{{ tag_data.label | default: tag_slug }}</span>
              {% endfor %}
            </p>
          </div>
        {% endif %}

        {% if entry.see_also and entry.see_also.size > 0 %}
          <div class="ifc-glossary-entry__meta-group">
            <p class="ifc-glossary-entry__label">See also</p>
            <p class="ifc-taxonomy-pills">
              {% for related_id in entry.see_also %}
                {% assign related_entry = site.data.glossary[related_id] %}
                <a class="ifc-annotation__pill ifc-glossary-entry__see-also" href="#glossary-{{ related_id }}" data-related-glossary-link="{{ related_id }}">
                  {{ related_entry.term | default: related_id }}
                </a>
              {% endfor %}
            </p>
          </div>
        {% endif %}

        {% if entry.links and entry.links.size > 0 %}
          <div class="ifc-related-list">
            <p class="ifc-glossary-entry__label">Related resources</p>
            <ul class="ifc-list">
              {% for link in entry.links %}
                <li>{% include _link.html href=link.url label=link.label newtab=link.newtab default_newtab=false %}</li>
              {% endfor %}
            </ul>
          </div>
        {% endif %}

        <a class="ifc-glossary-entry__to-top" href="#glossary-top" data-glossary-top-link aria-label="Back to top" title="Back to top">
          <span aria-hidden="true">↑</span>
        </a>
      </article>
    {% endfor %}
  </div>

  <div class="notice--info ifc-empty-state" data-filter-empty hidden>
    No glossary entries match the current tag filter.
  </div>
</div>
