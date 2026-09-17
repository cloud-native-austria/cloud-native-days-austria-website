# CNDA (Cloud Native Days Austria) Website

formerly known as KCD (Kubernetes Community Days) Austria

Website for the Cloud Native Days Austria available at [cloudnativedays.at](https://cloudnativedays.at).

> Forked from [KCDMunich/website](https://github.com/KCDMunich/website) -> Thank you! :)
> Then rewritten from Gatsby to Astro

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Run the website](#run-the-website)
  - [Build the website](#build-the-website)
  - [Preview the built website](#preview-the-built-website)

## Getting Started

1. Clone this repository

```bash
git clone git@github.com:cloud-native-austria/kcd-austria-website.git
```

1. Install dependencies (using npm)

```bash
npm install
```

## Usage

### Run the website

```bash
npm run dev
```

The site will be available at `http://localhost:4321/`

### Build the website

```bash
npm run build
```

This will build the Astro site to the `dist/` directory.

### Preview the built website

```bash
npm run preview
```

### Record the schedule videos for the venue screens

There is a signage page per conference day at `/video/<date>`, e.g.
`/video/2026-09-29`. It has no navigation: a full-width header image, the
schedule for that day, and a rotating sponsor banner.

To export them as looping portrait videos (requires `ffmpeg` and
[`@playwright/cli`](https://www.npmjs.com/package/@playwright/cli)), with the dev
server running:

```bash
npm run record:videos
```

This writes one mp4 per day to `recordings/` at 1080x1920. Each clip holds on the
top of the schedule, scrolls to the bottom, holds, then scrolls back to the top,
so the last frame matches the first and the video loops cleanly.

The sponsor banner completes exactly one rotation per clip. If you change the
timing, three values have to stay in sync:

| Value | Location |
| --- | --- |
| `HOLD_MS`, `SCROLL_MS` | `scripts/record-schedule-video.mjs` |
| `ROTATION` | `src/pages/video/[day].astro` |
| `LOOP_SECONDS` | `scripts/record-schedule-videos.sh` |

`HOLD_MS * 2 + SCROLL_MS * 2` must equal both `ROTATION` and `LOOP_SECONDS`,
otherwise the banner is mid-slide when the video restarts.
