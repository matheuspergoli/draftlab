"use client"

import React from "react"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Routes } from "@/shared/navigation/routes"
import { revalidatePathWrapper } from "@/shared/revalidate"
import { api } from "@/shared/trpc/client"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"

import { CreateSiteData, CreateSiteDTO } from "../../dtos/create-site-dto"

interface Props {
	onCreated?: () => void
}

export const CreateSiteForm = ({ onCreated }: Props) => {
	const router = useRouter()
	const utils = api.useUtils()
	const { mutateAsync: createSite, isPending: isLoading } = api.site.create.useMutation({
		onError: (error) => {
			toast.error(error.shape?.message)
		},
		onSuccess: async () => {
			utils.site.getUserSites.invalidate()
			await revalidatePathWrapper(["/", "/site/:path*"])
			toast.success("Site criado com sucesso!")
		}
	})

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors }
	} = useForm<CreateSiteData>({
		resolver: zodResolver(CreateSiteDTO)
	})

	const nameInput = watch("name")

	React.useEffect(() => {
		setValue(
			"subdomain",
			nameInput
				?.toLowerCase()
				.trim()
				.replace(/[\W_]+/g, "-")
		)
	}, [nameInput, setValue])

	const onSubmit = async (data: CreateSiteData) => {
		const site = await createSite(data)

		onCreated?.()
		router.push(Routes.siteSettings({ id: site.id }))
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label htmlFor="name">Nome</Label>
					<Input type="text" id="name" placeholder="Nome do site" {...register("name")} />
					{errors.name && <span className="text-red-500">{errors.name.message}</span>}
				</div>
				<div>
					<Label htmlFor="subdomain">Subdomínio</Label>
					<Input
						type="text"
						id="subdomain"
						placeholder="Subdomínio do site"
						{...register("subdomain")}
					/>
					{errors.subdomain && (
						<span className="text-red-500">{errors.subdomain.message}</span>
					)}
				</div>
				<div className="col-span-2">
					<Label htmlFor="description">Descrição</Label>
					<Textarea
						id="description"
						placeholder="Descrição do site"
						{...register("description")}
					/>
					{errors.description && (
						<span className="text-red-500">{errors.description.message}</span>
					)}
				</div>
			</div>
			<div className="mt-4 flex justify-end">
				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Criando..." : "Criar site"}
				</Button>
			</div>
		</form>
	)
}
