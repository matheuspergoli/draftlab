"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { api } from "@/shared/trpc/client"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/shared/ui/dropdown-menu"

export interface User {
	id: string
	name: string | null
	email: string | null
	role: "USER" | "ADMIN"
	isBanned: boolean
}

export const userColumns: ColumnDef<User>[] = [
	{
		id: "actions",
		cell: ({ row }) => {
			const user = row.original

			const utils = api.useUtils()

			const { mutate: banUser } = api.admin.banUser.useMutation({
				onSuccess: () => {
					utils.admin.invalidate()
				}
			})

			const { mutate: unbanUser } = api.admin.unbanUser.useMutation({
				onSuccess: () => {
					utils.admin.invalidate()
				}
			})

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
							Copiar ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								banUser({ userId: user.id })
							}}>
							Banir usuário
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								unbanUser({ userId: user.id })
							}}>
							Desbanir usuário
						</DropdownMenuItem>
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
		accessorKey: "name",
		header: "Nome"
	},
	{
		accessorKey: "role",
		header: "Role"
	},
	{
		accessorKey: "email",
		header: "Email"
	},
	{
		accessorKey: "isBanned",
		header: "Banido",
		cell: ({ row }) => {
			const user = row.original

			return user.isBanned ? <Badge variant="destructive">Sim</Badge> : <Badge>Não</Badge>
		}
	}
]
