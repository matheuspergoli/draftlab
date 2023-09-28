import { getSession } from '@libs/auth'
import { placeholderBlurhash } from '@libs/utils'
import { LogOut as LogOutIcon } from 'lucide-react'
import { ThemeMode } from '@shared/components/theme-mode'
import { BlurImage } from '@shared/components/blur-image'
import { SignOutButton } from '@shared/components/sign-out-button'

export const UserProfile = async () => {
	const session = await getSession()

	return (
		<div className='flex items-center gap-3'>
			<figure className='h-10 w-10 overflow-hidden rounded-full'>
				<BlurImage
					width={100}
					height={100}
					alt='Blurhash'
					src={
						session?.user.image ??
						'https://placehold.co/500x500/png?text=Profile&font=roboto'
					}
					placeholder='blur'
					blurDataURL={placeholderBlurhash}
					className='h-10 w-10 rounded-full object-cover'
				/>
			</figure>
			<SignOutButton variant='ghost' className='bg-transparent'>
				<LogOutIcon />
			</SignOutButton>
			<ThemeMode />
		</div>
	)
}
