/**
 * Simple Markdown renderer for Coach/Lesson responses
 * Supports: headings (**text**), lists, paragraphs, blockquotes, bold/italic
 */
export default function Markdown({ content }) {
  if (!content) return null;

  const lines = content.split("\n");
  const blocks = [];
  let currentList = null;

  const pushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    if (!trimmed) {
      pushList();
      return;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      pushList();
      blocks.push({ type: "h3", content: trimmed.slice(4), key: i });
      return;
    }
    if (trimmed.startsWith("## ")) {
      pushList();
      blocks.push({ type: "h2", content: trimmed.slice(3), key: i });
      return;
    }
    if (trimmed.startsWith("# ")) {
      pushList();
      blocks.push({ type: "h1", content: trimmed.slice(2), key: i });
      return;
    }

    // Bold-only line as a pseudo-heading (**Title**)
    if (/^\*\*[^*]+\*\*:?$/.test(trimmed)) {
      pushList();
      const txt = trimmed.replace(/^\*\*|\*\*:?$/g, "");
      blocks.push({ type: "h3", content: txt, key: i });
      return;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      pushList();
      blocks.push({ type: "blockquote", content: trimmed.slice(2), key: i });
      return;
    }

    // List item
    if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const text = trimmed.replace(/^[-*]\s+|^\d+\.\s+/, "");
      if (!currentList) currentList = { type: "list", items: [], key: i };
      currentList.items.push(text);
      return;
    }

    pushList();
    blocks.push({ type: "p", content: trimmed, key: i });
  });
  pushList();

  const renderInline = (text) => {
    // Bold **text** and italic *text*
    const parts = [];
    let remaining = text;
    let key = 0;
    const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const content = match[0];
      if (content.startsWith("**")) {
        parts.push(
          <strong key={key++}>{content.slice(2, -2)}</strong>
        );
      } else {
        parts.push(<em key={key++}>{content.slice(1, -1)}</em>);
      }
      lastIndex = match.index + content.length;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  };

  return (
    <div className="prose-milagros">
      {blocks.map((b) => {
        if (b.type === "h1")
          return <h2 key={b.key}>{renderInline(b.content)}</h2>;
        if (b.type === "h2")
          return <h2 key={b.key}>{renderInline(b.content)}</h2>;
        if (b.type === "h3")
          return <h3 key={b.key}>{renderInline(b.content)}</h3>;
        if (b.type === "blockquote")
          return <blockquote key={b.key}>{renderInline(b.content)}</blockquote>;
        if (b.type === "list")
          return (
            <ul key={b.key}>
              {b.items.map((it, j) => (
                <li key={`${b.key}-item-${j}`}>{renderInline(it)}</li>
              ))}
            </ul>
          );
        return <p key={b.key}>{renderInline(b.content)}</p>;
      })}
    </div>
  );
}
