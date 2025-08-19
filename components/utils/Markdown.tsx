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
					p: inline ? ({children}) => <span>{children}</span> : ({children}) => <p>{children}</p>,
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
					blockquote: inline ? ({children}) => <span className="italic">{children}</span> : ({children}) => <blockquote className="border-l-4 border-slate-400 pl-4 italic my-4">{children}</blockquote>,
					h1: inline ? ({children}) => <span className="font-bold">{children}</span> : ({children}) => <h1 className="text-3xl font-bold my-4">{children}</h1>,
					h2: inline ? ({children}) => <span className="font-bold">{children}</span> : ({children}) => <h2 className="text-2xl font-bold my-3">{children}</h2>,
					h3: inline ? ({children}) => <span className="font-bold">{children}</span> : ({children}) => <h3 className="text-xl font-bold my-3">{children}</h3>,
					h4: inline ? ({children}) => <span className="font-bold">{children}</span> : ({children}) => <h4 className="text-lg font-bold my-2">{children}</h4>,
					h5: inline ? ({children}) => <span className="font-bold">{children}</span> : ({children}) => <h5 className="text-base font-bold my-2">{children}</h5>,
					h6: inline ? ({children}) => <span className="font-bold">{children}</span> : ({children}) => <h6 className="text-sm font-bold my-2">{children}</h6>,
					ul: inline ? ({children}) => <span>{children}</span> : ({children}) => <ul className="list-disc list-inside my-4 space-y-1">{children}</ul>,
					ol: inline ? ({children}) => <span>{children}</span> : ({children}) => <ol className="list-decimal list-inside my-4 space-y-1">{children}</ol>,
					li: inline ? ({children}) => <span>{children}</span> : ({children}) => <li>{children}</li>,
				}}
			>
				{content || ''}
			</ReactMarkdown>
		</Component>
	)
}