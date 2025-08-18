import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './CodeBlock';
import remarkGfm from 'remark-gfm';

export const AutoMD = ({content}: {content: string}) => {
	return (
		<div className="markdown-content prose prose-slate max-w-none">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					code: ({className, children, ...props}) => {
						const match = /language-(\w+)/.exec(className || '')
						const language = match ? match[1] : 'text'
						const isInline = !className
						
						if (isInline) {
							return (
								<code 
									className="bg-slate-800 px-2 py-1 rounded text-sm font-mono text-slate-200" 
									{...props}
								>
									{children}
								</code>
							)
						}
						
						return (
							<CodeBlock 
								code={String(children).replace(/\n$/, '')}
								language={language}
								showLineNumbers={true}
							/>
						)
					},
					pre: ({children}) => {
						// Skip pre wrapper for code blocks since CodeBlock handles its own container
						return <div className="not-prose my-4">{children}</div>
					}
				}}
			>
				{content || ''}
			</ReactMarkdown>
		</div>
	)
}