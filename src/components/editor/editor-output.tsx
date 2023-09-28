import editorjsHTML from 'editorjs-html'
import sanitizeHtml from 'sanitize-html'

const editorParser = editorjsHTML()

export const EditorOutput = ({ content }: { content: unknown }) => {
	const parsedContent = String(editorParser.parse(content))

	const filteredContent = parsedContent.replace(/,/g, '')

	const sanitizedContent = sanitizeHtml(filteredContent, {
		allowedTags: [
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'ol',
			'ul',
			'li',
			'p',
			'strong',
			'em',
			'b',
			'i',
			'a',
			'img',
			'code',
			'pre'
		],
		allowedAttributes: {
			a: ['href', 'target', 'rel'],
			img: ['src', 'alt']
		},
		transformTags: {
			a: (tagName: string, attribs: { [key: string]: string }) => {
				return {
					tagName,
					attribs: {
						...attribs,
						target: '_blank',
						rel: 'noopener noreferrer'
					}
				}
			}
		}
	})

	return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
}
