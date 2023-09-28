import { ptBR } from 'date-fns/locale'
import { formatDistanceToNow } from 'date-fns'
import { placeholderBlurhash } from '@libs/utils'
import { BlurImage } from '@shared/components/blur-image'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter
} from '@shared/ui/card'

interface SiteCardProps {
	title: string
	image: string
	createdAt?: Date
	description: string
}

export const PostCard = ({ title, image, description, createdAt }: SiteCardProps) => {
	return (
		<Card className='group cursor-pointer transition hover:border-accent-foreground'>
			<CardHeader>
				<CardTitle className='truncate text-2xl'>{title}</CardTitle>
				<CardDescription className='truncate'>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<figure className='h-44 w-full overflow-hidden rounded-md'>
					<BlurImage
						width={500}
						height={500}
						alt={title}
						src={image}
						placeholder='blur'
						blurDataURL={placeholderBlurhash}
						className='h-full w-full rounded-md object-cover group-hover:scale-105 group-hover:duration-300'
					/>
				</figure>
			</CardContent>
			{createdAt && (
				<CardFooter>
					<p>
						Publicado{' '}
						{formatDistanceToNow(new Date(createdAt), {
							locale: ptBR,
							addSuffix: true
						})}
					</p>
				</CardFooter>
			)}
		</Card>
	)
}
