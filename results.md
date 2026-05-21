---
title: "Results"
date: "2026-03-30"
last_modified_at: "2026-05-20"
permalink: /results/
excerpt: "Examples of meaningful progress interpreted realistically, without hype or guarantees."
header:
  kicker: "Client Results"
  overlay_title: "Realistic Progress, Sustainable Outcomes"
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
      <!--<p>{% include word_boundary_truncate.html text=item.excerpt max=130 %}</p>-->
    </a>
  {% endfor %}
</div>
More testimonials coming soon!
{% endif %}

{% if results_group_count == 1 and case_count > 0 %}
<div class="ifc-grid">
  {% for item in ordered_cases %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.title }}</strong>
      <p>{% include word_boundary_truncate.html text=item.excerpt max=140 %}</p>
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
      <p>{% include word_boundary_truncate.html text=item.excerpt max=130 %}</p>
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
      <p>{% include word_boundary_truncate.html text=item.excerpt max=140 %}</p>
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
