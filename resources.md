---
title: "Resources"
date: "2026-04-14"
last_modified_at: "2026-05-20"
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
    {% assign media_item = site.data.visual-media | where: "id", item.slug | first %}
    {% if media_item %}
      {% if media_item.format == "image" %}
        {% assign has_image_resources = true %}
      {% elsif media_item["sub-format"] == "short-video" %}
        {% assign has_short_video_resources = true %}
      {% elsif media_item["sub-format"] == "long-video" %}
        {% assign has_long_video_resources = true %}
      {% elsif media_item.format == "audio" %}
        {% assign has_audio_resources = true %}
      {% endif %}
    {% endif %}
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
        {% capture recent_summary %}{% include word_boundary_truncate.html text=item.excerpt max=150 %}{% endcapture %}
        {% assign recent_date = item.date %}
        {% if item.format == "visual-media" %}
          {% assign recent_media = site.data.visual-media | where: "id", item.slug | first %}
          {% if recent_media %}
            {% capture recent_summary %}{% include word_boundary_truncate.html text=recent_media.description max=150 %}{% endcapture %}
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
        {% assign result_format_value = "article" %}
        {% assign result_type_label = "Article" %}
        {% assign result_published = item.date %}
        {% assign result_updated = item.last_modified_at | default: item.date %}
        {% assign result_author_name = nil %}
        {% capture result_summary %}{% include word_boundary_truncate.html text=item.excerpt max=180 %}{% endcapture %}
        {% assign include_result = true %}
        {% assign result_publication_status = item.publication_status.status | default: item.publication_status %}
        {% assign result_is_coming_soon = false %}
        {% if result_publication_status == "coming-soon" %}
          {% assign result_is_coming_soon = true %}
        {% endif %}
        {% assign result_publication_sort_order = item.publication_status.sort_order | default: 9999 %}

        {% if item.author %}
          {% if site.data.authors and site.data.authors[item.author] %}
            {% assign result_author_name = site.data.authors[item.author].name | default: site.data.authors[item.author] %}
          {% else %}
            {% assign result_author_name = item.author %}
          {% endif %}
        {% elsif item.authors and item.authors.size > 0 %}
          {% assign primary_author = item.authors[0] %}
          {% if site.data.authors and site.data.authors[primary_author] %}
            {% assign result_author_name = site.data.authors[primary_author].name | default: site.data.authors[primary_author] %}
          {% else %}
            {% assign result_author_name = primary_author %}
          {% endif %}
        {% elsif site.author %}
          {% assign result_author_name = site.author.name | default: site.author %}
        {% endif %}

        {% if item.format == "visual-media" %}
          {% assign media_item = site.data.visual-media | where: "id", item.slug | first %}
          {% if media_item %}
            {% assign result_published = media_item.published_at | default: item.date %}
            {% assign result_updated = item.last_modified_at | default: media_item.published_at | default: item.date %}
            {% capture result_summary %}{% include word_boundary_truncate.html text=media_item.description max=180 %}{% endcapture %}
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

        {% if result_is_coming_soon %}
          {% assign result_published = nil %}
          {% assign result_updated = nil %}
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
            data-publication-status="{{ result_publication_status }}"
            data-publication-order="{% if result_is_coming_soon %}{{ result_publication_sort_order }}{% endif %}"
            data-published="{% if result_published %}{{ result_published | date_to_xmlschema }}{% endif %}"
            data-updated="{% if result_updated %}{{ result_updated | date_to_xmlschema }}{% endif %}"
          >
            <div class="ifc-resource-result__meta">
              <p class="ifc-resource-card__eyebrow">{{ result_type_label }}</p>
              {% if result_is_coming_soon %}
                {% include publication_status_badge.html document=item variant="card" %}
              {% endif %}
              {% if result_format_value == "article" %}
                <ul class="ifc-resource-result__meta-list ifc-resource-result__meta-list--article" role="list">
                  {% if result_author_name %}
                    <li class="ifc-resource-result__meta-item">
                      <i class="fas fa-user" aria-hidden="true"></i>
                      <span>{{ result_author_name }}</span>
                    </li>
                  {% endif %}
                  {% if result_published %}
                    <li class="ifc-resource-result__meta-item" title="Published date">
                      <i class="far fa-calendar-alt" aria-hidden="true"></i>
                      <time datetime="{{ result_published | date_to_xmlschema }}">{{ result_published | date: site.date_format }}</time>
                    </li>
                  {% endif %}
                  {% if item.last_modified_at and result_is_coming_soon != true %}
                    <li class="ifc-resource-result__meta-item" title="Last modified date">
                      <i class="fas fa-history" aria-hidden="true"></i>
                      <time datetime="{{ item.last_modified_at | date_to_xmlschema }}">{{ item.last_modified_at | date: site.date_format }}</time>
                    </li>
                  {% endif %}
                </ul>
              {% elsif result_published %}
                <ul class="ifc-resource-result__meta-list" role="list">
                  <li class="ifc-resource-result__meta-item" title="Published date">
                    <i class="far fa-calendar-alt" aria-hidden="true"></i>
                    <time datetime="{{ result_published | date_to_xmlschema }}">{{ result_published | date: site.date_format }}</time>
                  </li>
                </ul>
              {% endif %}
            </div>
            <div class="ifc-resource-result__body">
              <h2 class="ifc-resource-result__title">{{ item.title }}</h2>
              <p class="ifc-resource-result__summary">{{ result_summary | strip }}</p>
              <div class="ifc-resource-result__taxonomy">
                {% if item.domains and item.domains.size > 0 %}
                  <div class="ifc-taxonomy-pills">
                    <span class="ifc-resource-result__print-label ifc-print-only">Domains:</span>
                    {% for domain in item.domains %}
                      <span class="ifc-taxonomy-pill">{{ domain | replace: "-", " " | capitalize }}</span>
                    {% endfor %}
                  </div>
                {% endif %}
                {% if item.concerns and item.concerns.size > 0 %}
                  <div class="ifc-taxonomy-pills">
                    <span class="ifc-resource-result__print-label ifc-print-only">Concerns:</span>
                    {% for concern in item.concerns %}
                      <span class="ifc-taxonomy-pill ifc-taxonomy-pill--soft">{{ concern | replace: "-", " " | capitalize }}</span>
                    {% endfor %}
                  </div>
                {% endif %}
                {% if item.tags and item.tags.size > 0 %}
                  <div class="ifc-taxonomy-pills ifc-resource-result__print-tags ifc-print-only">
                    <span class="ifc-resource-result__print-label">Tags:</span>
                    {% for tag_slug in item.tags %}
                      {% assign tag_data = site.data.tags[tag_slug] %}
                      <span class="ifc-taxonomy-pill ifc-taxonomy-pill--light">{{ tag_data.label | default: tag_slug }}</span>
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
