---
title: "Pricing"
excerpt: "Compare coaching packages, engagement details, and next steps for working together."
description: "Integrated Fitness Coaching pricing, package comparison, engagement details, and next steps."
permalink: /pricing/
classes: wide
# description: "Integrated Fitness Coaching pricing, package comparison, consultation process, and support boundaries."
pricing_matrix: true
header:
  kicker: "Coaching Options"
  overlay_title: "Pricing and Packages"
  # overlay_image: /assets/images/ifc-pricing-hero-banner-1.jpg
  overlay_filter: linear-gradient(135deg, rgba(17, 33, 45, 0.62), rgba(17, 33, 45, 0.24))
---

{% assign ifc_application_url = "https://forms.gle/29cjAn8UZKWNa5qB7" %}
{% assign ifc_consultation_url = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2tFT1hAw7raJYeKLT9fHtAHbhWkhgCn78WIcANGUt-f-fOxlHb5gJBFuzF5g9zwHsVT524pONP?gv=true" %}

<div class="ifc-pricing">
  <div class="ifc-section ifc-pricing-intro">
    <p class="ifc-lead">Integrated Fitness Coaching is not sold as separate silos for nutrition, training, habits, emotional regulation, or intellectual development. The work is one coaching relationship, organized around the real context of your life.</p>
    <p>The packages differ by scope, complexity, live coaching cadence, and implementation support. <strong>Foundation</strong> is focused. <strong>Integrated</strong> is recommended for most serious integrated work. <strong>Intensive</strong> is for demanding seasons or higher-touch support.</p>
    <p>You do not need to know exactly which package you need before applying. These tiers show the standard support levels so you can understand the likely range of scope, cadence, and investment. After reviewing your application and intake form, I may recommend the package that seems most appropriate, suggest a brief follow-up call, or let you know that coaching does not appear appropriate for your situation.</p>
  </div>

  {% include pricing_matrix.html %}

  {% include coaching_process.html application_url=ifc_application_url consultation_url=ifc_consultation_url %}

  <div class="ifc-section">
    <div class="ifc-pricing-custom">
      <div>
        <p class="ifc-resource-card__eyebrow">By application</p>
        <h2>Custom Integrated Support</h2>
        <p>Some situations do not fall cleanly under a standard tier. Custom support may make sense for unusually high-touch coaching, local or hybrid work, in-person implementation support, major life-structure projects, intensive short-term sprints, or professional and executive-style support.</p>
        <p>Custom support is limited and quoted individually after application and discussion.</p>
      </div>
      <p><a class="ifc-button" href="{{ ifc_application_url }}" target="_blank" rel="noopener noreferrer">Start application</a></p>
    </div>
  </div>

  <div class="ifc-section ifc-engagement-details">
    <h2>Engagement details</h2>
    <div class="ifc-engagement-details__grid">
      <div class="ifc-panel ifc-panel--soft">
        <h3>Local and in-person support</h3>
        <p>For local clients, occasional in-person support may be available when it meaningfully serves the coaching plan. This might include movement review, gym orientation, kitchen or meal-structure support, or practical implementation work.</p>
        <p>In-person support is limited, discretionary, and quoted separately based on location, preparation, travel, and session length.</p>
      </div>
      <div class="ifc-panel ifc-panel--soft">
        <h3>Initial engagement and early off-ramp</h3>
        <p>Coaching begins with a 3-month initial engagement, billed monthly. The first month gives both of us a chance to confirm that the working relationship is productive and appropriate.</p>
        <p>Either party may decide within 14 days after the onboarding session that continuing is not appropriate. If that happens, coaching ends after the first month, and no further monthly payments are due. Fees already paid for services provided are not refundable.</p>
        <p>This is an early off-ramp, not a satisfaction guarantee. After the initial 3 months, coaching continues month-to-month unless otherwise agreed.</p>
      </div>
      <div class="ifc-panel ifc-panel--soft">
        <h3>Support between sessions</h3>
        <p>Written support is included for questions and updates related to the coaching plan. Messages are normally answered within 48 hours, excluding holidays, travel, illness, emergencies, and periods of limited availability communicated in advance when possible.</p>
        <p>This support is not emergency support, crisis support, or real-time access. If something requires medical care, psychotherapy, crisis support, physical therapy, or another licensed professional, coaching may proceed alongside that support when appropriate, but coaching does not replace it.</p>
      </div>
    </div>
  </div>

  <div class="ifc-section">
    <div class="ifc-panel ifc-panel--soft">
      <h2>Want more context before applying?</h2>
      <p>If you are still evaluating whether coaching is right for you, review the coaching approach, common questions, or the sample agreement before starting the application.</p>
      <div class="ifc-pricing-actions">
        <a class="ifc-button ifc-button--secondary" href="/approach/">How coaching works</a>
        <a class="ifc-button ifc-button--secondary" href="/faq/">Read FAQs</a>
        <a class="ifc-button ifc-button--secondary" href="/coaching-agreement/">Review agreement</a>
      </div>
    </div>
  </div>

  <div class="ifc-section">
    <div class="ifc-panel ifc-pricing-next">
      <h2>Next steps</h2>
      <p>If you are ready to be considered for coaching, start with the application and intake form. You do not need to know exactly which package matches your situation before applying. The application gives me enough context to assess whether coaching is appropriate, clarify scope, and identify the likely level of support.</p>
      <p>If you have questions before completing the form, book a free 15-minute consultation. The call is for basic questions and scope clarification, not coaching.</p>
      <p>After reviewing your application, I may recommend a package, suggest a brief follow-up call, or let you know that coaching does not appear appropriate for your situation.</p>
      <div class="ifc-pricing-actions">
        <a class="ifc-button" href="{{ ifc_application_url }}" target="_blank" rel="noopener noreferrer">Start application</a>
        {% include google_scheduling_proxy_button.html
          id="pricing-next-step-scheduler"
          url=ifc_consultation_url
          label="Book free consultation"
          class="ifc-button ifc-button--secondary"
          color="#039BE5"
        %}
      </div>
    </div>
  </div>
</div>
