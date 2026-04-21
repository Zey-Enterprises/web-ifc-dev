---
title: "Frequently Asked Questions"
permalink: /faq/
description: "Frequently asked questions about coaching, scope, results, and fit."
header:
  overlay_image: /assets/images/ifc-faq-hero-banner-1.jpg
  overlay_filter: linear-gradient(135deg, rgba(17, 33, 45, 0.62), rgba(17, 33, 45, 0.24))
---

Below is the public-facing FAQ. Each answer is also stored as a collection document so the section can expand into a richer knowledge base over time.

One recurring theme below is sustainability. This practice is explicitly not built around crash diets, permanent restriction, or short-term theatrics.

{% assign ordered_faqs = site.faqs | sort: "sort_order" %}
{% for item in ordered_faqs %}
## {{ item.title }}

{{ item.content }}

{% endfor %}

<div class="ifc-panel" markdown="1">
## Ready for next steps?

[Understand the approach](/approach/){:.ifc-button .ifc-button--secondary}
[Review pricing](/pricing/){:.ifc-button .ifc-button--secondary}
[Apply for coaching](/apply/){:.ifc-button}
</div>
