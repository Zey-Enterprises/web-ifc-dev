---
layout: none
---

var store = [
  {%- for c in site.collections -%}
    {%- if forloop.last -%}
      {%- assign l = true -%}
    {%- endif -%}
    {%- assign docs = c.docs | where_exp:'doc','doc.search != false' -%}
    {%- for doc in docs -%}
      {%- if doc.format == "visual-media" -%}
        {%- capture teaser -%}{% include resolve_page_image.html page=doc bucket="visual-media/thumbnails" %}{%- endcapture -%}
        {%- assign teaser = teaser | strip -%}
        {%- if teaser == "" -%}
          {%- assign teaser = site.teaser -%}
        {%- endif -%}
      {%- elsif doc.header.teaser -%}
        {%- capture teaser -%}{{ doc.header.teaser }}{%- endcapture -%}
      {%- else -%}
        {%- assign teaser = site.teaser -%}
      {%- endif -%}
      {%- assign search_url = doc.url -%}
      {%- if c.label == "faqs" -%}
        {%- assign faq_anchor = doc.title | slugify -%}
        {%- assign search_url = "/faq/#" | append: faq_anchor -%}
      {%- endif -%}
      {
        "title": {{ doc.title | jsonify }},
        "excerpt":
          {%- if doc.format == "visual-media" -%}
            {%- assign visual_media_search_text = doc.description | default: doc.excerpt | default: doc.tagline -%}
            {%- capture clean_visual_media_text -%}{% include clean_text.html text=visual_media_search_text %}{%- endcapture -%}
            {{ clean_visual_media_text | jsonify }},
          {%- elsif site.search_full_content == true -%}
            {%- capture clean_content -%}{% include clean_text.html text=doc.content %}{%- endcapture -%}
            {{ clean_content | jsonify }},
          {%- elsif doc.excerpt -%}
            {%- capture clean_excerpt -%}{% include clean_text.html text=doc.excerpt %}{%- endcapture -%}
            {{ clean_excerpt | jsonify }},
          {%- else -%}
            {%- capture clean_content -%}{% include clean_text.html text=doc.content truncatewords=50 %}{%- endcapture -%}
            {{ clean_content | jsonify }},
          {%- endif -%}
        "categories": {{ doc.categories | jsonify }},
        "tags": {{ doc.tags | jsonify }},
        "url": {{ search_url | relative_url | jsonify }},
        "teaser": {{ teaser | relative_url | jsonify }}
      }{%- unless forloop.last and l -%},{%- endunless -%}
    {%- endfor -%}
  {%- endfor -%}{%- if site.lunr.search_within_pages -%},
  {%- assign pages = site.pages | where_exp: 'doc', 'doc.search != false' | where_exp: 'doc', 'doc.title != null' -%}
  {%- for doc in pages -%}
    {%- if forloop.last -%}
      {%- assign l = true -%}
    {%- endif -%}
  {
    "title": {{ doc.title | jsonify }},
    "excerpt":
      {%- if site.search_full_content == true -%}
        {%- capture clean_content -%}{% include clean_text.html text=doc.content %}{%- endcapture -%}
        {{ clean_content | jsonify }},
      {%- elsif doc.excerpt -%}
        {%- capture clean_excerpt -%}{% include clean_text.html text=doc.excerpt %}{%- endcapture -%}
        {{ clean_excerpt | jsonify }},
      {%- else -%}
        {%- capture clean_content -%}{% include clean_text.html text=doc.content truncatewords=50 %}{%- endcapture -%}
        {{ clean_content | jsonify }},
      {%- endif -%}
    "url": {{ doc.url | absolute_url | jsonify }}
  }{%- unless forloop.last and l -%},{%- endunless -%}
  {%- endfor -%}
{%- endif -%}]
