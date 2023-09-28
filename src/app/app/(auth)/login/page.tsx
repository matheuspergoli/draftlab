import { Lock as LockIcon, GithubIcon } from 'lucide-react'
import { SignInButton } from '@shared/components/sign-in-button'
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from '@shared/ui/card'

export default function Page() {
	return (
		<main className='container flex h-screen w-screen flex-col items-center justify-center'>
			<Card className='w-full max-w-md border-2'>
				<CardHeader>
					<div className='mx-auto mb-5 w-fit rounded-full border border-white p-3'>
						<LockIcon width={45} height={45} />
					</div>
					<CardTitle className='text-center text-xl sm:text-3xl'>
						DraftLab Platforms
					</CardTitle>
					<CardDescription className='text-center'>
						Crie e gerencie todos os seus sites do DraftLab com facilidade.
					</CardDescription>
				</CardHeader>
				<CardFooter>
					<SignInButton
						variant='ghost'
						size='lg'
						className='w-full gap-3 border-2 text-center'>
						<GithubIcon width={20} height={20} className='hidden sm:block' />
						Login com GitHub
					</SignInButton>
				</CardFooter>
			</Card>
		</main>
	)
}
