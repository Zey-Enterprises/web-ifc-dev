---
title: "Media Archive"
permalink: /media/library/
description: "Archive page for media entries."
---

<div class="ifc-grid">
  {% assign media_entries = site.media | sort: "sort_order" %}
  {% for item in media_entries %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.title }}</strong>
      <p>{{ item.platform }}{% if item.content_type %} · {{ item.content_type }}{% endif %}</p>
      <p>{{ item.excerpt | strip_html | truncate: 140 }}</p>
    </a>
  {% endfor %}
</div>
