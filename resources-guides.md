---
title: "Guides"
permalink: /resources/guides/
description: "Archive page for long-form guide content."
---

These guides are designed as evergreen reference material rather than fleeting content.

<div class="ifc-grid">
  {% assign guides = site.guides | sort: "title" %}
  {% for item in guides %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.title }}</strong>
      <p>{{ item.excerpt | strip_html | truncate: 150 }}</p>
    </a>
  {% endfor %}
</div>
