import { JSONContent } from "@tiptap/react"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc"

export const postRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				siteId: z.string(),
				title: z.string(),
				description: z.string(),
				content: z.custom<JSONContent>()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { siteId, ...rest } = input

			const site = await ctx.prisma.site.findFirst({
				where: {
					id: siteId,
					userId: ctx.session.user.id
				},
				select: {
					id: true,
					posts: {
						select: {
							id: true
						}
					}
				}
			})

			if (!site) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Site não encontrado"
				})
			}

			if (site.posts.length >= 3) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Limite de posts excedido"
				})
			}

			const post = await ctx.prisma.post.create({
				data: {
					...rest,
					user: {
						connect: {
							id: ctx.session.user.id
						}
					},
					site: {
						connect: {
							id: input.siteId
						}
					},
					image: {
						create: {}
					}
				}
			})

			return post
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string().optional(),
				description: z.string().optional(),
				content: z.custom<JSONContent>().optional(),
				slug: z.string().optional(),
				imageUrl: z.string().optional(),
				imagePath: z.string().optional()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { id, imagePath, imageUrl, ...rest } = input

			const post = await ctx.prisma.post.findUnique({
				where: {
					id
				}
			})

			if (!post) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Post não encontrado"
				})
			}

			const data = await ctx.prisma.post.update({
				where: {
					id
				},
				data: {
					...rest,
					image: {
						update: {
							url: imageUrl,
							path: imagePath
						}
					}
				}
			})

			return data
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const deletedPost = await ctx.prisma.post.delete({
				where: {
					id: input.id
				},
				select: {
					imageId: true,
					image: {
						select: {
							path: true
						}
					}
				}
			})

			await ctx.prisma.media.deleteMany({
				where: {
					id: {
						in: [deletedPost.imageId ?? ""]
					}
				}
			})

			return deletedPost
		}),

	getUserPosts: protectedProcedure.query(async ({ ctx }) => {
		const posts = await ctx.prisma.post.findMany({
			where: {
				userId: ctx.session.user.id
			},
			include: {
				image: true
			}
		})

		return posts
	}),

	getSitePosts: protectedProcedure
		.input(z.object({ siteId: z.string() }))
		.query(async ({ input, ctx }) => {
			const posts = await ctx.prisma.post.findMany({
				where: {
					siteId: input.siteId
				},
				include: {
					image: true
				}
			})

			return posts
		}),

	getPostById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input, ctx }) => {
			const post = await ctx.prisma.post.findUnique({
				where: {
					id: input.id,
					userId: ctx.session.user.id
				},
				include: {
					image: true
				}
			})

			return post
		}),

	getPostBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input, ctx }) => {
			const post = await ctx.prisma.post.findUnique({
				where: {
					slug: input.slug
				},
				include: {
					image: true,
					user: {
						select: {
							name: true,
							image: true
						}
					}
				}
			})

			return post
		})
})
