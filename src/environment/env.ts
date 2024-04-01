import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	server: {
		// Node variables
		NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

		// Database variables
		DATABASE_URL: z.string(),

		// NextAuth variables
		NEXTAUTH_URL: z.preprocess(
			(v) => process.env.VERCEL_URL ?? v,
			process.env.VERCEL_URL ? z.string() : z.string().url()
		),
		NEXTAUTH_SECRET:
			process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),

		// GitHub oauth variables
		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string()
	},
	client: {
		// Supabase variables
		NEXT_PUBLIC_SUPABASE_URL: z.string(),
		NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),

		// Base domain URL
		NEXT_PUBLIC_ROOT_DOMAIN: z.string()
	},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
		NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	}
})
