# Integrated Fitness Coaching

GitHub Pages compatible Jekyll site for **Integrated Fitness Coaching**, built on the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme with a content architecture designed to grow into a long-term resource hub.

## Stack

- Jekyll with the `github-pages` gem for GitHub Pages compatibility
- Minimal Mistakes via `remote_theme`
- Markdown-first content with custom collections
- GitHub Actions workflow for Pages deployment

## Content structure

- `_guides/` for evergreen educational guides
- `_posts/` for ongoing articles and updates
- `_testimonials/` for short social proof entries
- `_case_studies/` for longer narrative outcomes
- `_media/` for video and short-form media references
- `_faqs/` for expandable FAQ entries
- `_data/navigation.yml` for top navigation

## Local setup

1. Install Ruby and Bundler.
2. Run `bundle install`.
3. Run `bundle exec jekyll serve`.
4. Open `http://127.0.0.1:4000/`.

## GitHub Pages deployment

This repo includes [`.github/workflows/pages.yml`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/.github/workflows/pages.yml), which follows the current GitHub Pages Jekyll workflow pattern.

1. Push the repository to GitHub.
2. In GitHub, go to `Settings -> Pages`.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` to trigger deployment.

## Editing notes

- Global site settings live in [`_config.yml`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_config.yml).
- Restrained custom styling lives in [`assets/css/main.scss`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/assets/css/main.scss).
- Navigation links live in [`_data/navigation.yml`](/Users/arthur/Zey Insurance Group Dropbox/Arthur Zey/Backups/GitHub/zey-enterprises/web-ifc/_data/navigation.yml).
- Most future content changes should only require editing Markdown files, not layouts or includes.

## Notes

- All public page URLs use trailing slashes where GitHub Pages allows it.
- The `404` page uses `/404.html`, which is the GitHub Pages convention.
- The current intake links and external media URLs are placeholders and should be replaced when real destinations are ready.
