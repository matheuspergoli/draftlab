'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { useForm } from 'react-hook-form'
import { Button } from '@shared/ui/button'
import { Textarea } from '@shared/ui/textarea'
import { useToast } from '@shared/ui/use-toast'
import { cn, placeholderBlurhash } from '@libs/utils'
import { useParams, useRouter } from 'next/navigation'
import { BlurImage } from '@shared/components/blur-image'
import { updateSite, updatePost, updateUser } from '@libs/actions'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@shared/ui/card'

interface FormProps {
	title: string
	className?: string
	buttonText?: string
	description: string
	targetUpdate: 'site' | 'post' | 'user'
	inputSettings: {
		name: KeyOptions
		type: 'text' | 'file'
		placeholder?: string
		defaultValue?: string
	}
}

export const Form = ({
	title,
	description,
	inputSettings,
	className,
	targetUpdate,
	buttonText = 'Salvar'
}: FormProps) => {
	const router = useRouter()
	const { toast } = useToast()
	const { id } = useParams() as { id: string }
	const [loading, setLoading] = React.useState(false)

	const {
		register,
		handleSubmit,
		setError,
		watch,
		formState: { errors }
	} = useForm()

	const aspectRatio = inputSettings.name === 'image' ? 'aspect-video' : 'aspect-square'
	const watchImage = inputSettings.name === 'image' ? watch('image') : watch('logo') ?? ''

	const onSubmit = async (data: unknown) => {
		let response
		setLoading(true)
		const formData = new FormData()

		if (typeof data === 'object' && data !== null) {
			for (const [key, value] of Object.entries(data)) {
				if (key === 'image' || key === 'logo') {
					formData.append(key, value[0])
				} else {
					formData.append(key, value)
				}
			}
		}

		if (targetUpdate === 'site') {
			response = await updateSite(formData, id, inputSettings.name)
		}

		if (targetUpdate === 'post') {
			response = await updatePost(formData, id, inputSettings.name)
		}

		if (targetUpdate === 'user') {
			response = await updateUser(formData, inputSettings.name)
		}

		if (response?.error) {
			setError(inputSettings.name, {
				message: response.error
			})
		}

		if (response?.success) {
			toast({
				title: response.success
			})

			router.refresh()
		}

		setLoading(false)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card className={cn(className)}>
				<CardHeader>
					<CardTitle>
						<Label htmlFor={inputSettings.name} className='text-3xl'>
							{title}
						</Label>
					</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>
					{inputSettings.name === 'name' && (
						<Input
							className='max-w-lg'
							{...inputSettings}
							{...register(inputSettings.name)}
						/>
					)}

					{inputSettings.name === 'description' && (
						<Textarea
							className='max-w-lg'
							{...inputSettings}
							{...register(inputSettings.name)}
						/>
					)}

					{inputSettings.name === 'subdomain' && (
						<Input
							className='max-w-lg'
							{...inputSettings}
							{...register(inputSettings.name)}
						/>
					)}

					{inputSettings.name === 'message404' && (
						<Input
							className='max-w-lg'
							{...inputSettings}
							{...register(inputSettings.name)}
						/>
					)}

					{inputSettings.name === 'image' || inputSettings.name === 'logo' ? (
						<Label
							htmlFor={inputSettings.name}
							className={cn('block w-full overflow-hidden rounded-md', {
								'max-w-screen-md': aspectRatio === 'aspect-video',
								'max-w-xs': aspectRatio === 'aspect-square'
							})}>
							<BlurImage
								src={
									watchImage?.[0]
										? URL.createObjectURL(watchImage[0])
										: inputSettings.defaultValue ?? ''
								}
								alt={inputSettings.name}
								width={500}
								height={500}
								blurDataURL={placeholderBlurhash}
								placeholder='blur'
								className={cn('h-full w-full rounded-md object-cover', aspectRatio)}
							/>
							<Input
								className='hidden'
								id={inputSettings.name}
								type={inputSettings.type}
								placeholder={inputSettings.placeholder}
								{...register(inputSettings.name)}
							/>
						</Label>
					) : null}

					{inputSettings.name.includes('delete') && (
						<p className='font-bold text-red-600'>(Essa é uma ação irreversível!)</p>
					)}

					{errors[inputSettings.name]?.message && (
						<p className='text-red-600'>
							{errors[inputSettings.name]?.message as string}
						</p>
					)}
				</CardContent>
				<CardFooter>
					<Button
						disabled={loading}
						variant={
							(inputSettings.name.includes('delete') && 'destructive') || 'default'
						}>
						{loading ? <Loader2 className='h-5 w-5 animate-spin' /> : buttonText}
					</Button>
				</CardFooter>
			</Card>
		</form>
	)
}
