import Link from 'next/link'
import { prisma } from '@libs/prisma'
import { getSession } from '@libs/auth'
import { SiteCard } from '@components/card'
import { CreateSiteModal } from '@components/modal'

export default async function Page() {
	const session = await getSession()
	const sites = await prisma.site.findMany({
		where: {
			userId: session?.user.id
		},
		select: {
			id: true,
			name: true,
			image: true,
			description: true
		}
	})

	return (
		<main className='container mt-10'>
			<section>
				<div className='flex items-center justify-between'>
					<h2 className='text-xl font-semibold sm:text-2xl'>
						{sites.length === 0 ? 'Você não tem sites' : `Seus sites: ${sites.length}`}
					</h2>
					<CreateSiteModal />
				</div>

				<article className='mt-5 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
					{sites.map((site) => (
						<Link
							key={site.id}
							href={`/site/${site.id}/settings`}
							passHref
							legacyBehavior>
							<SiteCard
								key={site.id}
								name={site.name!}
								image={site.image!}
								description={site.description!}
							/>
						</Link>
					))}
				</article>
			</section>
		</main>
	)
}
