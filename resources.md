---
title: "Resources"
date: "2026-04-14"
last_modified_at: "2026-05-25"
# classes: hide-title
permalink: /resources/
excerpt: "A unified library for articles, visual media, fitness FAQs, references, and glossary-based learning."
header:
  kicker: "Resource Library"
  overlay_title: "Resources"
  actions:
  - label: Glossary
    url: /resources/glossary/
    class: btn--light-outline
  - label: Fitness FAQ
    url: /resources/faq/
    class: btn--light-outline
  - label: References
    url: /resources/references/
    class: btn--light-outline
---

{% assign resources_path = '/resources/' | relative_url %}
{% assign glossary_path = '/resources/glossary/' | relative_url %}
{% assign faq_path = '/resources/faq/' | relative_url %}
{% assign references_path = '/resources/references/' | relative_url %}
{% assign content_resources = site.resources | where_exp: "item", "item.resource_type != 'faq'" %}
{% assign published_content_resources = content_resources | where_exp: "item", "item.publication_status.status != 'coming-soon'" %}
{% assign recent_resources = published_content_resources | sort: "date" | reverse %}
{% assign domain_values = "diet,physical-exercise,psychology,philosophy" | split: "," %}
{% assign has_article_resources = false %}
{% assign has_image_resources = false %}
{% assign has_short_video_resources = false %}
{% assign has_long_video_resources = false %}
{% assign has_audio_resources = false %}
{% for item in published_content_resources %}
  {% if item.format == "visual-media" %}
    {% capture item_visual_media_type %}{% include visual_media_type.html document=item %}{% endcapture %}
    {% assign item_visual_media_type = item_visual_media_type | strip %}
    {% if item_visual_media_type == "image" %}
      {% assign has_image_resources = true %}
    {% elsif item_visual_media_type == "short-video" %}
      {% assign has_short_video_resources = true %}
    {% elsif item_visual_media_type == "long-video" %}
      {% assign has_long_video_resources = true %}
    {% elsif item_visual_media_type == "audio" %}
      {% assign has_audio_resources = true %}
    {% endif %}
  {% elsif item.format == "audio" %}
    {% assign has_audio_resources = true %}
  {% else %}
    {% assign has_article_resources = true %}
  {% endif %}
{% endfor %}
{% assign has_visual_media_resources = false %}
{% if has_image_resources or has_short_video_resources or has_long_video_resources %}
  {% assign has_visual_media_resources = true %}
{% endif %}
{% assign format_category_count = 0 %}
{% if has_article_resources %}
  {% assign format_category_count = format_category_count | plus: 1 %}
{% endif %}
{% if has_visual_media_resources %}
  {% assign format_category_count = format_category_count | plus: 1 %}
{% endif %}
{% if has_audio_resources %}
  {% assign format_category_count = format_category_count | plus: 1 %}
{% endif %}
{% assign visual_media_format_query = "" %}
{% if has_image_resources %}
  {% assign visual_media_format_query = visual_media_format_query | append: "&format=image" %}
{% endif %}
{% if has_short_video_resources %}
  {% assign visual_media_format_query = visual_media_format_query | append: "&format=short-video" %}
{% endif %}
{% if has_long_video_resources %}
  {% assign visual_media_format_query = visual_media_format_query | append: "&format=long-video" %}
{% endif %}
{% assign visual_media_format_query = visual_media_format_query | remove_first: "&" %}

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
            {% if has_article_resources %}
              <label class="ifc-resource-filter__option">
                <input type="checkbox" value="article" data-option-label="Article">
                <span>Article</span>
              </label>
            {% endif %}
            {% if has_image_resources %}
              <label class="ifc-resource-filter__option">
                <input type="checkbox" value="image" data-option-label="Image">
                <span>Image</span>
              </label>
            {% endif %}
            {% if has_short_video_resources %}
              <label class="ifc-resource-filter__option">
                <input type="checkbox" value="short-video" data-option-label="Short Video">
                <span>Short Video</span>
              </label>
            {% endif %}
            {% if has_long_video_resources %}
              <label class="ifc-resource-filter__option">
                <input type="checkbox" value="long-video" data-option-label="Long-Form Video">
                <span>Long-Form Video</span>
              </label>
            {% endif %}
            {% if has_audio_resources %}
              <label class="ifc-resource-filter__option">
                <input type="checkbox" value="audio" data-option-label="Audio">
                <span>Audio</span>
              </label>
            {% endif %}
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
            {% for concern_pair in site.data.concerns %}
              {% assign concern = concern_pair[0] %}
              {% assign concern_data = concern_pair[1] %}
              <label class="ifc-resource-filter__option">
                <input type="checkbox" value="{{ concern }}" data-option-label="{{ concern_data.label | default: concern }}">
                <span>{{ concern_data.label | default: concern }}</span>
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
      <p class="ifc-print-resource-filters ifc-print-only" data-print-filter-summary hidden></p>
      <p class="ifc-print-resource-sort ifc-print-only" data-print-sort-summary></p>
      <p class="ifc-print-resource-count ifc-print-only" data-print-count-summary></p>
    </div>
  </div>

  <section class="ifc-section ifc-section--tight" data-resource-landing-section>
    <h2>Recent content</h2>
    <div class="ifc-grid">
      {% for item in recent_resources limit:6 %}
        {% assign recent_label = "Article" %}
        {% assign recent_source_summary = item.description | default: item.excerpt %}
        {% capture recent_summary %}{% include word_boundary_truncate.html text=recent_source_summary max=150 %}{% endcapture %}
        {% assign recent_date = item.date %}
        {% assign recent_thumbnail = "" %}
        {% if item.format == "visual-media" %}
          {% capture recent_label %}{% include visual_media_type_label.html document=item %}{% endcapture %}
          {% assign recent_label = recent_label | strip %}
          {% capture recent_thumbnail %}{% include resolve_page_image.html page=item bucket="visual-media/thumbnails" %}{% endcapture %}
          {% assign recent_thumbnail = recent_thumbnail | strip %}
        {% elsif item.format == "audio" %}
          {% assign recent_label = "Audio" %}
        {% endif %}
        <a class="ifc-card-link" href="{{ item.url }}">
          <p class="ifc-resource-card__eyebrow">{{ recent_label }}</p>
          {% if recent_thumbnail != "" %}
            <span class="ifc-resource-card__thumbnail">
              <img src="{{ recent_thumbnail | relative_url }}" alt="" loading="lazy" decoding="async">
              <span class="ifc-resource-card__thumbnail-title">{{ item.title }}</span>
            </span>
          {% else %}
            <strong>{{ item.title }}</strong>
          {% endif %}
          {% if recent_date %}
            <p class="ifc-resource-card__meta">{{ recent_date | date: site.date_format }}</p>
          {% endif %}
          <p>{{ recent_summary | strip }}</p>
        </a>
      {% endfor %}
    </div>
  </section>

  <section class="ifc-section ifc-section--tight" data-resource-landing-section>
    <h2>Browse by concern</h2>
    <div class="ifc-topic-grid">
      {% for concern_pair in site.data.concerns %}
        {% assign concern = concern_pair[0] %}
        {% assign concern_data = concern_pair[1] %}
        <a class="ifc-topic" href="{{ resources_path }}?concern={{ concern }}" data-resource-shortcut>{{ concern_data.label | default: concern }}</a>
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

  {% if format_category_count > 1 %}
    <section class="ifc-section ifc-section--tight" data-resource-landing-section>
      <h2>Browse by format</h2>
      <div class="ifc-grid">
        {% if has_article_resources %}
          <a class="ifc-card-link" href="{{ resources_path }}?format=article" data-resource-shortcut>
            <strong>Article</strong>
            <p>Longer-form written resources designed to hold up as a durable reference library.</p>
          </a>
        {% endif %}
        {% if has_visual_media_resources %}
          <a class="ifc-card-link" href="{{ resources_path }}?{{ visual_media_format_query }}" data-resource-shortcut>
            <strong>Visual media</strong>
            <p>Image and video content indexed locally so platform distribution still feeds back into the site.</p>
          </a>
        {% endif %}
        {% if has_audio_resources %}
          <a class="ifc-card-link" href="{{ resources_path }}?format=audio" data-resource-shortcut>
            <strong>Audio</strong>
            <p>Audio resources for clips, interviews, and teaching you can listen to away from the page.</p>
          </a>
        {% endif %}
      </div>
    </section>
  {% endif %}

  <section class="ifc-section ifc-section--tight" data-resource-landing-section>
    <h2>Learning tools</h2>
    {% include faq_carousel.html %}
    <div class="ifc-grid">
      <a class="ifc-card-link" href="{{ glossary_path }}">
        <strong>Glossary</strong>
        <p>Canonical definitions for recurring concepts, with related resources surfaced through shared tags.</p>
      </a>
      <a class="ifc-card-link" href="{{ faq_path }}">
        <strong>Frequently Asked Questions</strong>
        <p>Practical answers to common diet and body-composition questions, organized by domain, concern, and tag.</p>
      </a>
      <a class="ifc-card-link" href="{{ references_path }}">
        <strong>References</strong>
        <p>The citation library behind the resource annotations, collected into a single browsable page.</p>
      </a>
    </div>
  </section>

  <section class="ifc-section ifc-section--tight" data-resource-results>
    <h2 data-resource-results-heading>All resources</h2>
    <div class="ifc-resource-results" data-resource-results-list>
      {% for item in content_resources %}
        {% include resource_result_card.html document=item show_taxonomy=true data_attrs=true title_level=2 %}
      {% endfor %}
    </div>

    <div class="notice--info ifc-empty-state" data-filter-empty hidden>
      No resources match the current filter set.
    </div>
  </section>
</div>
