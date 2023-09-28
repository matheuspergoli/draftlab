'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@shared/ui/button'
import { updateSite } from '@libs/actions'
import { useToast } from '@shared/ui/use-toast'
import { useParams, useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@shared/ui/form'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter
} from '@shared/ui/card'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@shared/ui/select'

interface FormProps {
	title: string
	buttonText?: string
	description: string
	inputSettings: {
		name: KeyOptions
		placeholder?: string
		defaultValue?: string
	}
}

export const FontForm = ({
	title,
	description,
	buttonText = 'Salvar',
	inputSettings
}: FormProps) => {
	const form = useForm()
	const router = useRouter()
	const { toast } = useToast()
	const { id } = useParams() as { id: string }
	const [loading, setLoading] = React.useState(false)

	const onSubmit = async (data: unknown) => {
		setLoading(true)
		const formData = new FormData()

		if (typeof data === 'object' && data !== null) {
			for (const [key, value] of Object.entries(data)) {
				formData.append(key, value)
			}
		}

		const response = await updateSite(formData, id, inputSettings.name)

		if (response?.error) {
			form.setError(inputSettings.name, {
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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name={inputSettings.name}
					render={({ field }) => (
						<FormItem>
							<Card>
								<CardHeader>
									<CardTitle>
										<FormLabel htmlFor={inputSettings.name} className='text-3xl'>
											{title}
										</FormLabel>
									</CardTitle>
									<CardDescription>{description}</CardDescription>
								</CardHeader>
								<CardContent>
									<Select
										onValueChange={field.onChange}
										defaultValue={inputSettings.defaultValue}>
										<FormControl>
											<SelectTrigger className='max-w-lg'>
												<SelectValue placeholder='Selecione uma fonte para o seu site' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='font-roboto'>Roboto</SelectItem>
											<SelectItem value='font-inter'>Inter</SelectItem>
											<SelectItem value='font-poppins'>Poppins</SelectItem>
											<SelectItem value='font-lato'>Lato</SelectItem>
											<SelectItem value='font-open-sans'>Open Sans</SelectItem>
											<SelectItem value='font-nunito'>Nunito</SelectItem>
											<SelectItem value='font-montserrat'>Montserrat</SelectItem>
											<SelectItem value='font-raleway'>Raleway</SelectItem>
											<SelectItem value='font-ubuntu'>Ubuntu</SelectItem>
											<SelectItem value='font-fira-code'>Fira Code</SelectItem>
										</SelectContent>
									</Select>
								</CardContent>
								<CardFooter>
									<Button disabled={loading} type='submit'>
										{loading ? <Loader2 className='h-5 w-5 animate-spin' /> : buttonText}
									</Button>
								</CardFooter>
							</Card>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
