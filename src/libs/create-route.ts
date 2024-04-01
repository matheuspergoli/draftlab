import {
	ReadonlyURLSearchParams,
	useParams as useNextParams,
	useSearchParams as useNextSearchParams
} from "next/navigation"

import { z } from "zod"

type RouteBuilderRoot = () => string

interface RouteBuilder<Params extends z.ZodSchema, Search extends z.ZodSchema> {
	(opts?: z.input<Params> & { search: z.input<Search> }): string
	useParams: () => z.output<Params>
	useSearchParams: () => z.output<Search>
	parseSearchParams: (searchParams: unknown) => z.output<Search>
	parseParams: (params: unknown) => z.output<Params>
}

interface RouteBuilderWithParams<Params extends z.ZodSchema> {
	(opts: z.input<Params>): string
	useParams: () => z.output<Params>
	parseParams: (params: unknown) => z.output<Params>
}

interface RouteBuilderWithSearch<Search extends z.ZodSchema> {
	(opts: { search: z.input<Search> }): string
	useSearchParams: () => z.output<Search>
	parseSearchParams: (searchParams: unknown) => z.output<Search>
}

interface RouteBuilderWithParamsAndSearch<
	Params extends z.ZodSchema,
	Search extends z.ZodSchema
> {
	(opts: z.input<Params> & { search: z.input<Search> }): string
	useParams: () => z.output<Params>
	useSearchParams: () => z.output<Search>
	parseSearchParams: (searchParams: unknown) => z.output<Search>
	parseParams: (params: unknown) => z.output<Params>
}

export function createRoute<Params extends z.ZodSchema, Search extends z.ZodSchema>(
	fn: (params: z.input<Params>) => string,
	opts: { params: Params; search: Search }
): RouteBuilderWithParamsAndSearch<Params, Search>

export function createRoute<Params extends z.ZodSchema>(
	fn: (params: z.input<Params>) => string,
	opts: { params: Params }
): RouteBuilderWithParams<Params>

export function createRoute<Search extends z.ZodSchema>(
	fn: (params: z.input<Search>) => string,
	opts: { search: Search }
): RouteBuilderWithSearch<Search>

export function createRoute(fn: () => string): RouteBuilderRoot

export function createRoute<Params extends z.ZodSchema, Search extends z.ZodSchema>(
	fn: (params: z.input<Params>) => string,
	opts: { params?: Params; search?: Search } = {}
): RouteBuilder<Params, Search> {
	const params = opts.params ?? ({} as Params)
	const search = opts.search ?? ({} as Search)

	const routeBuilder: RouteBuilder<Params, Search> = (opts) => {
		const baseUrl = fn(opts)
		const searchString = search && new URLSearchParams(opts?.search).toString()
		return [baseUrl, searchString ? `?${searchString}` : ""].join("")
	}

	if (opts.params) {
		routeBuilder.parseParams = function parseParams(input: unknown) {
			const res = params.safeParse(input)
			if (!res.success) {
				throw new Error(`Invalid route params for route: ${res.error.message}`, {
					cause: "Error for route params"
				})
			}
			return res.data
		}

		routeBuilder.useParams = function useParams(): z.output<Params> {
			const res = params.safeParse(useNextParams())
			if (!res.success) {
				throw new Error(`Invalid route params for route: ${res.error.message}`, {
					cause: "Error for route params"
				})
			}
			return res.data
		}
	}

	if (opts.search) {
		routeBuilder.parseSearchParams = function parseSearchParams(input: unknown) {
			const res = search.safeParse(input)
			if (!res.success) {
				throw new Error(`Invalid search params for route: ${res.error.message}`, {
					cause: "Error for search params"
				})
			}
			return res.data
		}

		routeBuilder.useSearchParams = function useSearchParams(): z.output<Search> {
			const res = search.safeParse(convertURLSearchParamsToObject(useNextSearchParams()))
			if (!res.success) {
				throw new Error(`Invalid search params for route ${res.error.message}`, {
					cause: "Error for search params"
				})
			}
			return res.data
		}
	}

	return routeBuilder
}

function convertURLSearchParamsToObject(
	params: ReadonlyURLSearchParams | null
): Record<string, string | string[]> {
	if (!params) {
		return {}
	}

	const obj: Record<string, string | string[]> = {}
	for (const [key, value] of params.entries()) {
		if (params.getAll(key).length > 1) {
			obj[key] = params.getAll(key)
		} else {
			obj[key] = value
		}
	}
	return obj
}
