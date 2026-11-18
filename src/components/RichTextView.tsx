import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function RichTextView({ data }: { data: unknown }) {
  if (!data) return null
  return (
    <div className="prose">
      <RichText data={data as SerializedEditorState} />
    </div>
  )
}
