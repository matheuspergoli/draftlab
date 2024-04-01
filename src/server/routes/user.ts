import { z } from "zod"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc"

export const userRouter = createTRPCRouter({
	update: protectedProcedure
		.input(
			z.object({
				name: z.string().optional(),
				imageUrl: z.string().optional(),
				imagePath: z.string().optional()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const user = await ctx.prisma.user.update({
				where: {
					id: ctx.session.user.id
				},
				data: {
					name: input.name,
					avatar: {
						upsert: {
							create: {
								url: input.imageUrl,
								path: input.imagePath
							},
							update: {
								url: input.imageUrl,
								path: input.imagePath
							}
						}
					}
				}
			})

			return user
		}),

	getUser: protectedProcedure.query(async ({ ctx }) => {
		return ctx.session.user
	}),

	getUserIp: publicProcedure.query(async ({ ctx }) => {
		return ctx.headers.get("x-forwarded-for")
	})
})
