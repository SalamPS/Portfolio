import { AutoMD } from '@/components/utils/Markdown'

export default function MarkdownTestPage() {
  const testMarkdown = `
# Test Markdown with Code Blocks

This is a paragraph with \`inline code\` in it.

Here's a JavaScript code block:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to our site, \${name}!\`;
}

greet('World');
\`\`\`

And here's a Python example:

\`\`\`python
def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    
    return fib

print(fibonacci(10))
\`\`\`

## Regular text

This is just regular text without code blocks. It should render normally.

- List item 1
- List item 2  
- List item with \`inline code\`

> This is a blockquote with some text.
`

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Markdown Test</h1>
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <AutoMD content={testMarkdown} />
        </div>
      </div>
    </div>
  )
}
