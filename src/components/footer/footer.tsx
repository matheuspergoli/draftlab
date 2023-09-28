import { GithubIcon, GlobeIcon, LinkedinIcon } from 'lucide-react'

export const Footer = () => {
	return (
		<div className='mt-20 border-t bg-secondary/30 py-10'>
			<section className='container flex flex-wrap items-center justify-between gap-5'>
				<h3 className='text-2xl'>
					<a
						href='https://app.draftlab.cloud/login'
						target='_blank'
						rel='noreferrer'
						className='font-bold'>
						DraftLabs Platforms
					</a>{' '}
					by Matheus Pergoli
				</h3>
				<div className='flex items-center gap-3'>
					Nos encontre em:{' '}
					<a
						href='https://www.linkedin.com/in/matheuspergoli/'
						target='_blank'
						rel='noreferrer'
						className='font-bold'>
						<LinkedinIcon />
					</a>
					<a
						href='https://matheuspergoli-portfolio.vercel.app/'
						target='_blank'
						rel='noreferrer'
						className='font-bold'>
						<GlobeIcon />
					</a>
					<a
						href='https://github.com/matheuspergoli'
						target='_blank'
						rel='noreferrer'
						className='font-bold'>
						<GithubIcon />
					</a>
				</div>
			</section>
		</div>
	)
}
