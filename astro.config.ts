import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import favicons from "astro-favicons";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://cloudnativedays.at",
	integrations: [
		mdx(),
		sitemap(),
		preact({ compat: true }),
		icon(),
		favicons({
			input: {
				favicons: ["public/favicon.png"],
			},
			short_name: "CNDA",
			name: "Cloud Native Days Austria",
		}),
	],
	image: {
		remotePatterns: [{ protocol: "https" }],
	},
});
