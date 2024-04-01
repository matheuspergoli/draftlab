"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { BadgeCheck } from "lucide-react"
import { useForm } from "react-hook-form"

import { Routes } from "@/shared/navigation/routes"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"

import {
	EditSiteSettingsData,
	EditSiteSettingsDTO
} from "../../dtos/edit-site-settings-dto"
import { useEditSiteSettings } from "../../hooks/use-edit-site-settings"
import { DeleteSiteButton } from "../delete-site-button"

interface EditSiteSettingsDefaultValues {
	name: string
	description: string
	subdomain: string
}

export const EditSiteSettingsForm = (props: EditSiteSettingsDefaultValues) => {
	const { id: siteId } = Routes.siteSettings.useParams()
	const { updateSite, isLoading } = useEditSiteSettings()

	const {
		handleSubmit,
		register,
		formState: { errors }
	} = useForm<EditSiteSettingsData>({
		resolver: zodResolver(EditSiteSettingsDTO)
	})

	const onSubmit = (data: EditSiteSettingsData) => {
		updateSite({
			...data
		})
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
			<div className="flex flex-col gap-3 rounded-md border">
				<div className="flex flex-col gap-3 p-5">
					<Label className="text-2xl">Nome</Label>
					<p className="text-gray-500">
						O nome do seu site. Isso será usado como o título do seu site no google.
					</p>
					<Input defaultValue={props.name} {...register("name")} />
					{errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
				</div>
				<div className="rounded-b-md bg-muted p-5 text-sm text-muted-foreground">
					Utilize um nome de usuário de no máximo 32 caracteres.
				</div>
			</div>

			<div className="flex flex-col gap-3 rounded-md border">
				<div className="flex flex-col gap-3 p-5">
					<Label className="text-2xl">Descrição</Label>
					<p className="text-gray-500">
						A descrição do seu site. Isso será usado como a descrição do seu site no
						google.
					</p>
					<Textarea defaultValue={props.description} {...register("description")} />
					{errors.description && (
						<p className="text-sm text-red-500">{errors.description.message}</p>
					)}
				</div>
				<div className="rounded-b-md bg-muted p-5 text-sm text-muted-foreground">
					Utilize uma descrição de no máximo 140 caracteres.
				</div>
			</div>

			<div className="flex flex-col gap-3 rounded-md border">
				<div className="flex flex-col gap-3 p-5">
					<Label className="text-2xl">Subdomínio</Label>
					<p className="text-gray-500">
						O subdomínio do seu site. Isso será usado como o subdomínio do seu site no
						google.
					</p>
					<Input defaultValue={props.subdomain} {...register("subdomain")} />
					{errors.subdomain && (
						<p className="text-sm text-red-500">{errors.subdomain.message}</p>
					)}
				</div>
				<div className="rounded-b-md bg-muted p-5 text-sm text-muted-foreground">
					Utilize um subdomínio de no máximo 32 caracteres, contendo apenas letras
					minúsculas, números e hífens.
				</div>
			</div>

			<div className="flex flex-col gap-3 rounded-md border border-destructive">
				<div className="flex flex-col gap-3 p-5">
					<Label className="text-2xl">Apagar site</Label>
					<p className="text-red-600">
						Você está prestes a deletar o seu site, esta ação é irreversível.
					</p>
					<DeleteSiteButton siteId={siteId} variant="destructive" className="w-fit">
						Apagar site
					</DeleteSiteButton>
				</div>
				<div className="rounded-b-md bg-muted p-5 text-sm text-muted-foreground">
					Ao apagar você perderá todos os dados do seu site.
				</div>
			</div>

			<Button className="ml-auto w-fit gap-2" disabled={isLoading}>
				<BadgeCheck width={18} />
				{isLoading ? "Salvando..." : "Salvar"}
			</Button>
		</form>
	)
}
