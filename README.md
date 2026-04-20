# Integrated Fitness Coaching

GitHub Pages compatible Jekyll site for **Integrated Fitness Coaching**, built on the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme with a unified resource system for written content, visual media, glossary terms, and supporting citations.

## Stack

- Jekyll with GitHub Pages-compatible plugins
- Minimal Mistakes via `remote_theme`
- Markdown-first collections for durable site content
- JSON and YAML data files for glossary, citations, tags, and visual media

## Resource Architecture

The site now uses a single Jekyll collection for user-facing resources:

- [`_resources/articles/`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_resources/articles) for every written resource
- [`_resources/visual-media/`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_resources/visual-media) for local visual-media detail pages
- [`_data/visual-media.json`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/visual-media.json) as the canonical visual-media index
- [`_data/glossary.json`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/glossary.json) for glossary entries
- [`_data/citation.json`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/citation.json) for reusable citations
- [`_data/tags.yml`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/tags.yml) for the canonical tag registry

Collection routing is configured in [`_config.yml`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_config.yml):

- The canonical browser lives at `/resources/`
- Written article detail pages live at `/resources/articles/<slug>/`
- Visual-media detail pages live at `/resources/visual-media/<id>/`
- `/resources/articles/` and `/resources/visual-media/` are compatibility redirects into canonical `/resources/?...` filters

The legacy `_guides`, `_posts`, and `_media` split has been consolidated into this unified system. The following systems are intentionally unchanged:

- `_faqs`
- `_testimonials`
- `_case_studies`

## Taxonomy

Use exactly these metadata axes on resources:

- `format`
  - `written`
  - `visual-media`
  - `audio`
- `domains`
  - `diet`
  - `physical-exercise`
  - `psychology`
  - `philosophy`
- `concerns`
  - `fat-loss`
  - `muscle-gain`
  - `body-composition`
  - `adherence`
  - `sleep`
  - `stress`
  - `energy`
  - `recovery`
  - `behavior-change`
  - `mindset`
  - `self-direction`
  - `busy-life`
  - `beginners`
  - `maintenance`
  - `performance`
- `tags`
  - Canonical only
  - Must exist in [`_data/tags.yml`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/tags.yml)
  - Use kebab-case

Do not add `resource_type`, `primary_domain`, `glossary_terms`, or any other parallel taxonomy layer.

## Adding A Written Article

1. Create a new Markdown file in [`_resources/articles/`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_resources/articles).
2. Use front matter like this:

```yaml
---
title: "Example Article"
format: written
date: 2026-04-13
excerpt: "A short summary for listing pages and metadata."
domains:
  - diet
  - psychology
concerns:
  - fat-loss
  - adherence
tags:
  - calorie-balance
  - satiety
  - behavior-change
---
```

3. Keep `tags` limited to canonical entries from `tags.yml`.
4. If the article uses citations, reference IDs from `citation.json` in a `citations:` map.
5. If the article uses glossary annotations, reference IDs from `glossary.json` with `{% raw %}{% include glossary.html id="..." %}{% endraw %}`.

## Adding A Visual Media Item

Visual media has two parts:

1. Add the canonical record to [`_data/visual-media.json`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/visual-media.json).
2. Add a matching local page in [`_resources/visual-media/`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_resources/visual-media).

Each `visual-media.json` item must use this schema:

- `id`
- `title`
- `description`
- `format`
  - `image` or `video`
- `sub-format`
  - optional
  - `short-video` or `long-video`
- `domains`
- `concerns`
- `tags`
- `published_at`
- `local_url`
- `platforms`
  - `platform`
  - `url`
- `thumbnail`
- `featured`
- `related_resources`
- `related_media`

Example:

```json
{
  "id": "meal-structure-for-fat-loss",
  "title": "Meal Structure For Fat Loss",
  "description": "A static visual on simple meal architecture that improves satiety and reduces impulsive drift during a deficit.",
  "format": "image",
  "domains": ["diet", "psychology"],
  "concerns": ["fat-loss", "adherence", "busy-life"],
  "tags": ["meal-structure", "satiety", "protein", "environment-design"],
  "published_at": "2026-03-22",
  "local_url": "meal-structure-for-fat-loss",
  "platforms": [
    { "platform": "Instagram", "url": "https://example.com" }
  ],
  "thumbnail": "/assets/images/example.jpg",
  "featured": false,
  "related_resources": ["nutrition-foundations"],
  "related_media": ["protein-distribution-clip"]
}
```

## Creating The Local Visual Media Page

The local page filename must match the `id` from `visual-media.json`.

Example file:

- [`_resources/visual-media/meal-structure-for-fat-loss.md`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_resources/visual-media/meal-structure-for-fat-loss.md)

The page URL becomes:

- `/resources/visual-media/meal-structure-for-fat-loss/`

The page resolves its content by matching `page.slug` to the `id` in `visual-media.json`. If no match exists, the page renders a visible development warning.

## How `visual-media.json` Works

- It is the canonical metadata index for all visual media surfaced through `/resources/`
- Listing filters read from its `domains`, `concerns`, and `tags`
- Detail pages pull title, description, platform links, related resources, and related media from it
- `local_url` is the intended local slug or filename, not a full URL

## Glossary Linking Via Tags

Glossary entries stay in [`_data/glossary.json`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/glossary.json).

Each glossary entry now includes:

- `id`
- `term`
- `short`
- `long`
- `tags`
- optional `see_also`
- optional `links`

The glossary page does **not** use per-term pages. Instead:

- `/resources/glossary/` renders all terms on one page
- entries are filtered by tag
- related resources are surfaced by overlapping `tags`

This means glossary-to-resource linking is maintained through shared taxonomy rather than fragile manual mappings.

## Using `tags.yml`

[`_data/tags.yml`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/tags.yml) is the tag registry. Each entry contains only:

- `slug`
- `label`

Before adding or changing tags:

1. Reuse an existing canonical tag when possible.
2. Avoid synonyms or near-duplicates.
3. Prefer reusable concepts over article-specific phrases.
4. Update `tags.yml` first, then use the tag in articles, glossary entries, citations, or visual media.

## Local Setup

1. Install Ruby and Bundler.
2. Run `bundle install`.
3. Run `bundle exec jekyll serve`.
4. Open `http://127.0.0.1:4000/`.

To test social-share links against the development domain instead of localhost, run `JEKYLL_ENV=production bundle exec jekyll serve --config _config.yml,_config_dev.yml`.

## Editing Notes

- Global site settings live in [`_config.yml`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_config.yml).
- Navigation lives in [`_data/navigation.yml`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/navigation.yml).
- Restrained custom styling lives in [`assets/css/main.scss`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/assets/css/main.scss).
- Canonical resource-browser and glossary filter behavior lives in [`assets/js/resource-filters.js`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/assets/js/resource-filters.js).
- Most content work should happen in Markdown and data files rather than layouts.
