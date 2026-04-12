# Annotation System

This site includes a shared annotation system for glossary terms, inline citations, and in-page bibliographies.

## Authoring

Glossary annotations:

```liquid
{% include glossary.html id="calorie-balance" %}
{% include glossary.html id="calorie-balance" text="energy balance" %}
{% include glossary.html id="calorie-balance" text="calorie balance" extra="This article uses the term in the bodyweight-regulation sense." %}
```

Citation annotations:

```liquid
{% include citation.html label="3" %}
{% include citation.html label="3" extra="Cited here specifically for the adaptive thermogenesis discussion." %}
{% include citation.html id="hall-2022-metabolism" label="7" %}
```

Bibliography:

```liquid
{% include bibliography.html %}
{% include bibliography.html style="chicago" %}
```

On this Jekyll 3 stack, `label` is the stable recommended parameter for page-local citation numbers. `n` remains a best-effort alias in the include, but `label` should be preferred in authored content.

## Citation Mapping

The simplest page-level mapping is a hash in front matter:

```yaml
citations:
  "1": hall-2022-metabolism
  "2": schoenfeld-2018-protein
  "3": brown-2020-circadian
```

If you want an explicit sequence or non-numeric labels, you can use an ordered array:

```yaml
citations:
  - label: "1"
    id: hall-2022-metabolism
  - label: "2"
    id: schoenfeld-2018-protein
```

## Data Files

- Glossary entries live in [`_data/glossary.json`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/glossary.json).
- Citation records live in [`_data/citation.json`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/citation.json).

Glossary entries are keyed by canonical IDs and can include:

- `term`
- `short`
- `long`
- `see_also`
- `links`

Glossary `links` entries can include:

- `label`
- `url`
- `newtab`

Citation records are keyed by canonical IDs and use a broad schema that works for the current site renderer while leaving room for later style-specific renderers. Common fields include:

- `type`
- `title`
- `subtitle`
- `authors`
- `organization`
- `container_title`
- `publisher`
- `place`
- `issued`
- `url`
- `doi`
- `isbn`
- `court`
- `reporter`
- `notes`
- `quote` or `excerpt`

Citation link-related fields can include:

- `url`
- `url_newtab`
- `doi`
- `doi_newtab`
- `links`

Citation links open in a new tab by default. Glossary links stay in the same tab by default. Any individual link can override that behavior with a sibling `newtab` boolean.

## Implementation Notes

- [`_includes/_annotation.html`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_includes/_annotation.html) is the shared popover shell targeted by CSS and JavaScript.
- [`_includes/_citation_reference.html`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_includes/_citation_reference.html) centralizes the default citation rendering logic used by both popovers and bibliography output.
- [`assets/js/annotations.js`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/assets/js/annotations.js) handles click/tap, outside-click dismissal, Escape dismissal, and viewport-aware positioning.
- Popovers still reveal on hover and focus without JavaScript; JavaScript enhances the interaction model rather than creating the content from nothing.
