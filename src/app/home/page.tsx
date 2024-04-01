import { env } from "@/environment/env"
import { Button } from "@/shared/ui/button"

export default function Page() {
	return (
		<main className="container mx-auto flex h-screen items-center justify-center">
			<Button asChild>
				<a href={env.NEXTAUTH_URL}>Sair daqui</a>
			</Button>
		</main>
	)
}
