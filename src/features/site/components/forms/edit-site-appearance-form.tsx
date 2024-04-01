"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { BadgeCheck } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { BlurImage } from "@/shared/components/blur-image"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/shared/ui/select"

import {
	EditSiteAppearanceData,
	EditSiteAppearanceDTO
} from "../../dtos/edit-site-appearance-dto"
import { useEditSiteAppearance } from "../../hooks/use-edit-site-appearance"

interface Props {
	message404: string
	font: string
	logo: string
	thumbnail: string
}

export const EditSiteAppearanceForm = (props: Props) => {
	const { isLoading, updateSite } = useEditSiteAppearance()

	const {
		handleSubmit,
		register,
		watch,
		control,
		formState: { errors }
	} = useForm<EditSiteAppearanceData>({
		resolver: zodResolver(EditSiteAppearanceDTO)
	})

	const onSubmit = (data: EditSiteAppearanceData) => {
		updateSite({
			...data
		})
	}

	const watchLogo = watch("logo")
	const watchThumbnail = watch("thumbnail")

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
			<div className="flex flex-col gap-3 rounded-md border">
				<div className="flex flex-col gap-3 p-5">
					<Label className="text-2xl">Logo</Label>
					<p className="text-gray-500">
						A imagem de logo para o seu site. Clique na imagem para alterá-la.
					</p>
					<Label
						htmlFor="logo"
						className="block w-full max-w-md overflow-hidden rounded-md border">
						<BlurImage
							src={watchLogo?.[0] ? URL.createObjectURL(watchLogo?.[0]) : props.logo}
							alt="Logo"
							width={500}
							height={500}
							placeholder="blur"
							className="aspect-square h-full w-full rounded-md object-cover"
						/>
						<Input id="logo" type="file" className="hidden" {...register("logo")} />
					</Label>
				</div>
				<div className="rounded-b-md bg-muted p-5 text-sm text-muted-foreground">
					Utilize uma imagem com no máximo 5mb e nos formatos png ou jpg.
				</div>
			</div>

			<div className="flex flex-col gap-3 rounded-md border">
				<div className="flex flex-col gap-3 p-5">
					<Label className="text-2xl">Imagem Thumbnail</Label>
					<p className="text-gray-500">
						A imagem de thumbnail para o seu site. Clique na imagem para alterá-la.
					</p>
					<Label
						htmlFor="thumbnail"
						className="block w-full max-w-md overflow-hidden rounded-md border">
						<BlurImage
							src={
								watchThumbnail?.[0]
									? URL.createObjectURL(watchThumbnail?.[0])
									: props.thumbnail
							}
							alt="Thumbnail"
							width={500}
							height={500}
							placeholder="blur"
							className="aspect-square h-full w-full rounded-md object-cover"
						/>
						<Input
							id="thumbnail"
							type="file"
							className="hidden"
							{...register("thumbnail")}
						/>
					</Label>
				</div>
				<div className="rounded-b-md bg-muted p-5 text-sm text-muted-foreground">
					Utilize uma imagem com no máximo 5mb e nos formatos png ou jpg.
				</div>
			</div>

			<div className="flex flex-col gap-3 rounded-md border">
				<div className="p-5">
					<Controller
						name="font"
						control={control}
						render={({ field }) => {
							return (
								<Select defaultValue={props.font} onValueChange={field.onChange}>
									<SelectTrigger className="max-w-lg">
										<SelectValue placeholder="Selecione uma fonte para o seu site" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="font-roboto">Roboto</SelectItem>
										<SelectItem value="font-inter">Inter</SelectItem>
										<SelectItem value="font-poppins">Poppins</SelectItem>
										<SelectItem value="font-lato">Lato</SelectItem>
										<SelectItem value="font-open-sans">Open Sans</SelectItem>
										<SelectItem value="font-nunito">Nunito</SelectItem>
										<SelectItem value="font-montserrat">Montserrat</SelectItem>
										<SelectItem value="font-raleway">Raleway</SelectItem>
										<SelectItem value="font-ubuntu">Ubuntu</SelectItem>
										<SelectItem value="font-fira-code">Fira Code</SelectItem>
									</SelectContent>
								</Select>
							)
						}}
					/>
				</div>

				<div className="rounded-b-md bg-muted p-5 text-sm text-muted-foreground">
					Selecione uma fonte para o seu site.
				</div>
			</div>

			<div className="flex flex-col gap-3 rounded-md border">
				<div className="flex flex-col gap-3 p-5">
					<Label className="text-2xl">Mensagem de erro 404</Label>
					<p className="text-gray-500">
						Mensagem de erro para quando o usuário acessar uma página que não existe.
					</p>
					<Input defaultValue={props.message404} {...register("message404")} />
					{errors.message404 && (
						<p className="text-sm text-red-500">{errors.message404.message}</p>
					)}
				</div>
				<div className="rounded-b-md bg-muted p-5 text-sm text-muted-foreground">
					Utilize uma mensagem de no máximo 140 caracteres.
				</div>
			</div>

			<div className="mt-4 flex justify-end">
				<Button className="ml-auto w-fit gap-2" disabled={isLoading}>
					<BadgeCheck width={18} />
					{isLoading ? "Salvando..." : "Salvar"}
				</Button>
			</div>
		</form>
	)
}
