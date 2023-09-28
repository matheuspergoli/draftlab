import { placeholderBlurhash } from '@libs/utils'
import { BlurImage } from '@shared/components/blur-image'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@shared/ui/card'

interface SiteCardProps {
	name: string
	image: string
	description: string
}

export const SiteCard = ({ name, image, description }: SiteCardProps) => {
	return (
		<Card className='group cursor-pointer transition hover:border-accent-foreground'>
			<CardHeader>
				<CardTitle className='truncate text-2xl'>{name}</CardTitle>
				<CardDescription className='truncate'>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<figure className='h-44 w-full overflow-hidden rounded-md'>
					<BlurImage
						width={500}
						height={500}
						alt={name}
						src={image}
						placeholder='blur'
						blurDataURL={placeholderBlurhash}
						className='h-full w-full rounded-md object-cover group-hover:scale-105 group-hover:duration-300'
					/>
				</figure>
			</CardContent>
		</Card>
	)
}
