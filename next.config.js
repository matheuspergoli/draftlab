/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com"
			},
			{
				protocol: "https",
				hostname: "placehold.co"
			},
			{
				protocol: "https",
				hostname: "novlesivyagfsbrgfbbm.supabase.co"
			}
		]
	}
}

module.exports = nextConfig
