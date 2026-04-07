---
title: "Media"
permalink: /media/
description: "Primary media home base for video, short-form clips, and appearances."
---

This site is the primary reference point. External platforms are useful distribution channels, but the structure here should remain the durable home base for context, summaries, and organized discovery.

## Featured video

<div class="ifc-media-embed">
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Placeholder featured YouTube video" allowfullscreen></iframe>
</div>

## Channels

<div class="ifc-grid">
  <div class="ifc-panel">
    <h3>YouTube</h3>
    <p>Longer educational videos, interviews, and coaching explainers.</p>
  </div>
  <div class="ifc-panel">
    <h3>Instagram</h3>
    <p>Short tactical observations, visuals, and brief training or nutrition clips.</p>
  </div>
  <div class="ifc-panel">
    <h3>Facebook</h3>
    <p>Links, reposted short-form content, and community-friendly updates.</p>
  </div>
</div>

## Latest entries

<div class="ifc-grid">
  {% assign ordered_media = site.media | sort: "sort_order" %}
  {% for item in ordered_media %}
    <a class="ifc-card-link" href="{{ item.url }}">
      <strong>{{ item.title }}</strong>
      <p>{{ item.platform }}{% if item.content_type %} · {{ item.content_type }}{% endif %}</p>
      <p>{{ item.excerpt | strip_html | truncate: 140 }}</p>
    </a>
  {% endfor %}
</div>

<p><a href="/media/library/">Open the media archive</a></p>
