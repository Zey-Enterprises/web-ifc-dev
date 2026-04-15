---
title: "Resources"
classes: hide-title
permalink: /resources/
description: "A unified resource library for articles, visual media, and glossary-based learning."
tagline: "This library is organized around durable ideas, practical problems, and reusable concepts so written pieces and visual media reinforce each other instead of living in separate silos."
header:
  overlay_image: /assets/images/ifc-resources-hero-banner-1.jpg
  overlay_filter: linear-gradient(135deg, rgba(17, 33, 45, 0.62), rgba(17, 33, 45, 0.24))
  kicker: Resource library
  actions:
  - label: Go to Glossary
    url: /resources/glossary/
    class: btn--light-outline
---

{% assign resources_path = '/resources/' | relative_url %}
{% assign glossary_path = '/resources/glossary/' | relative_url %}
{% assign recent_resources = site.resources | sort: "date" | reverse %}
{% assign concern_values = "fat-loss,muscle-gain,body-composition,adherence,sleep,stress,energy,recovery,behavior-change,mindset,self-direction,busy-life,beginners,maintenance,performance" | split: "," %}
{% assign domain_values = "diet,physical-exercise,psychology,philosophy" | split: "," %}

<div class="ifc-resource-browser" data-resource-browser data-resource-path="{{ resources_path }}" data-default-sort="recent-published-desc">
  <div class="ifc-resource-browser__toolbar">
    <button
      class="ifc-resource-browser__mobile-toggle"
      type="button"
      data-mobile-filter-toggle
      aria-expanded="false"
      aria-controls="ifc-resource-filter-panel"
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
        aria-label="Sort resources"
        title="Sort resources"
      >
        <span class="screen-reader-text" data-mobile-sort-trigger-text>Sort resources</span>
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

  <div class="ifc-resource-browser__panel" id="ifc-resource-filter-panel" data-mobile-filter-panel>
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
        data-filter-group="format"
        data-group-label="Formats"
        data-all-label="All Formats"
      >
        <button class="ifc-resource-filter__trigger" type="button" data-filter-toggle aria-expanded="false">
          <span class="ifc-resource-filter__trigger-label" data-filter-trigger-label>All Formats</span>
          <span class="ifc-resource-filter__trigger-icon" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
        </button>
        <div class="ifc-resource-filter__menu" data-filter-menu hidden>
          <div class="ifc-resource-filter__actions">
            <button type="button" data-filter-action="check-all">Check all</button>
            <button type="button" data-filter-action="clear-all">Clear all</button>
          </div>
          <div class="ifc-resource-filter__options">
            <label class="ifc-resource-filter__option">
              <input type="checkbox" value="article" data-option-label="Article">
              <span>Article</span>
            </label>
            <label class="ifc-resource-filter__option">
              <input type="checkbox" value="image" data-option-label="Image">
              <span>Image</span>
            </label>
            <label class="ifc-resource-filter__option">
              <input type="checkbox" value="short-video" data-option-label="Short Video">
              <span>Short Video</span>
            </label>
            <label class="ifc-resource-filter__option">
              <input type="checkbox" value="long-video" data-option-label="Long-Form Video">
              <span>Long-Form Video</span>
            </label>
            <label class="ifc-resource-filter__option">
              <input type="checkbox" value="audio" data-option-label="Audio">
              <span>Audio</span>
            </label>
          </div>
        </div>
      </div>

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
              <label class="ifc-resource-filter__option">
                <input type="checkbox" value="{{ domain }}" data-option-label="{{ domain | replace: '-', ' ' | capitalize }}">
                <span>{{ domain | replace: "-", " " | capitalize }}</span>
              </label>
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
              <label class="ifc-resource-filter__option">
                <input type="checkbox" value="{{ concern }}" data-option-label="{{ concern | replace: '-', ' ' | capitalize }}">
                <span>{{ concern | replace: "-", " " | capitalize }}</span>
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
            {% for tag_pair in site.data.tags %}
              {% assign tag_slug = tag_pair[0] %}
              {% assign tag_data = tag_pair[1] %}
              <label class="ifc-resource-filter__option">
                <input type="checkbox" value="{{ tag_slug }}" data-option-label="{{ tag_data.label }}">
                <span>{{ tag_data.label }}</span>
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
          aria-label="Sort resources"
          title="Sort resources"
        >
          <span class="screen-reader-text" data-sort-trigger-text>Sort resources</span>
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

  <section class="ifc-section ifc-section--tight" data-resource-landing-section>
    <h2>Recent content</h2>
    <div class="ifc-grid">
      {% for item in recent_resources limit:6 %}
        {% assign recent_label = "Article" %}
        {% assign recent_summary = item.excerpt | default: item.description | strip_html | truncate: 150 %}
        {% assign recent_date = item.date %}
        {% if item.format == "visual-media" %}
          {% assign recent_media = site.data.visual-media | where: "id", item.slug | first %}
          {% if recent_media %}
            {% assign recent_summary = recent_media.description | default: recent_summary %}
            {% assign recent_date = recent_media.published_at | default: item.date %}
            {% if recent_media.format == "image" %}
              {% assign recent_label = "Image" %}
            {% elsif recent_media["sub-format"] == "short-video" %}
              {% assign recent_label = "Short Video" %}
            {% elsif recent_media["sub-format"] == "long-video" %}
              {% assign recent_label = "Long-Form Video" %}
            {% else %}
              {% assign recent_label = "Visual Media" %}
            {% endif %}
          {% endif %}
        {% endif %}
        <a class="ifc-card-link" href="{{ item.url }}">
          <p class="ifc-resource-card__eyebrow">{{ recent_label }}</p>
          <strong>{{ item.title }}</strong>
          {% if recent_date %}
            <p class="ifc-resource-card__meta">{{ recent_date | date: site.date_format }}</p>
          {% endif %}
          <p>{{ recent_summary }}</p>
        </a>
      {% endfor %}
    </div>
  </section>

  <section class="ifc-section ifc-section--tight" data-resource-landing-section>
    <h2>Browse by concern</h2>
    <div class="ifc-topic-grid">
      {% for concern in concern_values %}
        <a class="ifc-topic" href="{{ resources_path }}?concern={{ concern }}" data-resource-shortcut>{{ concern | replace: "-", " " | capitalize }}</a>
      {% endfor %}
    </div>
  </section>

  <section class="ifc-section ifc-section--tight" data-resource-landing-section>
    <h2>Browse by domain</h2>
    <div class="ifc-grid">
      <a class="ifc-card-link" href="{{ resources_path }}?domain=diet" data-resource-shortcut>
        <strong>Diet</strong>
        <p>Calories, protein, appetite regulation, meal structure, dieting phases, and food environment.</p>
      </a>
      <a class="ifc-card-link" href="{{ resources_path }}?domain=physical-exercise" data-resource-shortcut>
        <strong>Physical exercise</strong>
        <p>Training structure, progression, performance, recovery, and how exercise supports body composition.</p>
      </a>
      <a class="ifc-card-link" href="{{ resources_path }}?domain=psychology" data-resource-shortcut>
        <strong>Psychology</strong>
        <p>Adherence, behavior change, stress, state regulation, and the realities of execution under pressure.</p>
      </a>
      <a class="ifc-card-link" href="{{ resources_path }}?domain=philosophy" data-resource-shortcut>
        <strong>Philosophy</strong>
        <p>Self-direction, judgment, values, and the wider standards that make fitness sustainable and coherent.</p>
      </a>
    </div>
  </section>

  <section class="ifc-section ifc-section--tight" data-resource-landing-section>
    <h2>Browse by format</h2>
    <div class="ifc-grid">
      <a class="ifc-card-link" href="{{ resources_path }}?format=article" data-resource-shortcut>
        <strong>Article</strong>
        <p>Longer-form written resources designed to hold up as a durable reference library.</p>
      </a>
      <a class="ifc-card-link" href="{{ resources_path }}?format=image&format=short-video&format=long-video" data-resource-shortcut>
        <strong>Visual media</strong>
        <p>Image and video content indexed locally so platform distribution still feeds back into the site.</p>
      </a>
      <a class="ifc-card-link" href="{{ resources_path }}?format=audio" data-resource-shortcut>
        <strong>Audio</strong>
        <p>Reserved for future clips, interviews, and audio-based teaching when that becomes part of the library.</p>
      </a>
    </div>
  </section>

  <section class="ifc-section ifc-section--tight" data-resource-landing-section>
    <h2>Glossary</h2>
    <div class="ifc-grid">
      <a class="ifc-card-link" href="{{ glossary_path }}">
        <strong>Glossary</strong>
        <p>Canonical definitions for recurring concepts, with related resources surfaced through shared tags.</p>
      </a>
    </div>
  </section>

  <section class="ifc-section ifc-section--tight" data-resource-results>
    <h2 data-resource-results-heading>All resources</h2>
    <div class="ifc-resource-results" data-resource-results-list>
      {% for item in site.resources %}
        {% assign result_format_value = "article" %}
        {% assign result_type_label = "Article" %}
        {% assign result_published = item.date %}
        {% assign result_updated = item.last_modified_at | default: item.date %}
        {% assign result_summary = item.excerpt | default: item.description | strip_html | truncate: 180 %}
        {% assign include_result = true %}

        {% if item.format == "visual-media" %}
          {% assign media_item = site.data.visual-media | where: "id", item.slug | first %}
          {% if media_item %}
            {% assign result_published = media_item.published_at | default: item.date %}
            {% assign result_updated = item.last_modified_at | default: media_item.published_at | default: item.date %}
            {% assign result_summary = media_item.description | default: result_summary %}
            {% if media_item.format == "image" %}
              {% assign result_format_value = "image" %}
              {% assign result_type_label = "Image" %}
            {% elsif media_item["sub-format"] == "short-video" %}
              {% assign result_format_value = "short-video" %}
              {% assign result_type_label = "Short Video" %}
            {% elsif media_item["sub-format"] == "long-video" %}
              {% assign result_format_value = "long-video" %}
              {% assign result_type_label = "Long-Form Video" %}
            {% elsif media_item.format == "audio" %}
              {% assign result_format_value = "audio" %}
              {% assign result_type_label = "Audio" %}
            {% endif %}
          {% else %}
            {% assign include_result = false %}
          {% endif %}
        {% endif %}

        {% if include_result %}
          <a
            class="ifc-resource-result"
            href="{{ item.url }}"
            data-result-item
            data-title="{{ item.title | escape }}"
            data-format="{{ result_format_value }}"
            data-domain="{{ item.domains | join: '|' }}"
            data-concern="{{ item.concerns | join: '|' }}"
            data-tags="{{ item.tags | join: '|' }}"
            data-published="{{ result_published | date_to_xmlschema }}"
            data-updated="{{ result_updated | date_to_xmlschema }}"
          >
            <div class="ifc-resource-result__meta">
              <p class="ifc-resource-card__eyebrow">{{ result_type_label }}</p>
              {% if result_published %}
                <p class="ifc-resource-result__date">{{ result_published | date: site.date_format }}</p>
              {% endif %}
            </div>
            <div class="ifc-resource-result__body">
              <h2 class="ifc-resource-result__title">{{ item.title }}</h2>
              <p class="ifc-resource-result__summary">{{ result_summary }}</p>
              <div class="ifc-resource-result__taxonomy">
                {% if item.domains and item.domains.size > 0 %}
                  <div class="ifc-taxonomy-pills">
                    {% for domain in item.domains %}
                      <span class="ifc-taxonomy-pill">{{ domain | replace: "-", " " | capitalize }}</span>
                    {% endfor %}
                  </div>
                {% endif %}
                {% if item.concerns and item.concerns.size > 0 %}
                  <div class="ifc-taxonomy-pills">
                    {% for concern in item.concerns %}
                      <span class="ifc-taxonomy-pill ifc-taxonomy-pill--soft">{{ concern | replace: "-", " " | capitalize }}</span>
                    {% endfor %}
                  </div>
                {% endif %}
              </div>
            </div>
          </a>
        {% endif %}
      {% endfor %}
    </div>

    <div class="notice--info ifc-empty-state" data-filter-empty hidden>
      No resources match the current filter set.
    </div>
  </section>
</div>
