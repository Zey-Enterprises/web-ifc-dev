---
title: "Case Studies Archive"
permalink: /results/case-studies/
description: "Archive page for case study entries."
---

<div class="ifc-grid">
  {% assign cases = site.case_studies | sort: "sort_order" %}
  {% for item in cases %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.title }}</strong>
      <p>{{ item.excerpt | strip_html | truncate: 150 }}</p>
    </a>
  {% endfor %}
</div>
