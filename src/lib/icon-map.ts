/**
 * Icon mapping for link types from Sessionize API
 * Maps link types to Iconify icon names
 */

export const LINK_TYPE_ICONS: Record<string, string> = {
	twitter: "simple-icons:x",
	linkedin: "simple-icons:linkedin",
	facebook: "simple-icons:facebook",
	instagram: "simple-icons:instagram",
	bluesky: "simple-icons:bluesky",
	blog: "mdi:rss",
	github: "simple-icons:github",
	companywebsite: "mdi:company",
	sessionize: "simple-icons:sessionize",
	youtube: "simple-icons:youtube",
	googlemaps: "simple-icons:googlemaps",
};

/**
 * Get the Iconify icon name for a given link type
 * @param linkType - The link type from Sessionize (e.g., "twitter", "linkedin")
 * @returns The Iconify icon name (e.g., "simple-icons:x")
 */
export function getLinkTypeIcon(linkType: string): string {
	const normalizedType = linkType.toLowerCase().replace(/[_\s-]/g, "");
	return LINK_TYPE_ICONS[normalizedType] || "mdi:world-wide-web"; // Default icon for unknown link types
}
