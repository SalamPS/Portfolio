import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './CodeBlock';
import remarkGfm from 'remark-gfm';

interface AutoMDProps {
	content: string;
	inline?: boolean;
	className?: string;
}

export const AutoMD = ({content, inline = false, className = ""}: AutoMDProps) => {
	const Component = inline ? 'span' : 'div';
	const wrapperClass = inline 
		? `inline-markdown ${className}` 
		: `markdown-content prose prose-slate max-w-none ${className}`;

	return (
		<Component className={wrapperClass}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					// For inline usage, prevent block elements
					p: inline ? ({children}) => <span>{children}</span> : undefined,
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
						
						// For inline usage, don't render code blocks
						if (inline) {
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
					pre: inline ? ({children}) => <span>{children}</span> : ({children}) => {
						// Skip pre wrapper for code blocks since CodeBlock handles its own container
						return <div className="not-prose my-4">{children}</div>
					},
					// For inline usage, prevent other block elements
					blockquote: inline ? ({children}) => <span>{children}</span> : undefined,
					h1: inline ? ({children}) => <span className="font-bold">{children}</span> : undefined,
					h2: inline ? ({children}) => <span className="font-bold">{children}</span> : undefined,
					h3: inline ? ({children}) => <span className="font-bold">{children}</span> : undefined,
					h4: inline ? ({children}) => <span className="font-bold">{children}</span> : undefined,
					h5: inline ? ({children}) => <span className="font-bold">{children}</span> : undefined,
					h6: inline ? ({children}) => <span className="font-bold">{children}</span> : undefined,
					ul: inline ? ({children}) => <span>{children}</span> : undefined,
					ol: inline ? ({children}) => <span>{children}</span> : undefined,
					li: inline ? ({children}) => <span>{children}</span> : undefined,
				}}
			>
				{content || ''}
			</ReactMarkdown>
		</Component>
	)
}