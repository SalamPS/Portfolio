/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { BlogDraft, getDrafts, deleteDraft, getCurrentDraft } from './draftUtils'
import { IconTrash, IconClock, IconFileText, IconX } from '@tabler/icons-react'
import { blogStructure_ } from '@/components/interface/blogStructure'

interface DraftManagerProps {
  isOpen: boolean
  onClose: () => void
  onLoadDraft: (draft: BlogDraft) => void
  currentBlog: Partial<blogStructure_>
  isEdit?: boolean // Tambahan prop untuk menentukan apakah ini untuk edit atau create
}

export const DraftManager = ({ isOpen, onClose, onLoadDraft, currentBlog, isEdit = false }: DraftManagerProps) => {
  const [drafts, setDrafts] = useState<BlogDraft[]>([])
  const [currentDraft, setCurrentDraft] = useState<BlogDraft | null>(null)

  const loadDrafts = useCallback(() => {
    const allDrafts = getDrafts()
    const current = getCurrentDraft(isEdit)
    
    // Filter drafts berdasarkan tipe
    const filteredDrafts = allDrafts.filter(draft => {
      if (isEdit) {
        // Untuk edit, hanya tampilkan draft yang ID-nya mengandung "edit-"
        return draft.id.startsWith('edit-')
      } else {
        // Untuk create, hanya tampilkan draft yang ID-nya TIDAK mengandung "edit-"
        return !draft.id.startsWith('edit-')
      }
    })
    
    setDrafts(filteredDrafts.sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()))
    setCurrentDraft(current)
  }, [isEdit])

  useEffect(() => {
    if (isOpen) {
      loadDrafts()
    }
  }, [isOpen, loadDrafts])

  const handleDeleteDraft = (id: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      if (deleteDraft(id)) {
        loadDrafts()
      }
    }
  }

  const handleLoadDraft = (draft: BlogDraft) => {
    onLoadDraft(draft)
    onClose()
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }
  }

  const hasUnsavedChanges = () => {
    if (!currentBlog.title && !currentBlog.content) return false
    return currentBlog.title?.trim() !== '' || currentBlog.content?.trim() !== ''
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Draft Manager</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <IconX size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {hasUnsavedChanges() && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <IconClock size={16} className="text-yellow-500" />
                <span className="text-yellow-200">You have unsaved changes</span>
              </div>
              <p className="text-sm text-yellow-300 mt-1">
                Your current work will be lost if you load another draft. Save your work first.
              </p>
            </div>
          )}
          
          {drafts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <IconFileText size={48} className="mx-auto mb-4 text-slate-600" />
              <p>No drafts saved yet</p>
              <p className="text-sm mt-1">Start writing to automatically create drafts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-white font-medium truncate">
                          {draft.title || 'Untitled Draft'}
                        </h3>
                        {currentDraft?.id === draft.id && (
                          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                            Current
                          </span>
                        )}
                        {draft.autoSaved && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Auto-saved
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-slate-400 mb-2">
                        <span className="flex items-center space-x-1">
                          <IconClock size={14} />
                          <span>{formatDate(draft.lastSaved)}</span>
                        </span>
                        <span>{draft.content.length} characters</span>
                        {draft.tags.length > 0 && (
                          <span>{draft.tags.length} tag{draft.tags.length !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                      
                      {draft.content && (
                        <p className="text-slate-300 text-sm line-clamp-2">
                          {draft.content.slice(0, 100)}...
                        </p>
                      )}
                      
                      {draft.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {draft.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {draft.tags.length > 3 && (
                            <span className="text-slate-400 text-xs">
                              +{draft.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        type="button"
                        onClick={() => handleLoadDraft(draft)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-500/10 transition-colors"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t border-slate-700 p-4">
          <div className="flex justify-between items-center text-sm text-slate-400">
            <span>
              {drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved
            </span>
            <span>
              Drafts are saved automatically as you type
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DraftManager
