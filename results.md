---
title: "Results"
permalink: /results/
excerpt: "Realistic, sustainable coaching outcomes."
header:
  overlay_image: /assets/images/ifc-results-hero-banner-1.jpg
  overlay_filter: linear-gradient(135deg, rgba(17, 33, 45, 0.62), rgba(17, 33, 45, 0.24))
---

{% assign ordered_testimonials = site.testimonials | sort: "sort_order" %}
{% assign ordered_cases = site.case_studies | sort: "sort_order" %}
{% assign testimonial_count = ordered_testimonials | size %}
{% assign case_count = ordered_cases | size %}
{% assign results_group_count = 0 %}

{% if testimonial_count > 0 %}
  {% assign results_group_count = results_group_count | plus: 1 %}
{% endif %}

{% if case_count > 0 %}
  {% assign results_group_count = results_group_count | plus: 1 %}
{% endif %}

Results should be interpreted realistically. People improve at different rates, under different constraints, with different histories. This section is designed to show the range of meaningful progress without pretending that every client follows the same path.

{% if results_group_count == 0 %}
No testimonials or case studies are published yet. When examples are available, this page will show them here.
{% endif %}

{% if results_group_count == 1 and testimonial_count > 0 %}
<div class="ifc-grid">
  {% for item in ordered_testimonials %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.client_name }}</strong>
      <p>{{ item.result_summary }}</p>
      <!--<p>{{ item.excerpt | strip_html | truncate: 130 }}</p>-->
    </a>
  {% endfor %}
</div>
{% endif %}

{% if results_group_count == 1 and case_count > 0 %}
<div class="ifc-grid">
  {% for item in ordered_cases %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.title }}</strong>
      <p>{{ item.excerpt | strip_html | truncate: 140 }}</p>
    </a>
  {% endfor %}
</div>
{% endif %}

{% if results_group_count > 1 and testimonial_count > 0 %}
## Testimonials

<div class="ifc-grid">
  {% for item in ordered_testimonials %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.client_name }}</strong>
      <p>{{ item.result_summary }}</p>
      <p>{{ item.excerpt | strip_html | truncate: 130 }}</p>
    </a>
  {% endfor %}
</div>
{% endif %}

{% if results_group_count > 1 and case_count > 0 %}
## Case studies

<div class="ifc-grid">
  {% for item in ordered_cases %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.title }}</strong>
      <p>{{ item.excerpt | strip_html | truncate: 140 }}</p>
    </a>
  {% endfor %}
</div>
{% endif %}

{% if results_group_count > 1 %}
## Browse archives

{% if testimonial_count > 0 %}
- [Testimonials archive](/results/testimonials/)
{% endif %}
{% if case_count > 0 %}
- [Case studies archive](/results/case-studies/)
{% endif %}
{% endif %}
