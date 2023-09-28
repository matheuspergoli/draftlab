'use client'

import '@/styles/editor.css'

import React from 'react'
import { Post } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import EditorJS from '@editorjs/editorjs'
import { Button } from '@shared/ui/button'
import { toast } from '@shared/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import TextareaAutosize from 'react-textarea-autosize'
import { useParams, useRouter } from 'next/navigation'
import { CreatePostSchema, CreatePostSchemaType } from '@validations/create-post-schema'

interface EditorProps {
	post?: Pick<Post, 'id' | 'title' | 'content' | 'description'>
	siteSettings?: {
		siteId: string
	}
}

export const Editor = ({ post, siteSettings }: EditorProps) => {
	const router = useRouter()
	const ref = React.useRef<typeof EditorJS>()
	const { id } = useParams() as { id: string }
	const [loading, setLoading] = React.useState(false)
	const [isMounted, setIsMounted] = React.useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<CreatePostSchemaType>({
		resolver: zodResolver(CreatePostSchema)
	})

	const onSubmit = async (data: CreatePostSchemaType) => {
		setLoading(true)

		const content = await ref.current?.save()

		const response = await fetch(`/api/post/${siteSettings?.siteId ?? id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Post-Id': post?.id ?? ''
			},
			body: JSON.stringify({
				...data,
				content
			})
		})

		if (response.ok) {
			toast({
				title: 'Post criado com sucesso.',
				description: 'Vá para a página Posts para visualizá-lo.'
			})
		} else {
			toast({
				variant: 'destructive',
				title: 'Houve um erro ao salvar o post.',
				description: 'Tente novamente mais tarde.'
			})
		}

		router.refresh()
		setLoading(false)
	}

	const initializeEditor = React.useCallback(async () => {
		const EditorJS = (await import('@editorjs/editorjs')).default
		const Header = (await import('@editorjs/header')).default
		const Embed = (await import('@editorjs/embed')).default
		const List = (await import('@editorjs/list')).default
		const Code = (await import('@editorjs/code')).default
		const LinkTool = (await import('@editorjs/link')).default
		const InlineCode = (await import('@editorjs/inline-code')).default

		if (!ref.current) {
			const editor = new EditorJS({
				holder: 'editor',
				onReady() {
					ref.current = editor
				},
				placeholder: 'Comece a escrever...',
				inlineToolbar: true,
				data: post?.content ?? undefined,
				tools: {
					header: Header,
					linkTool: LinkTool,
					list: List,
					code: Code,
					inlineCode: InlineCode,
					embed: Embed
				}
			})
		}
	}, [post])

	React.useEffect(() => {
		if (typeof window !== 'undefined') {
			setIsMounted(true)
		}
	}, [])

	React.useEffect(() => {
		if (isMounted) {
			initializeEditor()

			return () => {
				ref.current?.destroy()
				ref.current = undefined
			}
		}
	}, [isMounted, initializeEditor])

	React.useEffect(() => {
		if (Object.entries(errors).length > 0) {
			toast({
				variant: 'destructive',
				title: 'Houve um erro ao salvar o post.',
				description: String(
					errors[Object.keys(errors)[0] as keyof typeof errors]?.message
				)
			})
		}
	}, [errors])

	if (!isMounted) {
		return null
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Button type='submit' disabled={loading} className='ml-auto block w-fit'>
				{loading ? <Loader2 className='animate-spin' /> : 'Salvar'}
			</Button>
			<section className='prose prose-stone mx-auto dark:prose-invert'>
				<TextareaAutosize
					autoFocus
					id='title'
					defaultValue={post?.title ?? ''}
					placeholder='Título do post'
					className='w-full resize-none appearance-none overflow-hidden bg-transparent text-4xl font-bold focus:outline-none'
					{...register('title')}
				/>
				<TextareaAutosize
					autoFocus
					id='description'
					defaultValue={post?.description ?? ''}
					placeholder='Descrição do post'
					className='mb-10 w-full resize-none appearance-none overflow-hidden bg-transparent text-xl font-bold focus:outline-none'
					{...register('description')}
				/>
				<p className='text-sm text-gray-500'>
					Use <kbd className='rounded-md border bg-muted px-1 text-xs uppercase'>Tab</kbd>{' '}
					para abrir o menu do editor.
				</p>
				<div id='editor' className='min-h-[500px]' />
			</section>
		</form>
	)
}
