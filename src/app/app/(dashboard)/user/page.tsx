import { Metadata } from 'next'
import { getSession } from '@libs/auth'
import { Form } from '@components/form'

export const metadata: Metadata = {
	title: 'Dashboard | Conta'
}

export default async function Page() {
	const session = await getSession()

	return (
		<main className='container my-10'>
			<p className='mb-10 text-xl font-bold md:text-3xl'>Conta - {session?.user.name}</p>

			<div className='flex flex-col gap-5'>
				<Form
					title='Nome de Usuário'
					description='O nome de usuário para a sua conta nessa plataforma.'
					targetUpdate='user'
					inputSettings={{
						name: 'name',
						type: 'text',
						placeholder: 'Nome de Usuário',
						defaultValue: session?.user.name ?? ''
					}}
				/>

				<Form
					title='Imagem de Perfil'
					description='A imagem de perfil para a sua conta. Clique na imagem para alterá-la.'
					targetUpdate='user'
					inputSettings={{
						name: 'image',
						type: 'file',
						placeholder: 'Imagem de Perfil',
						defaultValue: session?.user.image ?? ''
					}}
				/>
			</div>
		</main>
	)
}
