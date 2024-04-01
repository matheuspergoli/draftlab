import { EditorCreate } from "@/features/post"
import { DashboardLayout } from "@/shared/layouts/dashboard-layout"

export default function Page() {
	return (
		<DashboardLayout className="mx-auto">
			<EditorCreate />
		</DashboardLayout>
	)
}
