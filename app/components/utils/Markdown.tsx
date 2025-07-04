import ReactMarkdown from 'react-markdown';

export const AutoMD = ({content}: {content: string}) => {
	return (
		<div className="markdown-content">
			<ReactMarkdown>
				{content || ''}
			</ReactMarkdown>
		</div>
	)
}