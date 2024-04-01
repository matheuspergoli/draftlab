import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/server/trpc"

export const reportRouter = createTRPCRouter({
	create: publicProcedure
		.input(
			z.object({
				siteId: z.string(),
				reason: z.string(),
				imageUrl: z.string(),
				imagePath: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { imagePath, imageUrl, siteId, ...rest } = input

			const userIp = ctx.headers.get("x-forwarded-for") ?? ""

			const userIpExists = await ctx.prisma.report.findFirst({
				where: {
					userIp
				}
			})

			if (userIpExists) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Já contamos com o seu reporte, obrigado!"
				})
			}

			const data = await ctx.prisma.report.create({
				data: {
					...rest,
					userIp,
					site: {
						connect: {
							id: siteId
						}
					},
					image: {
						create: {
							path: imagePath,
							url: imageUrl
						}
					}
				}
			})

			return data
		}),

	getReportIps: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.report.findMany({
			select: {
				userIp: true
			}
		})
	})
})
