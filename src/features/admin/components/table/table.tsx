"use client"

import React from "react"

import { run } from "@/libs/utils"
import { api } from "@/shared/trpc/client"
import { Button } from "@/shared/ui/button"

import { DataTable } from "./data-table"
import { Report, reportColumns } from "./report-columns"
import { Site, siteColumns } from "./site-columns"
import { User, userColumns } from "./user-columns"

type TableKey = "reports" | "users" | "sites"

const initialState = {
	currentTable: "reports" as TableKey,
	data: {
		reports: [] as Report[],
		users: [] as User[],
		sites: [] as Site[]
	},
	columns: {
		reports: reportColumns,
		users: userColumns,
		sites: siteColumns
	}
}

type State = typeof initialState

type Action =
	| { type: "SWITCH_TABLE"; payload: TableKey }
	| { type: "SET_USERS"; payload: { users: User[] } }
	| { type: "SET_REPORTS"; payload: { reports: Report[] } }
	| { type: "SET_SITES"; payload: { sites: Site[] } }

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "SWITCH_TABLE":
			return { ...state, currentTable: action.payload }
		case "SET_USERS":
			return { ...state, data: { ...state.data, users: action.payload.users } }
		case "SET_REPORTS":
			return { ...state, data: { ...state.data, reports: action.payload.reports } }
		case "SET_SITES":
			return { ...state, data: { ...state.data, sites: action.payload.sites } }
		default:
			return state
	}
}

export const Table = () => {
	const [state, dispatch] = React.useReducer(reducer, initialState)
	const { data: reports } = api.admin.getReports.useQuery()
	const { data: users } = api.admin.getUsers.useQuery()
	const { data: sites } = api.admin.getSites.useQuery()

	React.useEffect(() => {
		if (users) {
			dispatch({ type: "SET_USERS", payload: { users } })
		}

		if (sites) {
			dispatch({ type: "SET_SITES", payload: { sites } })
		}

		if (reports) {
			const formattedReports = reports.map((report) => {
				return {
					id: report.id,
					reason: report.reason,
					siteId: report.siteId,
					image: report.image?.url,
					status: report.status
				}
			})
			dispatch({
				type: "SET_REPORTS",
				payload: { reports: formattedReports }
			})
		}
	}, [users, sites, reports])

	return (
		<div>
			<h2 className="mb-2 text-lg">Tabela atual</h2>
			<div className="mb-10 flex items-center gap-3">
				<Button
					variant="outline"
					data-payload={state.currentTable}
					className="data-[payload=reports]:bg-primary-foreground data-[payload=reports]:text-black"
					onClick={() => dispatch({ type: "SWITCH_TABLE", payload: "reports" })}>
					Reportes
				</Button>
				<Button
					variant="outline"
					data-payload={state.currentTable}
					className="data-[payload=users]:bg-primary-foreground data-[payload=users]:text-black"
					onClick={() => dispatch({ type: "SWITCH_TABLE", payload: "users" })}>
					Usuários
				</Button>
				<Button
					variant="outline"
					data-payload={state.currentTable}
					className="data-[payload=sites]:bg-primary-foreground data-[payload=sites]:text-black"
					onClick={() => dispatch({ type: "SWITCH_TABLE", payload: "sites" })}>
					Sites
				</Button>
			</div>
			{run(() => {
				if (state.currentTable === "reports") {
					return <DataTable columns={state.columns.reports} data={state.data.reports} />
				}

				if (state.currentTable === "users") {
					return <DataTable columns={state.columns.users} data={state.data.users} />
				}

				if (state.currentTable === "sites") {
					return <DataTable columns={state.columns.sites} data={state.data.sites} />
				}

				return null
			})}
		</div>
	)
}
