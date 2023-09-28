import { placeholderBlurhash } from '@libs/utils'
import { BlurImage } from '@shared/components/blur-image'

interface PostProfileProps {
	name: string
	image: string
}

export const PostProfile = async ({ name, image }: PostProfileProps) => {
	return (
		<div className='flex items-center gap-3'>
			<figure className='h-10 w-10 overflow-hidden rounded-full'>
				<BlurImage
					width={100}
					height={100}
					alt='Blurhash'
					src={image}
					placeholder='blur'
					blurDataURL={placeholderBlurhash}
					className='h-10 w-10 rounded-full object-cover'
				/>
			</figure>
			<p>{name}</p>
		</div>
	)
}
