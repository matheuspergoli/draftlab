"use client"

import React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { BadgeCheck } from "lucide-react"
import { useForm } from "react-hook-form"

import { BlurImage } from "@/shared/components/blur-image"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

import { EditUserData, EditUserDTO } from "../../dtos/edit-user-dto"
import { useUpdateUser } from "../../hooks/use-update-user"

interface FormDefaultValues {
	name: string
	image: string
}

export const EditUserForm = (defaultValues: FormDefaultValues) => {
	const { updateUser, isLoading } = useUpdateUser()

	const {
		watch,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<EditUserData>({
		resolver: zodResolver(EditUserDTO)
	})

	const watchImage = watch("avatar")

	const onSubmit = async (data: EditUserData) => {
		updateUser(data)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
			<div className="flex flex-col gap-3 rounded-md border">
				<div className="flex flex-col gap-3 p-5">
					<Label className="text-2xl">Nome de Usuário</Label>
					<p className="text-gray-500">
						O nome de usuário para a sua conta nessa plataforma.
					</p>
					<Input defaultValue={defaultValues.name} {...register("name")} />
					{errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
				</div>
				<div className="rounded-b-md bg-muted p-5 text-sm text-muted-foreground">
					Utilize um nome de usuário de no máximo 32 caracteres.
				</div>
			</div>

			<div className="flex flex-col gap-3 rounded-md border">
				<div className="flex flex-col gap-3 p-5">
					<Label className="text-2xl">Imagem de Perfil</Label>
					<p className="text-gray-500">
						A imagem de perfil para a sua conta. Clique na imagem para alterá-la.
					</p>
					<Label
						htmlFor="avatar"
						className="block w-full max-w-md overflow-hidden rounded-md border">
						<BlurImage
							src={
								watchImage?.[0]
									? URL.createObjectURL(watchImage?.[0])
									: defaultValues.image
							}
							alt="Logo"
							width={500}
							height={500}
							placeholder="blur"
							className="aspect-square h-full w-full rounded-md object-cover"
						/>
						<Input id="avatar" type="file" className="hidden" {...register("avatar")} />
					</Label>
				</div>
				<div className="rounded-b-md bg-muted p-5 text-sm text-muted-foreground">
					Utilize uma imagem de perfil com no máximo 5mb e nos formatos png ou jpg.
				</div>
			</div>
			<Button className="ml-auto w-fit gap-2" disabled={isLoading}>
				<BadgeCheck width={18} />
				{isLoading ? "Salvando..." : "Salvar"}
			</Button>
		</form>
	)
}
