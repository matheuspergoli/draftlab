import { Metadata } from "next"

import { MenuMobile } from "@/widgets/menu-mobile"
import { Sidebar } from "@/widgets/sidebar"

export const metadata: Metadata = {
	title: "Dashboard | Overview"
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Sidebar />
			<div className="px-3 py-3 sm:ml-60 sm:px-10">
				<MenuMobile />
				{children}
			</div>
		</div>
	)
}
