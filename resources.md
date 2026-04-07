---
title: "Resources"
permalink: /resources/
description: "Guides, articles, and topic pathways for sustainable fitness."
---

The goal of this section is to become a durable library rather than a stream of disposable content. It is organized so guides, articles, and media can grow over time without making the site harder to manage.

## Topic pathways

<div class="ifc-topic-grid">
  <div class="ifc-topic">Nutrition</div>
  <div class="ifc-topic">Training</div>
  <div class="ifc-topic">Recovery</div>
  <div class="ifc-topic">Mindset</div>
  <div class="ifc-topic">Habit systems</div>
  <div class="ifc-topic">Body composition</div>
  <div class="ifc-topic">Self-direction</div>
  <div class="ifc-topic">Philosophy</div>
  <div class="ifc-topic">Ethics</div>
  <div class="ifc-topic">Epistemology</div>
</div>

The library is not limited to macros and exercise programming. It is meant to support the wider project of becoming a stronger, clearer, more self-directed person. That includes resources on principles, cognition, and the standards by which to guide action.

## Featured guides

<div class="ifc-grid">
  {% assign guides = site.guides | sort: "title" %}
  {% for item in guides %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.title }}</strong>
      <p>{{ item.excerpt | strip_html | truncate: 150 }}</p>
    </a>
  {% endfor %}
</div>

## Recent articles

<div class="ifc-grid">
  {% for post in site.posts limit:3 %}
    <a class="ifc-card-link" href="{{ post.url }}">
      <strong>{{ post.title }}</strong>
      <p>{{ post.excerpt | strip_html | truncate: 150 }}</p>
    </a>
  {% endfor %}
</div>

## Library navigation

- [Guides archive](/resources/guides/)
- [Articles archive](/resources/articles/)
- [Media library](/media/)
