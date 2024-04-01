"use client"

import Image from "next/image"

import { zodResolver } from "@hookform/resolvers/zod"
import { MessageSquareWarning } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/shared/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { Textarea } from "@/shared/ui/textarea"

import { CreateReportData, CreateReportDTO } from "../../dtos/create-report-dto"
import { useCreateReport } from "../../hooks/use-create-report"

export const ReportWidget = () => {
	const {
		isLoadingCapture,
		isLoadingReport,
		createReport,
		captureScreen,
		capturedImage
	} = useCreateReport()

	const {
		reset,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<CreateReportData>({
		resolver: zodResolver(CreateReportDTO)
	})

	const onSubmit = (data: CreateReportData) => {
		createReport(data)
		if (capturedImage) {
			reset()
		}
	}

	return (
		<Popover>
			<PopoverTrigger className="fixed bottom-10 right-10 rounded-full border bg-muted p-2">
				<MessageSquareWarning size={40} />
			</PopoverTrigger>
			<PopoverContent sideOffset={10}>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
					<div>
						<p>Enviar reporte</p>
						<span className="text-sm">Comece descrevendo o motivo</span>
						{errors.reason && (
							<p className="mb-5 text-sm text-red-500">{errors.reason.message}</p>
						)}
					</div>
					{capturedImage && (
						<figure className="relative h-40">
							<a
								href={URL.createObjectURL(capturedImage)}
								target="_blank"
								rel="noreferrer">
								<Image
									src={URL.createObjectURL(capturedImage)}
									alt="Captured screen"
									className="rounded-md"
									fill
								/>
							</a>
						</figure>
					)}
					<Textarea
						placeholder="Ex.: Imagens explícitas, conteúdo inapropriado, etc."
						{...register("reason")}
					/>
					<div className="flex items-center justify-between gap-3">
						<Button
							type="button"
							className="w-fit"
							disabled={isLoadingCapture}
							onClick={() => {
								captureScreen()
							}}>
							{isLoadingCapture ? "Capturando..." : "Capturar tela"}
						</Button>
						<Button className="w-fit" disabled={isLoadingReport}>
							{isLoadingReport ? "Enviando..." : "Enviar"}
						</Button>
					</div>
				</form>
			</PopoverContent>
		</Popover>
	)
}
