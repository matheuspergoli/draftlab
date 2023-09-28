'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@libs/utils'
import { buttonVariants } from '@shared/ui/button'
import { useSelectedLayoutSegments, useParams } from 'next/navigation'
import { Layout, LayoutGrid, Settings, ScrollText, FilePlus, UserCog } from 'lucide-react'

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@shared/ui/sheet'

export const Navbar = ({ children }: { children: React.ReactNode }) => {
	const segments = useSelectedLayoutSegments()
	const { id } = useParams() as { id: string }

	const tabs = React.useMemo<NavTab[]>(() => {
		if (segments[0] === 'site' && id) {
			return [
				{
					name: 'Configurações',
					href: `/site/${id}/settings`,
					icon: <Settings width={18} />,
					isActive: segments.includes('settings')
				},
				{
					name: 'Aparência',
					href: `/site/${id}/appearance`,
					icon: <Layout width={18} />,
					isActive: segments.includes('appearance')
				},
				{
					name: 'Posts',
					href: `/site/${id}/posts`,
					icon: <ScrollText width={18} />,
					isActive: segments.includes('posts')
				},
				{
					name: 'Criar Post',
					href: `/site/${id}/post`,
					icon: <FilePlus width={18} />,
					isActive: segments.includes('post')
				},
				{
					name: 'Overview',
					href: '/',
					icon: <LayoutGrid width={18} />
				}
			]
		} else if (segments[0] === 'post' && id) {
			return [
				{
					name: 'Editor',
					href: `/post/${id}`,
					icon: <ScrollText width={18} />,
					isActive: segments.length === 2
				},
				{
					name: 'Configurações',
					href: `/post/${id}/settings`,
					icon: <Settings width={18} />,
					isActive: segments.includes('settings')
				},
				{
					name: 'Overview',
					href: '/',
					icon: <LayoutGrid width={18} />
				}
			]
		} else {
			return [
				{
					name: 'Overview',
					href: '/',
					icon: <LayoutGrid width={18} />,
					isActive: segments.length === 0
				},
				{
					name: 'Conta',
					href: '/user',
					icon: <UserCog width={18} />,
					isActive: segments.includes('user')
				}
			]
		}
	}, [segments, id])

	return (
		<nav className='border-b py-3'>
			<div className='container flex items-center justify-between gap-5'>
				<div className='hidden items-center gap-5 md:flex'>
					{tabs.map((tab) => (
						<Link
							key={tab.href}
							href={tab.href}
							className={cn(
								'flex items-center gap-2',
								buttonVariants({ variant: `${tab.isActive ? 'default' : 'ghost'}` })
							)}>
							{tab.icon} {tab.name}
						</Link>
					))}
				</div>

				<div className='md:hidden lg:block'>{children}</div>

				<Sheet>
					<SheetTrigger className={cn(buttonVariants(), 'md:hidden')}>Menu</SheetTrigger>
					<SheetContent>
						<SheetHeader className='mb-10'>
							<SheetTitle>DraftLab Platforms</SheetTitle>
						</SheetHeader>

						<div className='flex flex-col items-center gap-5'>
							{tabs.map((tab) => (
								<Link
									key={tab.href}
									href={tab.href}
									className={cn(
										'flex w-full items-center gap-2',
										buttonVariants({ variant: `${tab.isActive ? 'default' : 'ghost'}` })
									)}>
									{tab.icon} {tab.name}
								</Link>
							))}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	)
}
