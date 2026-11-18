// Convierte párrafos de texto simple al formato del editor de texto enriquecido (Lexical).
// Una línea que empieza con "## " se convierte en subtítulo.
const text = (value: string) => ({ type: 'text', text: value, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const block = (type: string, extra: Record<string, unknown>, value: string) => ({
  type,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children: [text(value)],
  ...extra,
})

export function toLexical(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((p) =>
        p.startsWith('## ') ? block('heading', { tag: 'h2' }, p.slice(3)) : block('paragraph', { textFormat: 0 }, p),
      ),
    },
  }
}
