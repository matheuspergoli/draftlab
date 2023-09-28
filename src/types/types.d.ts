// Module declaration for EditorJS
declare module '@editorjs/code'
declare module '@editorjs/editorjs'
declare module '@editorjs/embed'
declare module '@editorjs/header'
declare module '@editorjs/inline-code'
declare module '@editorjs/list'
declare module '@editorjs/paragraph'

// Module declaration for Sanitize HTML
declare module 'sanitize-html'

type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware

type KeyOptions =
	| 'name'
	| 'subdomain'
	| 'description'
	| 'message404'
	| 'image'
	| 'logo'
	| 'font'
	| 'delete-site'
	| 'delete-post'

interface NavTab {
	name: string
	href: string
	isActive?: boolean
	icon: React.JSX.Element
}
