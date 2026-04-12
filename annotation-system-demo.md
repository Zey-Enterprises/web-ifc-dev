---
title: "Annotation System Demo"
permalink: /annotation-system-demo/
excerpt: "Demonstrates inline glossary entries, citations, and a generated bibliography."
citations:
  "1": hall-2022-metabolism
  "2": schoenfeld-2018-protein
  "3": brown-2020-circadian
  "4": who-2023-physical-activity
  "5": miller-v-state-2016
---

This page demonstrates the shared annotation system in live content.

## Glossary Examples

Body composition changes still reflect {% include glossary.html id="calorie-balance" %}, but practical coaching also has to account for {% include glossary.html id="satiety" text="satiety pressure" %} and the large day-to-day variability introduced by {% include glossary.html id="neat" text="NEAT" extra="In client work, NEAT often changes before the client consciously notices it." %}.

Recovery capacity also matters because chronically low {% include glossary.html id="energy-availability" text="energy availability" %} can quietly degrade training quality, mood, and adherence.

## Citation Examples

Energy imbalance remains the governing constraint on bodyweight change{% include citation.html label="1" %}, while protein intake matters more as a partitioning and recovery variable than as an escape hatch from energy balance.{% include citation.html label="2" extra="Included here for the practical distinction between total daily intake and more granular distribution questions." %}

Circadian disruption can still matter meaningfully in practice, but it acts through appetite, recovery, and behavior rather than replacing the governing accounting model.{% include citation.html label="3" %} Broader public-health framing around movement and daily activity can be cited separately.{% include citation.html label="4" %} The legal source example is here only to demonstrate schema breadth.{% include citation.html label="5" %}
