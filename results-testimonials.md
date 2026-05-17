---
title: "Testimonials Archive"
date: "2026-03-30"
last_modified_at: "2026-05-16"
permalink: /results/testimonials/
description: "Archive page for testimonial entries."
---

<div class="ifc-grid">
  {% assign testimonials = site.testimonials | sort: "sort_order" %}
  {% for item in testimonials %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.client_name }}</strong>
      <p>{{ item.result_summary }}</p>
      <p>{% include word_boundary_truncate.html text=item.excerpt max=130 %}</p>
    </a>
  {% endfor %}
</div>
