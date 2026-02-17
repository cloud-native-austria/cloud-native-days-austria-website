import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://cloudnativedays.at",
	integrations: [mdx(), sitemap(), preact({ compat: true }), icon()],
	image: {
		remotePatterns: [{ protocol: "https" }],
	},
});
