"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { DeleteSiteButton } from "@/features/site/components/delete-site-button"
import { supabase } from "@/libs/supabase"
import { api } from "@/shared/trpc/client"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/shared/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/shared/ui/dropdown-menu"

export interface Report {
	id: string
	reason: string
	siteId: string | null
	image: string | null | undefined
	status: boolean
}

export const reportColumns: ColumnDef<Report>[] = [
	{
		id: "actions",
		cell: ({ row }) => {
			const utils = api.useUtils()
			const report = row.original

			const { mutate: markAsRead } = api.admin.markReportAsRead.useMutation({
				onSuccess: () => {
					utils.admin.invalidate()
				}
			})

			const { mutate: markAsUnread } = api.admin.markReportAsUnread.useMutation({
				onSuccess: () => {
					utils.admin.invalidate()
				}
			})

			const { mutate: deleteReport } = api.admin.deleteReport.useMutation({
				onSuccess: async (data) => {
					utils.admin.invalidate()

					if (data.image?.path) {
						await supabase.storage.from("draftlab").remove([data.image.path])
					}
				}
			})

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(report.id)}>
							Copiar ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(report.siteId ?? "")}>
							Copiar Site ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								if (report.status) {
									markAsUnread({ reportId: report.id })
								} else {
									markAsRead({ reportId: report.id })
								}
							}}>
							{report.status ? "Marcar como pendente" : "Marcar como resolvido"}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								deleteReport({ id: report.id })
							}}>
							Apagar reporte
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DeleteSiteButton
							siteId={report.siteId ?? ""}
							variant="destructive"
							className="w-full text-center">
							Apagar site
						</DeleteSiteButton>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	},
	{
		accessorKey: "id",
		header: "ID"
	},
	{
		accessorKey: "reason",
		header: "Motivo",
		cell: ({ row }) => {
			return (
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">Ler</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Motivo do reporte</DialogTitle>
							<DialogDescription>{row.original.reason}</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			)
		}
	},
	{
		accessorKey: "siteId",
		header: "Site ID"
	},
	{
		accessorKey: "image",
		header: "Imagem",
		cell: ({ row }) => {
			const image = row.original.image

			return image ? (
				<Button asChild variant="outline">
					<a href={image} target="_blank">
						Abrir
					</a>
				</Button>
			) : (
				<Badge variant="destructive">Sem imagem</Badge>
			)
		}
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			return row.original.status ? (
				<Badge>Resolvido</Badge>
			) : (
				<Badge variant="destructive">Pendente</Badge>
			)
		}
	}
]
