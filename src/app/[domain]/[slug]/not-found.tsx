import Image from 'next/image'
import { prisma } from '@libs/prisma'
import { headers } from 'next/headers'

export default async function NotFound() {
	const headersList = headers()
	const domain = headersList.get('host')!.split('.')[0]

	const site = await prisma.site.findUnique({
		where: {
			subdomain: domain
		},
		select: {
			message404: true
		}
	})

	return (
		<div className='flex flex-col items-center justify-center'>
			<p className='text-center text-lg text-stone-500'>
				{site
					? site.message404
					: 'Ops, parece que você se aventurou em território desconhecido.'}
			</p>
			<Image
				alt='missing site'
				src='https://illustrations.popsy.co/gray/timed-out-error.svg'
				width={400}
				height={400}
			/>
		</div>
	)
}
