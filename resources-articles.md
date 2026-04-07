---
title: "Articles"
permalink: /resources/articles/
description: "Archive page for blog posts and ongoing articles."
---

Posts are for ongoing ideas, observations, and updates that do not need to be structured as full guides.

<div class="ifc-grid">
  {% for post in site.posts %}
    <a class="ifc-card-link" href="{{ post.url }}">
      <strong>{{ post.title }}</strong>
      <p>{{ post.date | date: "%B %-d, %Y" }}</p>
      <p>{{ post.excerpt | strip_html | truncate: 150 }}</p>
    </a>
  {% endfor %}
</div>
