"use client"

import React from "react"

import { PlusCircle } from "lucide-react"

import { Button } from "@/shared/ui/button"
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from "@/shared/ui/drawer"

import { CreateSiteForm } from "../forms"

export const CreateSiteDrawer = () => {
	const [open, setOpen] = React.useState(false)

	const closeDrawer = () => {
		setOpen(false)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button className="gap-2">
					<PlusCircle width={18} />
					Criar site
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<div className="mx-auto w-full max-w-96">
						<DrawerTitle className="text-2xl font-bold">Criar um novo site</DrawerTitle>
					</div>
				</DrawerHeader>
				<div className="mx-auto mb-5 w-full max-w-96">
					<CreateSiteForm onCreated={closeDrawer} />
				</div>
			</DrawerContent>
		</Drawer>
	)
}
