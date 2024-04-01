"use client"

import React from "react"

import { PlusCircle } from "lucide-react"

import { Button } from "@/shared/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/shared/ui/dialog"

import { CreateSiteForm } from "../forms"

export const CreateSiteModal = () => {
	const [open, setOpen] = React.useState(false)

	const closeModal = () => {
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-3">
					Criar site
					<PlusCircle size={18} />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Criar um novo site</DialogTitle>
				</DialogHeader>
				<CreateSiteForm onCreated={closeModal} />
			</DialogContent>
		</Dialog>
	)
}
