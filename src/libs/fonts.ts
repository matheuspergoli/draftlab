import {
	Fira_Code,
	Inter,
	Lato,
	Montserrat,
	Nunito,
	Open_Sans,
	Poppins,
	Raleway,
	Roboto,
	Ubuntu
} from "next/font/google"

const inter = Inter({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700", "900"]
})

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

const lato = Lato({
	subsets: ["latin"],
	weight: ["100", "300", "400", "700", "900"]
})

const openSans = Open_Sans({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800"]
})

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["200", "300", "400", "600", "700", "800", "900"]
})

const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

const raleway = Raleway({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

const ubuntu = Ubuntu({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"]
})

const firaCode = Fira_Code({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"]
})

export const fontMapper = {
	"font-roboto": roboto.className,
	"font-inter": inter.className,
	"font-poppins": poppins.className,
	"font-lato": lato.className,
	"font-open-sans": openSans.className,
	"font-nunito": nunito.className,
	"font-montserrat": montserrat.className,
	"font-raleway": raleway.className,
	"font-ubuntu": ubuntu.className,
	"font-fira-code": firaCode.className
} as const
