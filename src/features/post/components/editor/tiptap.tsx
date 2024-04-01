import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { Link } from "@tiptap/extension-link"
import {
	BubbleMenu,
	EditorContent,
	FloatingMenu,
	JSONContent,
	useEditor
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import css from "highlight.js/lib/languages/css"
import js from "highlight.js/lib/languages/javascript"
import ts from "highlight.js/lib/languages/typescript"
import html from "highlight.js/lib/languages/xml"
import { createLowlight } from "lowlight"
import {
	Bold,
	Code,
	Heading1,
	Heading2,
	Heading3,
	Italic,
	Link as LinkIcon,
	List,
	ListOrdered,
	MessageSquareQuote,
	Strikethrough
} from "lucide-react"

import { BubbleButton } from "./bubble-button"

import "highlight.js/styles/atom-one-dark.css"

import React from "react"

import { EditorProps } from "@tiptap/pm/view"
import { toast } from "sonner"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"

const lowlight = createLowlight()
lowlight.register("html", html)
lowlight.register("css", css)
lowlight.register("js", js)
lowlight.register("ts", ts)

interface Props extends EditorProps {
	onChange: (content: JSONContent) => void
	content?: JSONContent
}

export const Tiptap = React.forwardRef<HTMLDivElement, Props>(
	({ onChange, content }, ref) => {
		const [url, setUrl] = React.useState("")

		const editor = useEditor({
			extensions: [
				StarterKit,
				Link.extend({
					inclusive: false
				}),
				Link.configure({
					validate: (href) => /^https?:\/\//.test(href)
				}),
				CodeBlockLowlight.configure({
					lowlight
				})
			],
			content: content ?? "Comece a escrever...",
			onUpdate: ({ editor }) => {
				onChange(editor.getJSON())
			},
			editorProps: {
				attributes: {
					class: "outline-none"
				}
			}
		})

		const saveLink = React.useCallback(() => {
			if (url) {
				if (!/^https?:\/\//.test(url)) {
					toast.error("Insira uma URL válida")
					return
				}

				editor
					?.chain()
					.focus()
					.extendMarkRange("link")
					.setLink({ href: url, target: "_blank" })
					.run()
			} else {
				editor?.chain().focus().extendMarkRange("link").unsetLink().run()
			}
			editor?.commands.blur()
		}, [editor, url])

		const removeLink = React.useCallback(() => {
			editor?.chain().focus().extendMarkRange("link").unsetLink().run()
		}, [editor])

		return (
			<>
				<EditorContent
					ref={ref}
					editor={editor}
					className="prose prose-sm mx-auto rounded-md border p-2 dark:prose-invert sm:prose lg:prose-lg xl:prose-2xl"
				/>
				{editor && (
					<FloatingMenu
						editor={editor}
						shouldShow={({ state }) => {
							const { $from } = state.selection
							const currentLineText = $from.nodeBefore?.textContent
							return currentLineText === "/"
						}}
						className="divide-x-muted scrollbar-hide flex max-h-44 w-80 flex-col divide-x overflow-scroll rounded-md">
						<BubbleButton
							data-active={editor.isActive("heading", { level: 1 })}
							onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
							className="flex items-center gap-2">
							<Heading1 size={30} />
							<div className="flex flex-col items-start justify-start gap-2">
								<p>Título 1</p>
								<p className="text-xs">Título de seção grande</p>
							</div>
						</BubbleButton>
						<BubbleButton
							data-active={editor.isActive("heading", { level: 2 })}
							onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
							className="flex items-center gap-2">
							<Heading2 size={30} />
							<div className="flex flex-col items-start justify-start gap-2">
								<p>Título 2</p>
								<p className="text-xs">Título de seção médio</p>
							</div>
						</BubbleButton>
						<BubbleButton
							data-active={editor.isActive("heading", { level: 3 })}
							onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
							className="flex items-center gap-2">
							<Heading3 size={30} />
							<div className="flex flex-col items-start justify-start gap-2">
								<p>Título 3</p>
								<p className="text-xs">Título de seção pequeno</p>
							</div>
						</BubbleButton>
						<BubbleButton
							data-active={editor.isActive("blockquote")}
							onClick={() => editor.chain().focus().toggleBlockquote().run()}
							className="flex items-center gap-2">
							<MessageSquareQuote size={30} />
							<div className="flex flex-col items-start justify-start gap-2">
								<p>Citação</p>
								<p className="text-xs">Capture uma citação</p>
							</div>
						</BubbleButton>
						<BubbleButton
							data-active={editor.isActive("orderedList")}
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
							className="flex items-center gap-2">
							<ListOrdered size={30} />
							<div className="flex flex-col items-start justify-start gap-2">
								<p>Lista numerada</p>
								<p className="text-xs">Criar uma lista com numeração</p>
							</div>
						</BubbleButton>
						<BubbleButton
							data-active={editor.isActive("unorderedList")}
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							className="flex items-center gap-2">
							<List size={30} />
							<div className="flex flex-col items-start justify-start gap-2">
								<p>Lista com marcadores</p>
								<p className="text-xs">Criar uma lista com marcadores simples</p>
							</div>
						</BubbleButton>
					</FloatingMenu>
				)}
				{editor && (
					<BubbleMenu
						editor={editor}
						className="divide-x-muted divide-x overflow-hidden rounded-md">
						<BubbleButton
							data-active={editor.isActive("bold")}
							onClick={() => editor.chain().focus().toggleBold().run()}>
							<Bold size={14} />
						</BubbleButton>
						<BubbleButton
							data-active={editor.isActive("italic")}
							onClick={() => editor.chain().focus().toggleItalic().run()}>
							<Italic size={14} />
						</BubbleButton>
						<BubbleButton
							data-active={editor.isActive("strike")}
							onClick={() => editor.chain().focus().toggleStrike().run()}>
							<Strikethrough size={14} />
						</BubbleButton>
						<BubbleButton
							data-active={editor.isActive("codeBlock")}
							onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
							<Code size={14} />
						</BubbleButton>

						<Popover
							onOpenChange={(open) => {
								if (!open) {
									setUrl("")
								}

								if (open) {
									setUrl(editor.getAttributes("link").href)
								}
							}}>
							<PopoverTrigger asChild>
								<BubbleButton data-active={editor.isActive("link")}>
									<LinkIcon size={14} />
								</BubbleButton>
							</PopoverTrigger>
							<PopoverContent sideOffset={10}>
								<Input
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									placeholder="Insira uma URL válida"
									autoFocus
									className="mb-3"
								/>
								<div className="flex items-center justify-end gap-3">
									<Button size="sm" onClick={saveLink} type="button">
										Salvar
									</Button>
									<Button size="sm" onClick={removeLink} type="button">
										Remover
									</Button>
								</div>
							</PopoverContent>
						</Popover>
					</BubbleMenu>
				)}
			</>
		)
	}
)
Tiptap.displayName = "Tiptap"
