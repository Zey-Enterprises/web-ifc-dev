---
title: "Case Studies Archive"
date: "2026-03-30"
last_modified_at: "2026-05-16"
permalink: /results/case-studies/
description: "Archive page for case study entries."
---

<div class="ifc-grid">
  {% assign cases = site.case_studies | sort: "sort_order" %}
  {% for item in cases %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.title }}</strong>
      <p>{% include word_boundary_truncate.html text=item.excerpt max=150 %}</p>
    </a>
  {% endfor %}
</div>
