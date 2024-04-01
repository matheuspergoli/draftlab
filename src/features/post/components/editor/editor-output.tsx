"use client"

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import Link from "@tiptap/extension-link"
import { EditorContent, JSONContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import css from "highlight.js/lib/languages/css"
import js from "highlight.js/lib/languages/javascript"
import ts from "highlight.js/lib/languages/typescript"
import html from "highlight.js/lib/languages/xml"
import { createLowlight } from "lowlight"

import "highlight.js/styles/atom-one-dark.css"

const lowlight = createLowlight()
lowlight.register("html", html)
lowlight.register("css", css)
lowlight.register("js", js)
lowlight.register("ts", ts)

export const EditorOutput = (props: { content: JSONContent }) => {
	const editor = useEditor({
		editable: false,
		content: props.content,
		extensions: [
			StarterKit,
			Link.extend({
				inclusive: false
			}),
			CodeBlockLowlight.configure({
				lowlight
			})
		]
	})

	return (
		<div className="prose prose-sm mx-auto dark:prose-invert sm:prose lg:prose-lg xl:prose-2xl">
			<EditorContent editor={editor} />
		</div>
	)
}
