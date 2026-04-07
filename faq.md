---
title: "FAQ"
permalink: /faq/
description: "Frequently asked questions about coaching, scope, results, and fit."
---

Below is the public-facing FAQ. Each answer is also stored as a collection document so the section can expand into a richer knowledge base over time.

One recurring theme below is sustainability. This practice is explicitly not built around crash diets, permanent restriction, or short-term theatrics.

{% assign ordered_faqs = site.faqs | sort: "sort_order" %}
{% for item in ordered_faqs %}
## {{ item.title }}

{{ item.content }}

{% endfor %}

<div class="ifc-panel">
  <h2>Still unsure?</h2>
  <p>If your situation is unusual, the application is still the right starting point. It gives enough context to say honestly whether coaching is a good fit.</p>
  <p><a class="ifc-button" href="/apply/">Apply for coaching</a></p>
</div>
