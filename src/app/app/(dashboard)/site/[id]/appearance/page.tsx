import { prisma } from '@libs/prisma'
import { FontForm, Form } from '@components/form'

export default async function Page({ params }: { params: { id: string } }) {
	const site = await prisma.site.findUnique({
		where: {
			id: params.id
		},
		select: {
			logo: true,
			image: true,
			font: true,
			message404: true
		}
	})

	return (
		<main className='container my-10'>
			<div className='flex flex-col gap-5'>
				<Form
					title='Imagem Thumbnail'
					description='A imagem de thumbnail para o seu site. Clique na imagem para alterá-la.'
					targetUpdate='site'
					inputSettings={{
						name: 'image',
						type: 'file',
						placeholder: 'Thumbnail image for My site',
						defaultValue: site?.image ?? ''
					}}
				/>

				<Form
					title='Logo'
					description='A imagem de logo para o seu site. Clique na imagem para alterá-la.'
					targetUpdate='site'
					inputSettings={{
						name: 'logo',
						type: 'file',
						placeholder: 'Logo for My site',
						defaultValue: site?.logo ?? ''
					}}
				/>

				<FontForm
					title='Fonte'
					description='Selecione uma fonte para o seu site.'
					inputSettings={{
						name: 'font',
						placeholder: 'Selecione uma fonte para o seu site',
						defaultValue: site?.font ?? ''
					}}
				/>

				<Form
					title='Mensagem de erro 404'
					description='Mensagem de erro para quando o usuário acessar uma página que não existe.'
					targetUpdate='site'
					inputSettings={{
						name: 'message404',
						type: 'text',
						placeholder: 'Página não encontrada',
						defaultValue: site?.message404 ?? ''
					}}
				/>
			</div>
		</main>
	)
}
