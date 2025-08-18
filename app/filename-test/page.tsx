import { AutoMD } from '@/components/utils/Markdown'
import { CodeBlock } from '@/components/utils/CodeBlock'

export default function FilenameTestPage() {
  const testMarkdown = `
# Test Code Blocks with Filenames

Here are different ways to specify code blocks:

## With Filename (app.js)
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome, \${name}!\`;
}
\`\`\`

## With Filename (main.py)
\`\`\`python
def fibonacci(n):
    if n <= 0:
        return []
    return [0, 1] if n <= 2 else fibonacci(n-1) + [fibonacci(n-1)[-1] + fibonacci(n-1)[-2]]

print(fibonacci(10))
\`\`\`
`

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Filename & Language Test</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Direct CodeBlock with Filename</h2>
            <CodeBlock 
              code={`const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`}
              language="javascript"
              filename="server.js"
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Direct CodeBlock with Python filename</h2>
            <CodeBlock 
              code={`import pandas as pd
import numpy as np

def analyze_data(df):
    return {
        'mean': df.mean(),
        'std': df.std(),
        'shape': df.shape
    }

data = pd.DataFrame(np.random.randn(100, 4))
result = analyze_data(data)
print(result)`}
              language="python"
              filename="data_analysis.py"
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Direct language name (no filename)</h2>
            <CodeBlock 
              code={`SELECT u.username, p.title, p.created_at
FROM users u
JOIN posts p ON u.id = p.user_id
WHERE p.published = true
ORDER BY p.created_at DESC
LIMIT 10;`}
              language="sql"
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Markdown rendered code blocks</h2>
            <div className="bg-slate-800/50 p-6 rounded-lg">
              <AutoMD content={testMarkdown} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
