---
name: MOVA
description: Three posture lessons on a quiet milk-white page where the only colour comes from photographs.
colors:
  ground: "#faf8f5"
  surface: "#ece7e0"
  field: "#ffffff"
  ink: "#1d1b19"
  muted: "#69645e"
  line: "#e3ded7"
  line-on-surface: "#d8d0c5"
  error: "#9b1c1c"
typography:
  display:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(38px, 5.4vw, 64px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  numeral:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(56px, 8vw, 88px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(24px, 3vw, 32px)"
    fontWeight: 500
    lineHeight: 1.15
  title:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(20px, 2.4vw, 26px)"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    letterSpacing: "0.14em"
  button:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.08em"
  logo:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    letterSpacing: "0.16em"
rounded:
  none: "0px"
spacing:
  gutter: "20px"
  gutter-wide: "40px"
  section: "72px"
  section-wide: "120px"
  container: "1120px"
components:
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "52px"
  button-solid-hover:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
  button-line:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "40px"
  button-line-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "52px"
  price-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "48px"
  sticky-bar:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    padding: "10px 20px"
---

# Design System: MOVA

## Overview

**Creative North Star: "Молоко"**

A milk-white page, warm and nearly silent. The system holds back almost all colour so the photographs of Katerina and her students carry it; everything else is ink on warm off-white, separated by hairline rules. It reads like a well-set printed programme: a ledger of sections, each with a small spaced-caps label on the left and plain content on the right.

Density is low and the rhythm generous. Structure comes from 1px lines, not boxes, shadows or tints. The single filled surface below the photos is the price card, a sand-toned block that marks the one place where a decision is made. Corners are square throughout, and the type is one family, Onest, in three weights.

**Key Characteristics:**
- Colour lives only in photographs; UI is ink, warm ground and hairlines.
- Sections as a ruled ledger: label column (3fr) beside content (9fr) on desktop.
- Lists are drawn as ruled rows, not bullets or cards.
- Square corners, 1px lines, no shadows.
- One filled surface (the price card) besides photo frames.

## Colors

Warm neutral greys from milk to sand, one near-black ink, and an error red used only for messages.

### Neutral
- **Milk Ground** (ground): page background, dialog background, sticky bar. Also the browser theme colour.
- **Sand Surface** (surface): photo frames and placeholders, the video player well, and the price card. Never a general card colour.
- **Paper White** (field): the inside of text inputs only, so fields lift slightly from the ground.
- **Warm Ink** (ink): all text, solid buttons, selected states, focus outlines, text selection background.
- **Warm Grey Muted** (muted): section labels, subheads, minutes, notes, footer, placeholder captions. Holds about 5.6:1 on ground.
- **Hairline** (line): every rule: section dividers, list rows, header and footer edges, input and option borders.
- **Hairline on Sand** (line-on-surface): the same rule role, darkened so it stays visible inside the price card.

### Accent
- **Brick Error** (error): validation and payment error text. Not decorative.

### Named Rules
**The Milk Rule.** The interface carries no hue. If a screen needs colour, it comes from a photograph, never from a tinted panel, badge, gradient or coloured text.

**The One Sand Block Rule.** Sand fills photo frames and the price card. No other content block gets a background.

## Typography

**Display, Body and Label Font:** Onest (with system-ui, sans-serif), self-hosted at 400, 500 and 600.

**Character:** One humanist grotesque doing everything. Hierarchy comes from size and the 500 weight, with uppercase letterspacing reserved for small labels, buttons and the wordmark.

### Hierarchy
- **Display** (500, clamp(38px, 5.4vw, 64px), 1.05, -0.02em): the hero headline only, max ~13ch.
- **Numeral** (400, clamp(56px, 8vw, 88px), 1, -0.02em, tabular): the price. Lesson numbers use the same voice smaller (clamp(48px, 7vw, 72px)) in muted.
- **Headline** (500, clamp(24px, 3vw, 32px), 1.15): lesson titles, price card title, service page h2s.
- **Title** (400, clamp(20px, 2.4vw, 26px), 1.4): the about paragraph, a quiet larger read.
- **Body** (400, 17px, 18px from 900px, 1.55): all running text, max 52–64ch. Lead lines and outros step up to 500.
- **Label** (500, 13px, 0.14em, uppercase, muted): section labels in the ledger column and photo placeholder captions.
- **Button** (500, 14px, 0.08em, uppercase): every button; 12px in the small header variant.

### Named Rules
**The One Family Rule.** Onest only. No second display face, no serif accents, no mono.

**The Tabular Minutes Rule.** Prices, minutes and lesson numbers set in tabular figures so ruled rows align.

## Layout

A single centred column, `min(1120px, 100% - 2 × gutter)`, gutter 20px on phones and 40px from 900px. Sections are separated by a 1px top rule and padded 72px (120px from 900px).

From 900px each section becomes a two-column ledger: a sticky label on the left (3fr), content on the right (9fr), gap 40px. Below that it stacks with a 28px gap.

The hero is the exception: on phones it stacks photo (4:3), headline, sub, the three-row programme with minutes, and a note; from 900px it splits 7fr text / 5fr photo (4:5), bottom-aligned, with the buy button shown beside the text. On phones the buy action lives in the sticky bar instead.

Paired lists (audience, format) become two columns from 700px with a 1px vertical rule between them. Reviews scroll horizontally in a snap rack of 9:16 frames.

Breakpoints in use: 700px (pairing), 900px (ledger, desktop header, sticky bar off).

## Elevation & Depth

Flat. There are no shadows anywhere. Depth is conveyed only by the sand surface against milk, and by the payment dialog's dimmed backdrop (black at 55%).

### Named Rules
**The Hairline Rule.** Separation is a 1px line in the hairline colour. Never a shadow, never a gap with a tinted band.

## Shapes

Square corners everywhere: buttons, inputs, dialog, price card, photo frames (0px). Lines are 1px. Icons are drawn from lines too: the accordion plus/minus and the dialog close cross are two 1px bars, so the whole interface shares one stroke weight.

Photos sit in fixed aspect frames: 4:5 (hero, desktop), 4:3 (hero, phone), 3:4 (about), 9:16 (review screenshots), 16:9 (lesson video).

## Components

### Buttons
- **Shape:** square (0px), 1px border in currentColor, min height 52px, padding 0 24px.
- **Solid (primary):** ink fill, milk text. Every purchase action uses it.
- **Hover:** fills invert, solid goes transparent with ink text; line fills ink. 0.2s colour transition.
- **Line (small):** transparent with an ink line, 40px high, 12px label; used for the header buy button.
- **Focus:** 2px currentColor outline, 3px offset.

### Programme Rows (signature)
The three lessons in the hero as ruled rows: short name left, minutes right in muted tabular figures, a hairline above the first and below each. The same ruled-row grammar draws the price inclusions, audience cells, format pairs and FAQ.

### Section Label
Small uppercase muted label in the ledger column, written between slashes as Katerina specified (`/ для кого /`). It is the section's h2, sticky beside the content on desktop. It is not an eyebrow over another heading.

### Price Card
Sand surface, padding 32px 24px (48px from 700px), rules darkened to the on-sand hairline. Holds the headline, ruled inclusions, the numeral price and the solid buy button.

### Inputs / Fields
- **Style:** paper-white fill, 1px hairline border, square, 52px tall, 17px text.
- **Focus:** 2px ink outline at 0 offset, border goes ink.
- **Error:** message in brick error below the field; the field itself does not change colour.

### Payment Dialog
One modal for every buy button: milk ground, square, max 480px. Title, price numeral, then on RU a stacked pair of method options (card, Telegram) bordered in hairline, the selected one in ink with a doubled 1px outline. Email field shows only for card. Full-width solid submit.

### Accordions
Native details/summary with the marker hidden and a 14px two-bar plus that rotates to a minus (0.2s ease-out). Ruled top and bottom.

### Navigation
Header: wordmark left, RU / EN in muted (current in ink), anchor nav at 15px 500, small line buy button. On phones the nav drops to its own horizontally scrollable row. A 1px rule closes the header.

### Wordmark
"MOVA" in spaced caps (600, 16px, 0.16em) with a superscript "KT" at 9px, 75% opacity. Used in the landing header and the service-page shell.

### Sticky Buy Bar
Phones only: fixed to the bottom on the milk ground with a top hairline, price numeral at 26px left and the solid button right. Hidden while the price section is in view and from 900px.

## Do's and Don'ts

### Do:
- **Do** keep the interface to ink, milk, sand and hairlines; let photographs bring the colour.
- **Do** separate everything with 1px hairline rules; use the on-sand hairline inside the price card.
- **Do** draw lists as ruled rows with tabular figures on the right.
- **Do** use the solid ink button for every purchase action and route it to the one payment dialog.
- **Do** keep corners square and icons built from 1px bars.

### Don't:
- **Don't** add a hue to UI: no coloured panels, pills, badges or gradients.
- **Don't** use shadows or rounded corners.
- **Don't** give content blocks a background other than the price card's sand.
- **Don't** introduce a second typeface.
- **Don't** put a small uppercase line above a heading; the uppercase label belongs only in the ledger column as the section heading itself.
