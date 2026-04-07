---
title: "Results"
permalink: /results/
description: "Testimonials and case studies showing realistic, sustainable coaching outcomes."
---

Results should be interpreted realistically. People improve at different rates, under different constraints, with different histories. This section is designed to show the range of meaningful progress without pretending that every client follows the same path.

## Testimonials

<div class="ifc-grid">
  {% assign ordered_testimonials = site.testimonials | sort: "sort_order" %}
  {% for item in ordered_testimonials %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.client_name }}</strong>
      <p>{{ item.result_summary }}</p>
      <p>{{ item.excerpt | strip_html | truncate: 130 }}</p>
    </a>
  {% endfor %}
</div>

## Case studies

<div class="ifc-grid">
  {% assign ordered_cases = site.case_studies | sort: "sort_order" %}
  {% for item in ordered_cases %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.title }}</strong>
      <p>{{ item.excerpt | strip_html | truncate: 140 }}</p>
    </a>
  {% endfor %}
</div>

## Browse archives

- [Testimonials archive](/results/testimonials/)
- [Case studies archive](/results/case-studies/)
