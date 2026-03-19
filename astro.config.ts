import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import favicons from "astro-favicons";
import icon from "astro-icon";
import { defineConfig, fontProviders } from "astro/config";

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
		remotePatterns: [
			{ protocol: "https", hostname: "sessionize.com" },
			{ protocol: "https", hostname: "cache.sessionize.com" },
		],
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: "Plus Jakarta Sans",
			cssVariable: "--font-plus-jakarta-sans",
			fallbacks: ["system-ui", "sans-serif"],
			options: {
				variants: [
					{
						src: ["./src/assets/fonts/plus-jakarta-sans/plus-jakarta-sans-400.woff2"],
						weight: "400",
						style: "normal",
					},
					{
						src: ["./src/assets/fonts/plus-jakarta-sans/plus-jakarta-sans-600.woff2"],
						weight: "600",
						style: "normal",
					},
					{
						src: ["./src/assets/fonts/plus-jakarta-sans/plus-jakarta-sans-700.woff2"],
						weight: "700",
						style: "normal",
					},
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: "Fira Code",
			cssVariable: "--font-fira-code",
			fallbacks: ["ui-monospace", "monospace"],
			options: {
				variants: [
					{
						src: ["./src/assets/fonts/fira-code/FiraCode-Regular.woff2"],
						weight: "400",
						style: "normal",
					},
					{
						src: ["./src/assets/fonts/fira-code/FiraCode-SemiBold.woff2"],
						weight: "600",
						style: "normal",
					},
					{
						src: ["./src/assets/fonts/fira-code/FiraCode-Bold.woff2"],
						weight: "700",
						style: "normal",
					},
				],
			},
		},
	],
});
