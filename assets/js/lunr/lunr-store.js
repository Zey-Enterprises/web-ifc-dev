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
      {%- if doc.header.teaser -%}
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
