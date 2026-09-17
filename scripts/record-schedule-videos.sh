#!/usr/bin/env bash
#
# Records the portrait schedule videos and exports them as looping mp4s.
# The intermediate .webm screencasts are kept alongside the mp4s.
#
# LOOP_SECONDS must match ROTATION in src/pages/video/[day].astro and the
# hold/scroll timings in record-schedule-video.mjs. The screencast file runs a
# little past the scripted timeline, so it is trimmed to exactly one loop —
# otherwise the sponsor banner would start a second rotation before the video
# ends and the loop point would jump.
#
# Requires the dev server on :4321 and ffmpeg.
set -euo pipefail

cd "$(dirname "$0")/.."

LOOP_SECONDS=18

# Dedicated browser session so this does not disturb an interactive one
playwright-cli -s=signage open >/dev/null
trap 'playwright-cli -s=signage close >/dev/null 2>&1 || true' EXIT

playwright-cli -s=signage run-code --filename=scripts/record-schedule-video.mjs

for webm in recordings/schedule-day-*.webm; do
	mp4="${webm%.webm}.mp4"

	# -r 25 gives constant frame rate (the screencast is variable), and
	# +faststart lets players start and restart without re-reading the file.
	ffmpeg -v error -y -i "$webm" \
		-t "$LOOP_SECONDS" \
		-r 25 \
		-c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
		-movflags +faststart \
		-an \
		"$mp4"

	printf 'exported %s (kept %s)\n' "$mp4" "$webm"
done
