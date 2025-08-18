// Local storage utilities for blog drafts
export interface BlogDraft {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  tags: string[]
  category?: string
  thumbnail?: string
  lastSaved: Date
  autoSaved: boolean
}

const DRAFT_STORAGE_KEY = 'blog_drafts'
const CURRENT_DRAFT_KEY = 'current_blog_draft'
const CURRENT_EDIT_DRAFT_KEY = 'current_edit_draft'

export const saveDraft = (draft: Partial<BlogDraft>, isEdit = false): string => {
  try {
    const drafts = getDrafts()
    const draftId = draft.id || `draft_${Date.now()}`
    
    const newDraft: BlogDraft = {
      id: draftId,
      title: draft.title || '',
      content: draft.content || '',
      authorId: draft.authorId || '1',
      authorName: draft.authorName || 'SalamPS',
      tags: draft.tags || [],
      category: draft.category || '',
      thumbnail: draft.thumbnail || '',
      lastSaved: new Date(),
      autoSaved: draft.autoSaved || false
    }

    const existingIndex = drafts.findIndex(d => d.id === draftId)
    if (existingIndex !== -1) {
      drafts[existingIndex] = newDraft
    } else {
      drafts.push(newDraft)
    }

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts))
    localStorage.setItem(isEdit ? CURRENT_EDIT_DRAFT_KEY : CURRENT_DRAFT_KEY, draftId)
    
    return draftId
  } catch (error) {
    console.error('Failed to save draft:', error)
    return ''
  }
}

export const getDrafts = (): BlogDraft[] => {
  try {
    const draftsJson = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!draftsJson) return []
    
    const drafts = JSON.parse(draftsJson) as BlogDraft[]
    // Convert date strings back to Date objects
    return drafts.map(draft => ({
      ...draft,
      lastSaved: new Date(draft.lastSaved)
    }))
  } catch (error) {
    console.error('Failed to load drafts:', error)
    return []
  }
}

export const getDraft = (id: string): BlogDraft | null => {
  try {
    const drafts = getDrafts()
    return drafts.find(draft => draft.id === id) || null
  } catch (error) {
    console.error('Failed to load draft:', error)
    return null
  }
}

export const getCurrentDraft = (isEdit = false): BlogDraft | null => {
  try {
    const currentDraftKey = isEdit ? CURRENT_EDIT_DRAFT_KEY : CURRENT_DRAFT_KEY
    const currentDraftId = localStorage.getItem(currentDraftKey)
    if (!currentDraftId) return null
    
    return getDraft(currentDraftId)
  } catch (error) {
    console.error('Failed to load current draft:', error)
    return null
  }
}

export const deleteDraft = (id: string): boolean => {
  try {
    const drafts = getDrafts()
    const filteredDrafts = drafts.filter(draft => draft.id !== id)
    
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(filteredDrafts))
    
    // If this was the current draft, clear current draft
    const currentDraftId = localStorage.getItem(CURRENT_DRAFT_KEY)
    const currentEditDraftId = localStorage.getItem(CURRENT_EDIT_DRAFT_KEY)
    
    if (currentDraftId === id) {
      localStorage.removeItem(CURRENT_DRAFT_KEY)
    }
    if (currentEditDraftId === id) {
      localStorage.removeItem(CURRENT_EDIT_DRAFT_KEY)
    }
    
    return true
  } catch (error) {
    console.error('Failed to delete draft:', error)
    return false
  }
}

export const clearAllDrafts = (): boolean => {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
    localStorage.removeItem(CURRENT_DRAFT_KEY)
    localStorage.removeItem(CURRENT_EDIT_DRAFT_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear drafts:', error)
    return false
  }
}

export const autoSaveDraft = (draft: Partial<BlogDraft>, isEdit = false): string => {
  return saveDraft({ ...draft, autoSaved: true }, isEdit)
}

export const manualSaveDraft = (draft: Partial<BlogDraft>, isEdit = false): string => {
  return saveDraft({ ...draft, autoSaved: false }, isEdit)
}
