import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc"

export const siteRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				description: z.string(),
				subdomain: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const countSites = await ctx.prisma.site.count({
				where: {
					userId: ctx.session.user.id
				}
			})

			if (countSites >= 3) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Você atingiu o limite de sites"
				})
			}

			const siteExists = await ctx.prisma.site.findUnique({
				where: {
					subdomain: input.subdomain
				},
				select: {
					id: true
				}
			})

			if (siteExists?.id) {
				throw new TRPCError({ code: "BAD_REQUEST", message: "Subdomínio indisponível" })
			}

			const data = await ctx.prisma.site.create({
				data: {
					...input,
					user: {
						connect: {
							id: ctx.session.user.id
						}
					},
					logo: {
						create: {}
					},
					thumbnail: {
						create: {}
					}
				}
			})

			return data
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const deletedSite = await ctx.prisma.site.delete({
				where: {
					id: input.id
				},
				select: {
					thumbnailId: true,
					logoId: true,
					thumbnail: {
						select: {
							path: true
						}
					},
					logo: {
						select: {
							path: true
						}
					},
					posts: {
						select: {
							image: {
								select: {
									id: true,
									path: true
								}
							}
						}
					},
					reports: {
						select: {
							image: {
								select: {
									id: true,
									path: true
								}
							}
						}
					}
				}
			})

			const mediaIds = [
				deletedSite.thumbnailId,
				deletedSite.logoId,
				...deletedSite.posts.flatMap((post) => post.image?.id ?? []),
				...deletedSite.reports.flatMap((report) => report.image?.id ?? [])
			].filter(Boolean)

			await ctx.prisma.media.deleteMany({
				where: {
					id: {
						in: mediaIds
					}
				}
			})

			return deletedSite
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				description: z.string().optional(),
				subdomain: z.string().optional(),
				message404: z.string().optional(),
				font: z.string().optional(),
				logoUrl: z.string().optional(),
				logoPath: z.string().optional(),
				thumbnailUrl: z.string().optional(),
				thumbnailPath: z.string().optional()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const site = await ctx.prisma.site.findUnique({
				where: {
					id: input.id
				}
			})

			if (!site) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Site não encontrado" })
			}

			const { id, logoUrl, logoPath, thumbnailUrl, thumbnailPath, ...rest } = input

			const data = await ctx.prisma.site.update({
				where: {
					id
				},
				data: {
					...rest,
					logo: {
						update: {
							url: logoUrl,
							path: logoPath
						}
					},
					thumbnail: {
						update: {
							url: thumbnailUrl,
							path: thumbnailPath
						}
					}
				}
			})

			return data
		}),

	getUserSites: protectedProcedure.query(async ({ ctx }) => {
		const data = await ctx.prisma.site.findMany({
			where: {
				userId: ctx.session.user.id
			},
			include: {
				thumbnail: true,
				logo: true
			},
			orderBy: {
				updatedAt: "desc"
			}
		})

		return data
	}),

	getSiteById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input, ctx }) => {
			const data = await ctx.prisma.site.findUnique({
				where: {
					id: input.id
				},
				include: {
					thumbnail: true,
					logo: true
				}
			})

			return data
		}),

	getSiteBySubdomain: publicProcedure
		.input(
			z.object({
				subdomain: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const data = await ctx.prisma.site.findUnique({
				where: {
					subdomain: input.subdomain
				},
				include: {
					thumbnail: true,
					logo: true,
					posts: {
						orderBy: {
							updatedAt: "desc"
						},
						include: {
							image: true
						}
					},
					user: true
				}
			})

			return data
		}),

	getSiteMessage404: publicProcedure
		.input(
			z.object({
				subdomain: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const data = await ctx.prisma.site.findUnique({
				where: {
					subdomain: input.subdomain
				},
				select: {
					message404: true
				}
			})

			return data
		})
})
