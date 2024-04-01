"use client"

import { Lock } from "lucide-react"

import { SignInButton } from "@/shared/components/sign-in-button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/shared/ui/card"

export default function Page() {
	return (
		<main className="container mx-auto flex h-screen flex-col items-center">
			<section className="mt-40 flex-1 px-3">
				<h1 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl 2xl:text-6xl">
					Bem vindo ao Draftlab
				</h1>
				<p className="mb-10 mt-5 text-center">
					Vamos começar conectando sua conta com o Github.
				</p>
				<Card className="mx-auto w-full max-w-md border-2">
					<CardHeader>
						<div className="mx-auto mb-5 w-fit rounded-full border border-white p-3">
							<Lock size={45} />
						</div>
						<CardTitle className="text-center text-3xl">Draftlab</CardTitle>
						<CardDescription className="text-center">
							Crie e gerencie todos os seus sites com o Draftlab.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<SignInButton size="lg" className="w-full border-2">
							Login com Github
						</SignInButton>
					</CardContent>
				</Card>
			</section>
			<footer className="mt-10 flex w-full flex-col items-center justify-center gap-4 border-t py-8 text-sm sm:flex-row">
				<p className="text-center">
					Site criado por{" "}
					<a
						href="https://www.linkedin.com/in/matheuspergoli"
						target="_blank"
						rel="noopener noreferrer"
						className="underline">
						Matheus Pergoli
					</a>
				</p>
				<div className="size-1 rounded-full bg-white/10" />
				<p className="text-center">
					Conecte-se comigo no{" "}
					<a
						href="https://www.linkedin.com/in/matheuspergoli"
						target="_blank"
						rel="noopener noreferrer"
						className="underline">
						LinkedIn
					</a>
				</p>
				<div className="size-1 rounded-full bg-white/10" />
				<p className="text-center">
					Me siga no{" "}
					<a
						href="https://github.com/matheus"
						target="_blank"
						rel="noopener noreferrer"
						className="underline">
						Github
					</a>
				</p>
			</footer>
		</main>
	)
}
