---
title: "Coaching FAQs"
date: "2026-03-30"
last_modified_at: "2026-05-19"
permalink: /faq/
description: "Frequently asked questions about Integrated Fitness Coaching, including scope, results, process, and support."
excerpt: "Questions about coaching scope, results, process, and support."
toc_widget:
  enabled: true
header:
  kicker: "Coaching FAQ"
  overlay_title: "Frequently Asked Questions"
  # overlay_image: /assets/images/ifc-faq-hero-banner-1.jpg
  overlay_filter: linear-gradient(135deg, rgba(17, 33, 45, 0.62), rgba(17, 33, 45, 0.24))
  actions:
    - label: Go to Fitness FAQ Library →
      url: /resources/faq/
      class: btn--light-outline
---

{% assign ordered_faqs = site.faqs | sort: "sort_order" %}
{% for item in ordered_faqs %}
## {{ item.title }}

{{ item.content }}

{% endfor %}

<div class="ifc-panel ifc-faq-next-steps" markdown="1">
## Ready for next steps?

[Understand the approach](/approach/){:.ifc-button .ifc-button--secondary}
[View coaching options](/pricing/){:.ifc-button}
</div>
