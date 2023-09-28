await import('./src/environment/env.mjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			'placehold.co',
			'avatars.githubusercontent.com',
			'res.cloudinary.com',
			'public.blob.vercel-storage.com'
		]
	}
}

export default nextConfig
