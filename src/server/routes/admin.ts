import { z } from "zod"

import { adminProcedure, createTRPCRouter } from "@/server/trpc"

export const adminRouter = createTRPCRouter({
	getUsers: adminProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.user.findMany()
	}),

	getReports: adminProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.report.findMany({
			include: {
				image: true
			},
			orderBy: {
				createdAt: "desc"
			}
		})
	}),

	getSites: adminProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.site.findMany({
			include: {
				thumbnail: true
			},
			orderBy: {
				createdAt: "desc"
			}
		})
	}),

	markReportAsRead: adminProcedure
		.input(
			z.object({
				reportId: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.report.update({
				where: {
					id: input.reportId
				},
				data: {
					status: true
				}
			})
		}),

	markReportAsUnread: adminProcedure
		.input(
			z.object({
				reportId: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.report.update({
				where: {
					id: input.reportId
				},
				data: {
					status: false
				}
			})
		}),

	deleteReport: adminProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { id } = input

			const data = await ctx.prisma.report.delete({
				where: {
					id
				},
				include: {
					image: true
				}
			})

			return data
		}),

	banUser: adminProcedure
		.input(
			z.object({
				userId: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { userId } = input

			const data = await ctx.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					isBanned: true
				}
			})

			return data
		}),

	unbanUser: adminProcedure
		.input(
			z.object({
				userId: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { userId } = input

			const data = await ctx.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					isBanned: false
				}
			})

			return data
		})
})
