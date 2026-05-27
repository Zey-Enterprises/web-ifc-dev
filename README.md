# Integrated Fitness Coaching

GitHub Pages compatible Jekyll site for **Integrated Fitness Coaching**, built on the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme with a unified resource system for written content, visual media, glossary terms, and supporting citations.

## Stack

- Jekyll with GitHub Pages-compatible plugins
- Minimal Mistakes via `remote_theme`
- Markdown-first collections for durable site content
- JSON and YAML data files for glossary, citations, tags, and reusable platform rules

## Resource Architecture

The site now uses a single Jekyll collection for user-facing resources:

- [`_resources/articles/`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_resources/articles) for every written resource
- [`_resources/visual-media/`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_resources/visual-media) for visual-media detail pages and canonical visual-media metadata
- [`_data/platforms.yml`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/platforms.yml) for reusable platform labels, icons, URL templates, and share behavior
- [`_data/glossary.json`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/glossary.json) for glossary entries
- [`_data/citation.json`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/citation.json) for reusable citations
- [`_data/tags.yml`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/tags.yml) for the canonical tag registry

Collection routing is configured in [`_config.yml`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_config.yml):

- The canonical browser lives at `/resources/`
- Written article detail pages live at `/resources/articles/<slug>/`
- Visual-media detail pages live at `/resources/visual-media/<slug>/`
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

Visual media is front-matter only. The Markdown file in [`_resources/visual-media/`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_resources/visual-media) is the canonical record, and its slug comes from the filename.

Example file:

- [`_resources/visual-media/meal-structure-for-fat-loss.md`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_resources/visual-media/meal-structure-for-fat-loss.md)

The page URL becomes:

- `/resources/visual-media/meal-structure-for-fat-loss/`

Use front matter like this:

```yaml
---
title: "Meal Structure For Fat Loss"
date: 2026-03-22
last_modified_at: 2026-03-22
excerpt: "A static visual on simple meal architecture that improves satiety and reduces impulsive drift during a deficit."
domains:
  - diet
  - psychology
concerns:
  - fat-loss
  - adherence
tags:
  - meal-structure
  - satiety
  - protein
thumbnail: /assets/images/example.jpg
views:
  - type: local
    default: true
    items:
      - type: image
        url: /assets/images/example.jpg
        alt: "A simple meal structure for fat loss."
  - type: platform
    platform: instagram
    variant: post
    id: EXAMPLEID
featured: false
related_resources:
  - nutrition-foundations
related_media: []
---
```

`views` controls the available ways to view the visual media. Use `type: local` for IFC-hosted images or carousels, and `type: platform` for external platform views such as Instagram, Facebook, X, YouTube, or LinkedIn. Platform URL templates live in `_data/platforms.yml`; use an explicit `url` on a platform view only when it cannot be generated from `platform`, `variant`, `id`, optional `urn`, and optional `account`.

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
