"use client"

import React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { JSONContent } from "@tiptap/react"
import { Controller, useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "sonner"

import { Button } from "@/shared/ui/button"

import { PostData, PostDTO } from "../../dtos/post-dto"
import { useUpdatePost } from "../../hooks/use-update-post"
import { Tiptap } from "./tiptap"

interface EditorProps {
	title: string
	description: string
	content: JSONContent
}

export const EditorUpdate = (props: EditorProps) => {
	const { updatePost, isLoading } = useUpdatePost()

	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<PostData>({
		resolver: zodResolver(PostDTO),
		defaultValues: {
			title: props.title,
			description: props.description,
			content: props.content
		}
	})

	const onSubmit = (data: PostData) => {
		updatePost({
			title: data.title,
			description: data.description,
			content: data.content
		})
	}

	React.useEffect(() => {
		if (Object.entries(errors).length > 0) {
			toast.error(String(errors[Object.keys(errors)[0] as keyof typeof errors]?.message))
		}
	}, [errors])

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="container mx-auto w-full max-w-3xl">
			<Button
				onClick={handleSubmit(onSubmit)}
				disabled={isLoading}
				className="ml-auto block w-fit">
				{isLoading ? "Salvando..." : "Salvar"}
			</Button>
			<TextareaAutosize
				autoFocus
				id="title"
				placeholder="Título do post"
				defaultValue={props.title}
				className="w-full resize-none appearance-none overflow-hidden bg-transparent text-center text-4xl font-bold focus:outline-none"
				{...register("title")}
			/>
			<TextareaAutosize
				autoFocus
				id="description"
				placeholder="Descrição do post"
				defaultValue={props.description}
				className="mb-10 w-full resize-none appearance-none overflow-hidden bg-transparent text-center text-xl font-bold focus:outline-none"
				{...register("description")}
			/>
			<div className="mb-10">
				<p className="text-center text-sm text-gray-500">
					Use <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">/</kbd>{" "}
					para abrir o menu do editor.
				</p>
				<p className="text-center text-sm text-gray-500">
					Utilize Markdown para formatar o texto.
				</p>
			</div>
			<Controller
				name="content"
				control={control}
				render={({ field }) => {
					return <Tiptap {...field} content={props.content} />
				}}
			/>
		</form>
	)
}
