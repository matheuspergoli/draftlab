import { prisma } from '@libs/prisma'
import { Form } from '@components/form'

export default async function Page({ params }: { params: { id: string } }) {
	const site = await prisma.site.findUnique({
		where: {
			id: params.id
		},
		select: {
			name: true,
			description: true,
			subdomain: true
		}
	})

	return (
		<main className='container my-10'>
			<div className='flex flex-col gap-5'>
				<Form
					title='Nome'
					description='O nome do seu site. Isso será usado como o título do seu site no google.'
					targetUpdate='site'
					inputSettings={{
						name: 'name',
						type: 'text',
						placeholder: 'Meu site',
						defaultValue: site?.name ?? ''
					}}
				/>

				<Form
					title='Descrição'
					description='A descrição do seu site. Isso será usado como a descrição do seu site no google.'
					targetUpdate='site'
					inputSettings={{
						name: 'description',
						type: 'text',
						placeholder: 'Descrição do meu site',
						defaultValue: site?.description ?? ''
					}}
				/>

				<Form
					title='Subdomínio'
					description='O subdomínio do seu site. Isso será usado como o subdomínio do seu site no google.'
					targetUpdate='site'
					inputSettings={{
						name: 'subdomain',
						type: 'text',
						placeholder: 'subdomínio-do-meu-site',
						defaultValue: site?.subdomain ?? ''
					}}
				/>

				<Form
					title='Apagar Site'
					description={`Você está prestes a deletar seu site (${site?.name}).`}
					targetUpdate='site'
					inputSettings={{
						name: 'delete-site',
						type: 'text',
						placeholder: 'Site'
					}}
					buttonText='Apagar Site'
					className='border-red-600'
				/>
			</div>
		</main>
	)
}
