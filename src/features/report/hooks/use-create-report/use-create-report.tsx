import React from "react"
import { useParams } from "next/navigation"

import html2canvas from "html2canvas"
import { toast } from "sonner"

import { uploadReportImage } from "@/libs/supabase"
import { api } from "@/shared/trpc/client"

import { CreateReportData } from "../../dtos/create-report-dto"

export const useCreateReport = () => {
	const { domain } = useParams() as { domain: string }

	const subdomain = domain.split(".")[0] as string

	const [isLoadingReport, startTransitionReport] = React.useTransition()
	const [isLoadingCapture, startTransitionCapture] = React.useTransition()
	const [capturedImage, setCapturedImage] = React.useState<Blob | null>(null)

	const { data: site } = api.site.getSiteBySubdomain.useQuery({ subdomain })
	const { data: userIp } = api.user.getUserIp.useQuery()
	const { data: reportIps } = api.report.getReportIps.useQuery()

	const { mutate } = api.report.create.useMutation({
		onSuccess: () => {
			toast.success("Report enviado")
		},
		onError: (error) => {
			toast.error(error.shape?.message)
		}
	})

	const captureScreen = () => {
		startTransitionCapture(async () => {
			const canvas = await html2canvas(document.documentElement, {
				scrollX: 0,
				scrollY: 0
			})

			canvas.toBlob((blob) => {
				setCapturedImage(blob)
			})
		})
	}

	const createReport = (data: CreateReportData) => {
		startTransitionReport(async () => {
			if (!capturedImage) {
				captureScreen()
				toast.error("Incluímos uma captura de tela para melhor análise, tente novamente!")
				return
			}

			if (reportIps?.some((report) => report.userIp === userIp)) {
				toast.error("Já contamos com o seu reporte, obrigado!")
				return
			}

			const result = await uploadReportImage({ blob: capturedImage })

			mutate({
				siteId: site?.id as string,
				imagePath: result.path as string,
				imageUrl: result.publicUrl,
				reason: data.reason
			})
		})
	}

	return {
		isLoadingCapture,
		isLoadingReport,
		createReport,
		captureScreen,
		capturedImage
	}
}
