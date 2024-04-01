"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { BadgeCheck } from "lucide-react"
import { useForm } from "react-hook-form"

import { BlurImage } from "@/shared/components/blur-image"
import { Routes } from "@/shared/navigation/routes"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

import { EditPostSettingsData, EditPostSettingsDTO } from "../../dtos/edit-post-settings"
import { useEditPostSettings } from "../../hooks/use-update-post-settings"
import { DeletePostButton } from "../delete-post-button"

interface FormDefaultValues {
	image: string
}

export const EditPostSettingsForm = (props: FormDefaultValues) => {
	const { id: postId } = Routes.postSettings.useParams()
	const { updatePostSettings, isLoading } = useEditPostSettings()

	const { handleSubmit, register, watch } = useForm<EditPostSettingsData>({
		resolver: zodResolver(EditPostSettingsDTO)
	})

	const watchImage = watch("image")

	const onSubmit = (data: EditPostSettingsData) => {
		updatePostSettings({
			...data
		})
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
			<div className="flex flex-col gap-3 rounded-md border">
				<div className="flex flex-col gap-3 p-5">
					<Label className="text-2xl">Imagem Thumbnail</Label>
					<p className="text-gray-500">
						A imagem de thumbnail para o seu post. Clique na imagem para alterá-la.
					</p>
					<Label
						htmlFor="image"
						className="block w-full max-w-md overflow-hidden rounded-md border">
						<BlurImage
							src={watchImage?.[0] ? URL.createObjectURL(watchImage?.[0]) : props.image}
							alt="Thumbnail"
							width={500}
							height={500}
							placeholder="blur"
							className="aspect-square h-full w-full rounded-md object-cover"
						/>
						<Input id="image" type="file" className="hidden" {...register("image")} />
					</Label>
				</div>
				<div className="rounded-b-md bg-muted p-5 text-sm text-muted-foreground">
					Utilize uma imagem com no máximo 5mb e nos formatos png ou jpg.
				</div>
			</div>
			<div className="flex flex-col gap-3 rounded-md border border-destructive">
				<div className="flex flex-col gap-3 p-5">
					<Label className="text-2xl">Apagar post</Label>
					<p className="text-red-600">
						Você está prestes a deletar o seu post, esta ação é irreversível.
					</p>
					<DeletePostButton postId={postId} variant="destructive" className="w-fit">
						Apagar post
					</DeletePostButton>
				</div>
				<div className="rounded-b-md bg-muted p-5 text-sm text-muted-foreground">
					Ao apagar você perderá todos os dados do seu post.
				</div>
			</div>

			<Button className="ml-auto w-fit gap-2" disabled={isLoading}>
				<BadgeCheck width={18} />
				{isLoading ? "Salvando..." : "Salvar"}
			</Button>
		</form>
	)
}
