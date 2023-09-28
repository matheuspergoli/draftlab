'use client'

import React from 'react'
import { cn } from '@libs/utils'
import { Loader2 } from 'lucide-react'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { useForm } from 'react-hook-form'
import { env } from '@environment/env.mjs'
import { useRouter } from 'next/navigation'
import { Textarea } from '@shared/ui/textarea'
import { useToast } from '@shared/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, buttonVariants } from '@shared/ui/button'
import { CreateSiteSchema, CreateSiteSchemaType } from '@validations/create-site-schema'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter
} from '@shared/ui/dialog'

export const CreateSiteModal = () => {
	const router = useRouter()
	const { toast } = useToast()
	const [loading, setLoading] = React.useState(false)

	const {
		reset,
		watch,
		setValue,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<CreateSiteSchemaType>({
		resolver: zodResolver(CreateSiteSchema)
	})

	const nameInput = watch('name')

	React.useEffect(() => {
		setValue(
			'subdomain',
			nameInput
				?.toLowerCase()
				.trim()
				.replace(/[\W_]+/g, '-')
		)
	}, [nameInput, setValue])

	const onSubmit = async (data: CreateSiteSchemaType) => {
		setLoading(true)

		const response = await fetch('/api/site', {
			method: 'POST',
			body: JSON.stringify(data)
		})

		if (response.ok) {
			reset()

			toast({
				title: 'Site criado com sucesso!',
				description: 'Seu site foi criado com sucesso!'
			})
		}

		if (response.status === 409) {
			toast({
				variant: 'destructive',
				title: 'Esse subdomíno já existe!',
				description: 'O site que você está tentando criar está em uso!'
			})
		}

		setLoading(false)
		router.refresh()
	}

	return (
		<Dialog>
			<DialogTrigger className={cn(buttonVariants())}>Criar Novo Site</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='my-2 text-2xl font-bold'>
						Criar um novo site
					</DialogTitle>
				</DialogHeader>

				<section className='flex flex-col gap-2'>
					<Label htmlFor='name'>Nome do Site</Label>
					<Input
						id='name'
						type='text'
						placeholder='Meu site de blogs'
						className='rounded-md border p-2'
						{...register('name')}
					/>
					{errors.name && <p className='text-red-500'>{errors.name.message}</p>}
				</section>

				<section className='flex flex-col gap-2'>
					<Label htmlFor='subdomain'>Subdomínio do Site</Label>
					<div className='flex items-center'>
						<Input
							id='subdomain'
							type='text'
							placeholder='Subdomínio do site'
							className='rounded-bl-md rounded-br-none rounded-tl-md rounded-tr-none border p-2'
							{...register('subdomain')}
						/>
						<p className='rounded-br-md rounded-tr-md bg-stone-700 p-2 text-white'>
							.{env.NEXT_PUBLIC_ROOT_DOMAIN}
						</p>
					</div>
					{errors.subdomain && <p className='text-red-500'>{errors.subdomain.message}</p>}
				</section>

				<section className='flex flex-col gap-2'>
					<Label htmlFor='description'>Descrição do site</Label>
					<Textarea
						id='description'
						placeholder='Descrição do site'
						className='rounded-md border p-2'
						{...register('description')}
					/>
					{errors.description && (
						<p className='text-red-500'>{errors.description.message}</p>
					)}
				</section>

				<DialogFooter>
					<Button
						type='submit'
						disabled={loading}
						onClick={handleSubmit(onSubmit)}
						className='w-full rounded-md border px-3 py-2'>
						{loading ? <Loader2 className='animate-spin' /> : 'Criar Site'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
