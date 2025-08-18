/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { ContentBlock, ContentBlockComponent, BlockType, BlockTypeButtons } from './ContentBlock'
import { blocksToMarkdown, markdownToBlocks, createEmptyBlock } from './blockUtils'

interface BlockEditorProps {
  initialContent?: string
  onChange?: (markdown: string) => void
  placeholder?: string
  autoSave?: boolean
  autoSaveInterval?: number
}

export const BlockEditor = ({ 
  initialContent = '', 
  onChange, 
  placeholder,
  autoSave = false,
  autoSaveInterval = 30000 // 30 seconds
}: BlockEditorProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastMarkdown, setLastMarkdown] = useState<string>('')

  // Initialize blocks from markdown content
  useEffect(() => {
    if (!isInitialized) {
      if (initialContent.trim()) {
        setBlocks(markdownToBlocks(initialContent))
        setLastMarkdown(initialContent)
      } else {
        // Start with empty paragraph if no content
        setBlocks([createEmptyBlock('paragraph')])
        setLastMarkdown('')
      }
      setIsInitialized(true)
    }
  }, [initialContent, isInitialized])

  // Update blocks when initialContent changes externally (e.g., loading draft)
  useEffect(() => {
    if (isInitialized && initialContent !== lastMarkdown) {
      if (initialContent.trim()) {
        setBlocks(markdownToBlocks(initialContent))
      } else {
        setBlocks([createEmptyBlock('paragraph')])
      }
      setLastMarkdown(initialContent)
    }
  }, [initialContent, isInitialized, lastMarkdown])

  // Convert blocks to markdown and call onChange only when content actually changes
  useEffect(() => {
    if (isInitialized && onChange) {
      const markdown = blocksToMarkdown(blocks)
      if (markdown !== lastMarkdown) {
        setLastMarkdown(markdown)
        onChange(markdown)
        setHasUnsavedChanges(true)
      }
    }
  }, [blocks, onChange, isInitialized, lastMarkdown])

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges) return

    const autoSaveTimer = setTimeout(() => {
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      // Here you could implement actual saving logic
      console.log('Auto-saved at', new Date().toLocaleTimeString())
    }, autoSaveInterval)

    return () => clearTimeout(autoSaveTimer)
  }, [autoSave, autoSaveInterval, hasUnsavedChanges])

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

  const addBlock = useCallback((type: BlockType, afterId?: string) => {
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
  }, [])

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S for save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        console.log('Manual save triggered')
      }
      
      // Ctrl/Cmd + Enter to add new paragraph
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        addBlock('paragraph')
      }
      
      // Ctrl/Cmd + Shift + H to add heading
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'H') {
        e.preventDefault()
        addBlock('heading')
      }
      
      // Ctrl/Cmd + Shift + I to add image
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        addBlock('image')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [addBlock])

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
      {/* Status Bar */}
      <div className="flex justify-between items-center text-xs text-slate-500 bg-slate-400/5 p-2 rounded">
        <div className="flex items-center space-x-4">
          <span>{blocks.length} block{blocks.length !== 1 ? 's' : ''}</span>
          <span>~{blocksToMarkdown(blocks).length} characters</span>
          {hasUnsavedChanges && <span className="text-yellow-500">● Unsaved changes</span>}
        </div>
        <div>
          {lastSaved && (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

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
              ${dragOverIndex === index ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
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
      
      {/* Keyboard shortcuts help */}
      <div className="text-xs text-slate-500 bg-slate-400/5 p-3 rounded-lg">
        <p className="font-medium mb-2">💡 Tips & Shortcuts:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p>• Drag blocks to reorder them</p>
            <p>• Use ↑↓ buttons to move blocks</p>
            <p>• Upload images by clicking upload area</p>
          </div>
          <div>
            <p>• <kbd className="bg-slate-300/10 px-1 rounded">Ctrl+S</kbd> to save</p>
            <p>• <kbd className="bg-slate-300/10 px-1 rounded">Ctrl+Enter</kbd> add paragraph</p>
            <p>• <kbd className="bg-slate-300/10 px-1 rounded">Ctrl+Shift+H</kbd> add heading</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlockEditor
