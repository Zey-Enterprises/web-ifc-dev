---
title: "Testimonials Archive"
permalink: /results/testimonials/
description: "Archive page for testimonial entries."
---

<div class="ifc-grid">
  {% assign testimonials = site.testimonials | sort: "sort_order" %}
  {% for item in testimonials %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.client_name }}</strong>
      <p>{{ item.result_summary }}</p>
      <p>{{ item.excerpt | strip_html | truncate: 130 }}</p>
    </a>
  {% endfor %}
</div>
