/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { ContentBlock, ContentBlockComponent, BlockType, BlockTypeButtons } from './ContentBlock'
import { blocksToMarkdown, markdownToBlocks, createEmptyBlock } from './blockUtils'

interface BlockEditorProps {
  initialContent?: string
  onChange?: (markdown: string) => void
  placeholder?: string
}

export const BlockEditor = ({ initialContent = '', onChange, placeholder }: BlockEditorProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Initialize blocks from markdown content
  useEffect(() => {
    if (!isInitialized) {
      if (initialContent.trim()) {
        setBlocks(markdownToBlocks(initialContent))
      } else {
        // Start with empty paragraph if no content
        setBlocks([createEmptyBlock('paragraph')])
      }
      setIsInitialized(true)
    }
  }, [initialContent, isInitialized])

  // Convert blocks to markdown and call onChange
  useEffect(() => {
    if (isInitialized && onChange) {
      const markdown = blocksToMarkdown(blocks)
      onChange(markdown)
    }
  }, [blocks, onChange, isInitialized])

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    )
  }

  const deleteBlock = (id: string) => {
    setBlocks(prevBlocks => {
      const filtered = prevBlocks.filter(block => block.id !== id)
      // Keep at least one block
      return filtered.length === 0 ? [createEmptyBlock('paragraph')] : filtered
    })
  }

  const addBlock = (type: BlockType, afterId?: string) => {
    const newBlock = createEmptyBlock(type)
    
    setBlocks(prevBlocks => {
      if (!afterId) {
        return [...prevBlocks, newBlock]
      }
      
      const insertIndex = prevBlocks.findIndex(block => block.id === afterId)
      if (insertIndex === -1) {
        return [...prevBlocks, newBlock]
      }
      
      const newBlocks = [...prevBlocks]
      newBlocks.splice(insertIndex + 1, 0, newBlock)
      return newBlocks
    })
  }

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    setBlocks(prevBlocks => {
      const currentIndex = prevBlocks.findIndex(block => block.id === id)
      if (currentIndex === -1) return prevBlocks
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= prevBlocks.length) return prevBlocks
      
      const newBlocks = [...prevBlocks]
      const [movedBlock] = newBlocks.splice(currentIndex, 1)
      newBlocks.splice(newIndex, 0, movedBlock)
      
      return newBlocks
    })
  }

  const moveBlockUp = (id: string) => moveBlock(id, 'up')
  const moveBlockDown = (id: string) => moveBlock(id, 'down')

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlock(blockId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    
    if (!draggedBlock) return
    
    setBlocks(prevBlocks => {
      const draggedIndex = prevBlocks.findIndex(block => block.id === draggedBlock)
      if (draggedIndex === -1) return prevBlocks
      
      const newBlocks = [...prevBlocks]
      const [movedBlock] = newBlocks.splice(draggedIndex, 1)
      
      // Adjust target index if we're moving down
      const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex
      newBlocks.splice(adjustedTargetIndex, 0, movedBlock)
      
      return newBlocks
    })
    
    setDraggedBlock(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedBlock(null)
    setDragOverIndex(null)
  }

  if (!isInitialized) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-slate-400/20 h-24 rounded-lg"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => handleDragStart(e, block.id)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`
              transition-all duration-200
              ${draggedBlock === block.id ? 'opacity-50 scale-98' : 'opacity-100 scale-100'}
              ${dragOverIndex === index ? 'border-blue-500 border-2' : ''}
            `}
          >
            <ContentBlockComponent
              block={block}
              onUpdate={updateBlock}
              onDelete={deleteBlock}
              onMoveUp={moveBlockUp}
              onMoveDown={moveBlockDown}
              canMoveUp={index > 0}
              canMoveDown={index < blocks.length - 1}
            />
          </div>
        ))}
      </div>
      
      <div className="border-t border-slate-400/20 pt-4">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Add New Block</h3>
        <BlockTypeButtons onAddBlock={(type) => addBlock(type)} />
      </div>
      
      {blocks.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>{placeholder || 'Start writing your content...'}</p>
          <p className="text-sm mt-2">Click on the buttons above to add content blocks.</p>
        </div>
      )}
      
      {/* Helpful tips */}
      <div className="text-xs text-slate-500 bg-slate-400/5 p-3 rounded-lg">
        <p className="font-medium mb-1">💡 Tips:</p>
        <ul className="space-y-1">
          <li>• Drag blocks to reorder them</li>
          <li>• Use ↑↓ buttons to move blocks up/down</li>
          <li>• Upload images by clicking the image upload area</li>
          <li>• Support for YouTube and Vimeo video embeds</li>
        </ul>
      </div>
    </div>
  )
}

export default BlockEditor
