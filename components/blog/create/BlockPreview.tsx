/* eslint-disable @next/next/no-img-element */
'use client'

import { ContentBlock } from './ContentBlock'
import { AutoMD } from '@/components/utils/Markdown'

interface BlockPreviewProps {
  blocks: ContentBlock[]
}

export const BlockPreview = ({ blocks }: BlockPreviewProps) => {
  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <div key={block.id} className="mb-4">
            <AutoMD content={block.content} />
          </div>
        )

      case 'heading':
        const level = block.metadata?.level || 1
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
        const headingClasses = {
          1: 'text-4xl font-bold mb-4',
          2: 'text-3xl font-bold mb-3',
          3: 'text-2xl font-semibold mb-3',
          4: 'text-xl font-semibold mb-2',
          5: 'text-lg font-medium mb-2',
          6: 'text-base font-medium mb-2'
        }
        
        return (
          <HeadingTag key={block.id} className={headingClasses[level as keyof typeof headingClasses] || headingClasses[1]}>
            {block.content}
          </HeadingTag>
        )

      case 'image':
        if (!block.content) return null
        
        return (
          <div key={block.id} className="mb-6">
            <img 
              src={block.content} 
              alt={block.metadata?.alt || 'Image'} 
              className="w-full max-w-full h-auto rounded-lg shadow-md"
            />
            {block.metadata?.caption && (
              <p className="text-center text-sm text-slate-500 mt-2 italic">
                {block.metadata.caption}
              </p>
            )}
          </div>
        )

      case 'code':
        return (
          <div key={block.id} className="mb-4">
            <pre className="bg-slate-800 text-green-400 p-4 rounded-lg overflow-x-auto">
              <code className={block.metadata?.language ? `language-${block.metadata.language}` : ''}>
                {block.content}
              </code>
            </pre>
            {block.metadata?.language && (
              <div className="text-xs text-slate-500 mt-1">
                Language: {block.metadata.language}
              </div>
            )}
          </div>
        )

      case 'quote':
        return (
          <blockquote key={block.id} className="border-l-4 border-blue-500 bg-blue-50/5 pl-4 py-2 mb-4 italic">
            <div className="whitespace-pre-line">
              {block.content}
            </div>
            {block.metadata?.author && (
              <footer className="text-sm text-slate-400 mt-2 not-italic">
                — {block.metadata.author}
              </footer>
            )}
          </blockquote>
        )

      case 'list':
        if (!block.metadata?.items || block.metadata.items.length === 0) return null
        
        return (
          <ul key={block.id} className="list-disc list-inside mb-4 space-y-1">
            {block.metadata.items
              .filter(item => item.trim() !== '')
              .map((item, index) => (
                <li key={index} className="text-slate-200">
                  {item}
                </li>
              ))}
          </ul>
        )

      case 'numbered-list':
        if (!block.metadata?.items || block.metadata.items.length === 0) return null
        
        return (
          <ol key={block.id} className="list-decimal list-inside mb-4 space-y-1">
            {block.metadata.items
              .filter(item => item.trim() !== '')
              .map((item, index) => (
                <li key={index} className="text-slate-200">
                  {item}
                </li>
              ))}
          </ol>
        )

      case 'video':
        if (!block.content) return null
        
        // Simple video embed detection
        const isYouTube = block.content.includes('youtube.com') || block.content.includes('youtu.be')
        const isVimeo = block.content.includes('vimeo.com')
        
        let embedUrl = block.content
        
        if (isYouTube) {
          const videoId = block.content.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
          if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId[1]}`
          }
        } else if (isVimeo) {
          const videoId = block.content.match(/vimeo\.com\/(\d+)/)
          if (videoId) {
            embedUrl = `https://player.vimeo.com/video/${videoId[1]}`
          }
        }
        
        return (
          <div key={block.id} className="mb-6">
            {(isYouTube || isVimeo) ? (
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={embedUrl}
                  frameBorder="0"
                  allowFullScreen
                  title="Video"
                />
              </div>
            ) : (
              <div className="bg-slate-700 p-4 rounded-lg text-center">
                <a 
                  href={block.content} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Watch Video
                </a>
              </div>
            )}
            {block.metadata?.caption && (
              <p className="text-center text-sm text-slate-500 mt-2 italic">
                {block.metadata.caption}
              </p>
            )}
          </div>
        )

      case 'separator':
        return (
          <hr key={block.id} className="border-slate-400/30 my-8" />
        )

      default:
        return null
    }
  }

  return (
    <div className="prose prose-slate max-w-none">
      {blocks.map(renderBlock)}
    </div>
  )
}

export default BlockPreview
