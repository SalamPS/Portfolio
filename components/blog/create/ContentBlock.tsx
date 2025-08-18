/* eslint-disable @next/next/no-img-element */
'use client'

import { useRef } from 'react'
import { 
  IconGripVertical, 
  IconTrash, 
  IconPhoto, 
  IconCode, 
  IconQuote, 
  IconList,
  IconListNumbers,
  IconVideo,
  IconSeparator,
  IconUpload,
  IconX
} from '@tabler/icons-react'

export type BlockType = 
  | 'paragraph' 
  | 'heading' 
  | 'image' 
  | 'code' 
  | 'quote' 
  | 'list'
  | 'numbered-list'
  | 'video'
  | 'separator'

export interface ContentBlock {
  id: string
  type: BlockType
  content: string
  metadata?: {
    level?: number // for headings (1-6)
    language?: string // for code blocks
    alt?: string // for images
    caption?: string // for images/videos
    url?: string // for videos
    items?: string[] // for lists
    author?: string // for quotes
  }
}

interface ContentBlockProps {
  block: ContentBlock
  onUpdate: (id: string, updates: Partial<ContentBlock>) => void
  onDelete: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  canMoveUp: boolean
  canMoveDown: boolean
}

export const ContentBlockComponent = ({ 
  block, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  canMoveUp,
  canMoveDown 
}: ContentBlockProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleContentChange = (content: string, metadata?: Partial<ContentBlock['metadata']>) => {
    onUpdate(block.id, { content, metadata: { ...block.metadata, ...metadata } })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        const dataUrl = reader.result as string
        handleContentChange(dataUrl)
      }
    }
  }

  const renderBlockContent = () => {
    switch (block.type) {
      case 'paragraph':
        return (
          <textarea
            className="w-full p-3 border rounded-lg resize-none bg-slate-800/40 border-slate-400/30 min-h-[100px] focus:ring-1 focus:outline-none"
            placeholder="Write your paragraph here..."
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
          />
        )

      case 'heading':
        return (
          <div className="space-y-2">
            <select 
              className="p-2 border rounded bg-slate-800 text-white border-slate-400/30"
              value={block.metadata?.level || 1}
              onChange={(e) => handleContentChange(block.content, { level: parseInt(e.target.value) })}
            >
              <option value={1}>H1 - Main Title</option>
              <option value={2}>H2 - Section</option>
              <option value={3}>H3 - Subsection</option>
              <option value={4}>H4 - Sub-subsection</option>
              <option value={5}>H5 - Minor Heading</option>
              <option value={6}>H6 - Small Heading</option>
            </select>
            <input
              className="w-full p-3 border rounded-lg bg-transparent border-slate-400/30 focus:ring-1 focus:outline-none"
              placeholder="Heading text..."
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
            />
          </div>
        )

      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            
            {block.content ? (
              <div className="relative">
                <img 
                  src={block.content} 
                  alt={block.metadata?.alt || 'Uploaded image'} 
                  className="w-full max-h-96 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <IconPhoto size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-slate-400/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-400/50"
              >
                <IconUpload size={32} className="mb-2 text-slate-400" />
                <span className="text-slate-400">Click to upload image</span>
              </div>
            )}
            
            <input
              className="w-full p-2 border rounded bg-transparent border-slate-400/30 text-sm"
              placeholder="Image alt text (optional)"
              value={block.metadata?.alt || ''}
              onChange={(e) => handleContentChange(block.content, { alt: e.target.value })}
            />
            
            <input
              className="w-full p-2 border rounded bg-transparent border-slate-400/30 text-sm"
              placeholder="Image caption (optional)"
              value={block.metadata?.caption || ''}
              onChange={(e) => handleContentChange(block.content, { caption: e.target.value })}
            />
          </div>
        )

      case 'code':
        return (
          <div className="space-y-2">
            <input
              className="w-full p-2 border rounded bg-slate-800 text-white border-slate-400/30"
              placeholder="Programming language (e.g., javascript, python, typescript)"
              value={block.metadata?.language || ''}
              onChange={(e) => handleContentChange(block.content, { language: e.target.value })}
            />
            <textarea
              className="w-full p-3 border rounded-lg resize-none bg-slate-900 text-green-400 font-mono border-slate-400/30 min-h-[150px]"
              placeholder="Enter your code here..."
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
            />
          </div>
        )

      case 'quote':
        return (
          <div className="space-y-2">
            <textarea
              className="w-full p-3 border-l-4 border-blue-500 bg-blue-50/5 rounded-r-lg resize-none border-slate-400/30 min-h-[100px]"
              placeholder="Enter quote here..."
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded bg-transparent border-slate-400/30 text-sm"
              placeholder="Quote author (optional)"
              value={block.metadata?.author || ''}
              onChange={(e) => handleContentChange(block.content, { author: e.target.value })}
            />
          </div>
        )

      case 'list':
      case 'numbered-list':
        return (
          <div className="space-y-2">
            <div className="space-y-1">
              {(block.metadata?.items || ['']).map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-slate-400 w-4">
                    {block.type === 'numbered-list' ? `${index + 1}.` : '•'}
                  </span>
                  <input
                    className="flex-1 p-2 border rounded bg-transparent border-slate-400/30"
                    placeholder="List item..."
                    value={item}
                    onChange={(e) => {
                      const items = [...(block.metadata?.items || [''])]
                      items[index] = e.target.value
                      handleContentChange(block.content, { items })
                    }}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const items = [...(block.metadata?.items || [''])]
                        items.splice(index, 1)
                        handleContentChange(block.content, { items })
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <IconX size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const items = [...(block.metadata?.items || ['']), '']
                handleContentChange(block.content, { items })
              }}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              + Add item
            </button>
          </div>
        )

      case 'video':
        return (
          <div className="space-y-2">
            <input
              className="w-full p-3 border rounded-lg bg-transparent border-slate-400/30"
              placeholder="Video URL (YouTube, Vimeo, etc.)"
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded bg-transparent border-slate-400/30 text-sm"
              placeholder="Video caption (optional)"
              value={block.metadata?.caption || ''}
              onChange={(e) => handleContentChange(block.content, { caption: e.target.value })}
            />
          </div>
        )

      case 'separator':
        return (
          <div className="py-4">
            <div className="w-full h-px bg-slate-400/30"></div>
            <div className="text-center text-sm text-slate-400 mt-2">
              Separator
            </div>
          </div>
        )

      default:
        return <div>Unknown block type</div>
    }
  }

  return (
    <div className="group border border-slate-400/20 rounded-lg p-4 hover:border-slate-400/40 transition-colors bg-slate-800/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <IconGripVertical size={16} className="text-slate-400 cursor-move" />
          <span className="text-sm font-medium text-slate-300 capitalize">
            {block.type.replace('-', ' ')}
          </span>
          {block.type === 'heading' && block.metadata?.level && (
            <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">
              H{block.metadata.level}
            </span>
          )}
          {block.type === 'code' && block.metadata?.language && (
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
              {block.metadata.language}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onMoveUp(block.id)}
            disabled={!canMoveUp}
            className="p-1 hover:bg-slate-600/20 rounded disabled:opacity-30 text-slate-400 hover:text-slate-200"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(block.id)}
            disabled={!canMoveDown}
            className="p-1 hover:bg-slate-600/20 rounded disabled:opacity-30 text-slate-400 hover:text-slate-200"
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => onDelete(block.id)}
            className="p-1 hover:bg-red-600/20 rounded text-red-400 hover:text-red-300"
            title="Delete block"
          >
            <IconTrash size={14} />
          </button>
        </div>
      </div>

      {renderBlockContent()}
    </div>
  )
}

export const BlockTypeButtons = ({ onAddBlock }: { onAddBlock: (type: BlockType) => void }) => {
  const blockTypes = [
    { type: 'paragraph' as BlockType, icon: IconGripVertical, label: 'Paragraph' },
    { type: 'heading' as BlockType, icon: IconGripVertical, label: 'Heading' },
    { type: 'image' as BlockType, icon: IconPhoto, label: 'Image' },
    { type: 'code' as BlockType, icon: IconCode, label: 'Code' },
    { type: 'quote' as BlockType, icon: IconQuote, label: 'Quote' },
    { type: 'list' as BlockType, icon: IconList, label: 'List' },
    { type: 'numbered-list' as BlockType, icon: IconListNumbers, label: 'Numbered List' },
    { type: 'video' as BlockType, icon: IconVideo, label: 'Video' },
    { type: 'separator' as BlockType, icon: IconSeparator, label: 'Separator' },
  ]

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-slate-400/10 rounded-lg">
      {blockTypes.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          type="button"
          onClick={() => onAddBlock(type)}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-600/20 hover:bg-slate-600/30 rounded-md transition-colors text-sm"
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
