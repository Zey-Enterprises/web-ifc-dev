---
title: ""
layout: single
permalink: /
classes: wide
tagline: "Integrated Fitness Coaching helps you improve training, nutrition, recovery, emotional regulation, cognitive skill, and the habits that keep progress from unraveling. The goal is sustainable, long-term improvement to live your best life."
header:
  kicker: Evidence-based coaching for physical capability and vitality, emotional well-being, and intellectual clarity
  overlay_title: "Build a stronger body, mind, and spirit to 𝑙𝑖𝑣𝑒 𝑤𝑒𝑙𝑙."
  overlay_filter: linear-gradient(135deg, rgba(17, 33, 45, 0.56), rgba(17, 33, 45, 0.21))
  overlay_interval: 3000
  overlay_images:
    - image: /assets/images/ifc-hero-banner-weightlifting-2.jpg
    - image: /assets/images/ifc-hero-banner-nutrition-3.jpg
    - image: /assets/images/ifc-hero-banner-mindfulness-3.jpg
      mobile_background_position: 68% center
    - image: /assets/images/ifc-hero-banner-reading-1.jpg
  actions:
    - label: Apply for coaching
      url: /apply/
      class: btn--primary
    - label: See how coaching works
      url: /approach/
      class: btn--light-outline
---

<section class="ifc-hero">
  <div class="ifc-hero__copy">
    <h2>An integrated approach to living well</h2>
    <p class="ifc-lead">Physical capability, intellectual clarity, and emotional or spiritual steadiness are not separate projects. They affect each other constantly: neglect one, and the others become harder to sustain; strengthen one, and the others usually become easier to build.</p>
    <p>That integrated view is the foundation of the coaching. But coaching can still have a specific focus. You may come in wanting better body composition, steadier habits, clearer thinking, or more inner order. We can start in one domain while working in a way that supports the whole person.</p>
    <div class="ifc-actions">
      <a class="ifc-button" href="/apply/">Apply for coaching</a>
      <a class="ifc-button ifc-button--secondary" href="/approach/">See how coaching works</a>
    </div>
  </div>
  <div class="ifc-panel ifc-panel--soft">
    <h2>Body, intellect, and spirit</h2>
    <p><strong>Body:</strong> physical exercise, nutrition, recovery, and energy</p>
    <p><strong>Intellect:</strong> judgment, self-understanding, planning, learning, and the ability to think clearly about your life</p>
    <p><strong>Spirit:</strong> emotional regulation, groundedness, self-command, and the inner stability that keeps action from unraveling</p>
  </div>
</section>

<section class="ifc-section">
  <div class="ifc-rail">
    <div>
      <h2>Start with your goals, not a template</h2>
      <p>The point is a vital, happy, flourishing life, so coaching starts with what you are actually trying to build. There are universal physiological and psychological principles that apply to human beings as such, but those principles have to be brought into contact with your particular values, priorities, constraints, and ambitions.</p>
      <p>For example, on the physical side, that might mean strength, endurance, aesthetics, or simply more energy and vitality. Those are not interchangeable goals, so they should not produce identical training, nutrition, recovery, or mindfulness strategies. The same is true elsewhere: The work is grounded in real, universal principles, but shaped around the life you are trying to live.</p>
    </div>
    <div class="ifc-panel ifc-panel--soft">
      <h2>Evidence-based and practical</h2>
      <p>This is not bro science, fad dieting, or social-media panic about whatever is supposedly toxic this week. The first priority is to identify the highest-leverage, most straightforward actions that will move you toward your goals.</p>
      <p>As your capacity improves, we can get more nuanced and individualized. But we do not begin with complexity for its own sake. We begin with what is true, useful, and actionable.</p>
    </div>
  </div>
</section>

<section class="ifc-section ifc-section--tight">
  <h2>Built for long-term sustainability</h2>
  <div class="ifc-grid">
    <div class="ifc-panel">
      <h3>Habits over brute-force effort</h3>
      <p>The goal is not endless strain, suffering, and theatrical white-knuckling. The goal is a way of eating, training, thinking, and living that you can actually sustain, so progress becomes more stable and less fragile.</p>
    </div>
    <div class="ifc-panel">
      <h3>Use difficult phases strategically</h3>
      <p>If you have aggressive goals, we may use demanding sprints, such as wanting to lose a certain amount of body fat in a timeframe near the extreme of what is safe. But dieting is a tool, not a lifestyle. We avoid approaches that drag on too long, invite cheating and relapse, and produce the familiar cycle of burnout and rebound.</p>
    </div>
    <div class="ifc-panel">
      <h3>Independence is part of the outcome</h3>
      <p>I am happy to work with you long term as your needs evolve, but the aim is not dependence. The aim is that you understand what to do, why it works, and how to keep building habits that support you without constant rescue.</p>
    </div>
  </div>
</section>

<section class="ifc-section">
  <h2>How coaching works</h2>
  <div class="ifc-grid">
    <div class="ifc-panel">
      <h3>1. Assess the system</h3>
      <p>We look at current habits, schedule constraints, training history, nutrition patterns, recovery, values, and where judgment or emotional regulation repeatedly breaks down.</p>
    </div>
    <div class="ifc-panel">
      <h3>2. Build the next version</h3>
      <p>You get clear priorities, practical targets, and a plan calibrated to your actual life, rather than an idealized routine, whether the immediate emphasis is training, nutrition, mindset, or philosophy.</p>
    </div>
    <div class="ifc-panel">
      <h3>3. Iterate with feedback</h3>
      <p>We review outcomes, identify friction, and adjust. The goal is skill acquisition and sustainable independence, not permanent dependence.</p>
    </div>
  </div>
</section>

<section class="ifc-section">
  <h2>Selected client results</h2>
  <div class="ifc-grid">
    {% assign featured_testimonials = site.testimonials | where: "featured", true | sort: "sort_order" %}
    {% for item in featured_testimonials limit:3 %}
      <div class="ifc-panel">
        <h3>{{ item.client_name }}</h3>
        <p><strong>{{ item.result_summary }}</strong></p>
        <p class="ifc-quote">{{ item.excerpt | strip_html }}</p>
        <p class="ifc-link-action"><a class="ifc-mini-action" href="{{ item.url }}"><span class="ifc-mini-action__label">Read more</span></a></p>
      </div>
    {% endfor %}
  </div>
  <p class="ifc-link-action"><a class="ifc-mini-action" href="/results/"><span class="ifc-mini-action__label">See testimonials and case studies</span></a></p>
</section>

<section class="ifc-section">
  <h2>Start with a resource, not a sales pitch</h2>
  <div class="ifc-grid">
    {% assign recent_written_resources = site.resources | where: "format", "written" | sort: "date" | reverse %}
    {% for item in recent_written_resources limit:6 %}
      <a class="ifc-card-link" href="{{ item.url }}">
        <p class="ifc-resource-card__eyebrow">Article</p>
        <strong>{{ item.title }}</strong>
        {% if item.date %}
          <p class="ifc-resource-card__meta">{{ item.date | date: site.date_format }}</p>
        {% endif %}
        <p>{{ item.excerpt | strip_html | truncate: 130 }}</p>
      </a>
    {% endfor %}
  </div>
  <p class="ifc-link-action"><a class="ifc-mini-action" href="/resources/"><span class="ifc-mini-action__label">Browse the full resource library</span></a></p>
</section>

<section class="ifc-section">
  <div class="ifc-panel">
    <h2>Apply when you are ready for serious, sustainable work.</h2>
    <p>This is coaching for people who want clarity, accountability, and a realistic path forward. The aim is a better life through better practices and better judgment, not more drama.</p>
    <div class="ifc-actions">
      <a class="ifc-button" href="/apply/">Apply now</a>
      <a class="ifc-button ifc-button--secondary" href="/faq/">Read the FAQ</a>
    </div>
  </div>
</section>
