import { prisma } from '@libs/prisma'
import { Form } from '@components/form'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
	const post = await prisma.post.findUnique({
		where: {
			id: params.id
		}
	})

	if (!post) {
		redirect('/')
	}

	return (
		<main className='container my-10'>
			<div className='flex flex-col gap-5'>
				<Form
					title='Imagem Thumbnail'
					description='A imagem de thumbnail para o seu post. Clique na imagem para alterá-la.'
					targetUpdate='post'
					inputSettings={{
						name: 'image',
						type: 'file',
						placeholder: 'Meu post',
						defaultValue: post.image ?? ''
					}}
				/>

				<Form
					title='Apagar Post'
					description={`Você está prestes a deletar seu post (${post?.title}).`}
					targetUpdate='post'
					inputSettings={{
						name: 'delete-post',
						type: 'text',
						placeholder: 'Post'
					}}
					buttonText='Apagar Post'
					className='border-red-600'
				/>
			</div>
		</main>
	)
}
