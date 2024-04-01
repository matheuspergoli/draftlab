import React from "react"

import { cn } from "@/libs/utils"

interface Props extends React.PropsWithChildren {
	className?: string
}

export const DashboardLayout = ({ className, ...rest }: Props) => {
	return <main className={cn("container max-w-5xl", className)} {...rest} />
}
