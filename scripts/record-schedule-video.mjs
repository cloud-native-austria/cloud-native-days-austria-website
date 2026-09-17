/**
 * Records one portrait schedule video per conference day.
 *
 * The clip is built to loop: it opens at the top of the schedule, scrolls to the
 * bottom, holds, then scrolls back to the top, so the last frame matches the
 * first. HOLD_MS * 2 + SCROLL_MS * 2 must equal ROTATION in
 * src/pages/video/[day].astro, so the sponsor banner also ends where it started.
 *
 * Produces .webm; scripts/record-schedule-videos.sh wraps this and converts to
 * mp4. Run the wrapper rather than this file directly.
 *
 * The file is evaluated as a single expression, so everything lives inside the
 * arrow function.
 */
async (page) => {
	const BASE_URL = "http://localhost:4321";
	const DAYS = ["2026-09-29", "2026-09-30"];

	const WIDTH = 1080;
	const HEIGHT = 1920;
	const HOLD_MS = 10000;
	const SCROLL_MS = 1500;

	/** Animates main's scrollTop between two offsets over `duration`. */
	const scrollTo = (page, from, to, duration) =>
		page.evaluate(
			async ([from, to, duration]) => {
				const main = document.querySelector("main");
				const max = main.scrollHeight - main.clientHeight;
				const start = performance.now();

				await new Promise((resolve) => {
					function step(now) {
						const t = Math.min(1, (now - start) / duration);
						// ease-in-out so each scroll starts and stops gently
						const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
						main.scrollTop = max * (from + (to - from) * eased);
						if (t < 1) requestAnimationFrame(step);
						else resolve();
					}
					requestAnimationFrame(step);
				});
			},
			[from, to, duration],
		);

	await page.emulateMedia({ colorScheme: "light" });
	await page.setViewportSize({ width: WIDTH, height: HEIGHT });

	for (const [index, day] of DAYS.entries()) {
		const path = `recordings/schedule-day-${index + 1}.webm`;

		await page.goto(`${BASE_URL}/video/${day}`, { waitUntil: "load" });

		/*
		 * The Astro dev toolbar is injected after load, so removing it once races
		 * with that and it can reappear mid-recording. A style tag hides it however
		 * late it arrives. It does not exist in a production build at all.
		 */
		await page.addStyleTag({ content: "astro-dev-toolbar { display: none !important; }" });

		// Decode everything up front so nothing pops in mid-scroll
		await page.evaluate(async () => {
			document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
				img.loading = "eager";
			});
			await document.fonts.ready;
			await Promise.all([...document.images].map((img) => img.decode().catch(() => undefined)));
		});
		await page.waitForTimeout(500);

		await page.screencast.start({ path, size: { width: WIDTH, height: HEIGHT } });

		// Restart the banner animation so its single rotation lines up with frame one
		await page.evaluate(() => {
			for (const slide of document.querySelectorAll(".slide")) {
				slide.style.animation = "none";
				void slide.offsetHeight;
				slide.style.animation = "";
			}
			document.querySelector("main").scrollTop = 0;
		});

		await page.waitForTimeout(HOLD_MS);
		await scrollTo(page, 0, 1, SCROLL_MS);
		await page.waitForTimeout(HOLD_MS);
		await scrollTo(page, 1, 0, SCROLL_MS);

		await page.screencast.stop();
		console.log(`recorded ${path}`);
	}
}
