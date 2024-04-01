import { z } from "zod"

import { createRoute } from "@/libs/create-route"

export const Routes = {
	overview: createRoute(() => "/"),
	userAccount: createRoute(() => "/user"),
	sites: createRoute(() => "/sites"),
	posts: createRoute(() => "/posts"),
	admin: createRoute(() => "/admin"),
	siteSettings: createRoute((p) => `/site/${p.id}/settings`, {
		params: z.object({
			id: z.string()
		})
	}),
	siteAppearance: createRoute((p) => `/site/${p.id}/appearance`, {
		params: z.object({
			id: z.string()
		})
	}),
	sitePosts: createRoute((p) => `/site/${p.id}/posts`, {
		params: z.object({
			id: z.string()
		})
	}),
	sitePostCreate: createRoute((p) => `/site/${p.id}/post`, {
		params: z.object({
			id: z.string()
		})
	}),
	postSettings: createRoute((p) => `/post/${p.id}/settings`, {
		params: z.object({
			id: z.string()
		})
	}),
	postEditor: createRoute((p) => `/post/${p.id}`, {
		params: z.object({
			id: z.string()
		})
	}),
	domainPost: createRoute((p) => `/${p.slug}`, {
		params: z.object({
			slug: z.string()
		})
	})
}
