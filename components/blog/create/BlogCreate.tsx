/* eslint-disable @next/next/no-img-element */
'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/global/Input"
import { blogDummy, blogStructure_ } from '@/components/interface/blogStructure'
import { IconUpload, IconX, IconDeviceFloppy, IconFileText } from '@tabler/icons-react'
import { NotificationModal } from '@/components/global/Modal'
import client from '@/lib/auth'
import BlockEditor from './AdvancedBlockEditor'
import { markdownToBlocks } from './blockUtils'
import BlockPreview from './BlockPreview'
import DraftManager from './DraftManager'
import { saveDraft, autoSaveDraft, getCurrentDraft, BlogDraft } from './draftUtils'
import { progressiveCompress, isImageFile, formatFileSize } from '@/lib/imageUtils'

const BlogCreate = () => {
	const [preview, setPreview] = useState(false)	
	const [blog, setBlog] = useState<Partial<blogStructure_>>({
		title: '',
		content: '',
		authorId: '1',
		authorName: 'SalamPS',
		tags: [],
		thumbnail: '',
	})
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [isDraftManagerOpen, setIsDraftManagerOpen] = useState(false)
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null)
  const [notification, setNotification] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  })

  // Load current draft on component mount
  useEffect(() => {
    const currentDraft = getCurrentDraft(false) // isEdit = false untuk create
    if (currentDraft) {
      setBlog({
        title: currentDraft.title,
        content: currentDraft.content,
        authorId: currentDraft.authorId,
        authorName: currentDraft.authorName,
        tags: currentDraft.tags,
        thumbnail: currentDraft.thumbnail,
      })
      setCurrentDraftId(currentDraft.id)
    }
  }, [])

  // Auto-save draft when blog content changes
  useEffect(() => {
    if (blog.title || blog.content) {
      const timer = setTimeout(() => {
        const draftId = autoSaveDraft({
          id: currentDraftId || undefined,
          title: blog.title || '',
          content: blog.content || '',
          authorId: blog.authorId || '1',
          authorName: blog.authorName || 'SalamPS',
          tags: blog.tags || [],
          thumbnail: blog.thumbnail || '',
        }, false) // isEdit = false untuk create
        
        if (!currentDraftId) {
          setCurrentDraftId(draftId)
        }
        setLastAutoSave(new Date())
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer)
    }
  }, [blog.title, blog.content, blog.tags, blog.thumbnail, blog.authorId, blog.authorName, currentDraftId])

  const handleContentChange = useCallback((markdown: string) => {
    setBlog(prev => ({ ...prev, content: markdown }))
  }, [])

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    })
  }

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }))
  }

  const handleManualSave = () => {
    const draftId = saveDraft({
      id: currentDraftId || undefined,
      title: blog.title || '',
      content: blog.content || '',
      authorId: blog.authorId || '1',
      authorName: blog.authorName || 'SalamPS',
      tags: blog.tags || [],
      thumbnail: blog.thumbnail || '',
    }, false) // isEdit = false untuk create
    
    if (!currentDraftId) {
      setCurrentDraftId(draftId)
    }
    
    showNotification('success', 'Draft Saved', 'Your draft has been saved successfully!')
  }

  const handleLoadDraft = (draft: BlogDraft) => {
    setBlog({
      title: draft.title,
      content: draft.content,
      authorId: draft.authorId,
      authorName: draft.authorName,
      tags: draft.tags,
      thumbnail: draft.thumbnail,
    })
    setCurrentDraftId(draft.id)
    showNotification('info', 'Draft Loaded', `Draft "${draft.title || 'Untitled'}" has been loaded`)
  }

	const insertionEdit = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		const elementName = e.currentTarget.name;
		const value = e.currentTarget.value;
		setBlog((prev) => ({
			...prev,
			[elementName]: value,
		}));
	}

	const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
			e.preventDefault();
			const newTag = e.currentTarget.value.trim();
			setBlog((prev) => ({
				...prev,
				tags: [...(prev.tags || []), newTag],
			}));
			e.currentTarget.value = '';
		}
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!blog.title) {
			showNotification('error', 'Validation Error', 'Title is required');
			return;
		}
		if (!blog.content) {
			showNotification('error', 'Validation Error', 'Content is required');
			return;
		}
		if (!blog.authorName) {
			showNotification('error', 'Validation Error', 'Author name is required');
			return;
		}
		if (!blog.tags || blog.tags.length === 0) {
			showNotification('error', 'Validation Error', 'At least one tag is required');
			return;
		}
		if (!blog.thumbnail) {
			showNotification('error', 'Validation Error', 'Thumbnail is required');
			return;
		}
    if (!thumbnailFile) {
      showNotification('error', 'Validation Error', 'Thumbnail file is required');
      return;
    }
		
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('content', blog.content);
    formData.append('authorId', blog.authorId || '1');
    formData.append('authorName', blog.authorName);
		formData.append('category', blog.category || 'General');
    formData.append('tags', JSON.stringify(blog.tags));
    formData.append('thumbnail', thumbnailFile);

    client.post('blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        if (response.data.success) {
          showNotification('success', 'Success', 'Blog created successfully!');
          setBlog({
            title: '',
            content: '',
            authorId: '1',
            authorName: 'SalamPS',
            tags: [],
            thumbnail: '',
          });
          setThumbnailFile(null);
        } else {
          showNotification('error', 'Create Failed', response.data.message || 'Failed to create blog');
        }
      })
      .catch((error) => {
        console.error('Error creating blog:', error);
        showNotification('error', 'Error', 'An error occurred while creating the blog. Please try again later.');
      });
	}

  return (<>
		<NotificationModal
			isOpen={notification.isOpen}
			onClose={closeNotification}
			type={notification.type}
			title={notification.title}
			message={notification.message}
		/>
		<DraftManager
			isOpen={isDraftManagerOpen}
			onClose={() => setIsDraftManagerOpen(false)}
			onLoadDraft={handleLoadDraft}
			currentBlog={blog}
		/>
		<div className="flex flex-col xl:flex-row px-8 pt-24 xl:py-36 xl:px-28 gap-4 xl:gap-8">
      <form className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full" onSubmit={handleSubmit}>
				<main className='xl:col-span-2 order-2 xl:order-1'>
					{!preview ? <>
						<section id='title' className='mb-4'>
							<label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="title">Title</label>
							<Input type="text" id="title" name="title" className="w-full" value={blog['title']} onChange={insertionEdit} required />
						</section>
						<section id='md-editor' className='group'>
							<label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="content">Content</label>
							<BlockEditor
								initialContent={blog.content || ''}
								onChange={handleContentChange}
								placeholder="Start writing your blog content..."
								autoSave={true}
								autoSaveInterval={10000}
							/>
						</section>
					</> : <>
						<section id='md-preview' className='h-[70vh] overflow-y-scroll'>
							<h1 className="text-4xl font-bold mb-2">{blog.title || blogDummy.title}</h1>
							<p>
								Posted by {blog.authorName} at {new Date(blog.createdAt || '').toLocaleDateString()}
								<span className='hidden xl:inline text-slate-500'>{' (Preview)'}</span>
							</p>
							<div>
								{blog.tags && 
								blog.tags.length > 0 ? (
									<div className="flex flex-wrap gap-2 mt-2">
										{blog.tags.map((tag, index) => (
											<span key={index} className="bg-[#0f6252] text-white px-3 py-1 rounded-md text-sm">
												{tag}
											</span>
										))}
									</div>
								) : (
									<div className="flex flex-wrap gap-2 mt-2">
										{blogDummy.tags.map((tag, index) => (
											<span key={index} className="bg-[#0f6252] text-white px-3 py-1 rounded-md text-sm">
												{tag}
											</span>
										))}
									</div>
								)
							}
							</div>
							<div className='my-6 xl:my-8 flex flex-col gap-2'>
								<BlockPreview blocks={markdownToBlocks(blog.content || blogDummy.content)} />
							</div>
							
							<div className="mt-4">
								<h2 className="text-xl font-semibold">Comments</h2>
								<p className="text-sm text-gray-500">No comments yet.</p>
							</div>
						</section>
					</>}
				</main>
				<div className='flex flex-col gap-4 order-1 xl:order-2'>
					<div>
						<span className="block text-slate-400 text-end text-sm font-bold mb-2">Blog Utilities</span>
						<div className="space-y-2">
							<button className={`w-full px-4 py-3 rounded-xl text-white font-bold focus:outline-none focus:shadow-outline duration-200 ${preview ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-slate-500/20 hover:bg-slate-500/30'}`}
								onClick={(e) => {e.preventDefault(); setPreview(!preview);}}>
								Toggle Preview
							</button>
							<button 
								type="button"
								onClick={handleManualSave}
								className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold focus:outline-none focus:shadow-outline duration-200 flex items-center justify-center gap-2"
							>
								<IconDeviceFloppy size={16} />
								Save Draft
							</button>
							<button 
								type="button"
								onClick={() => setIsDraftManagerOpen(true)}
								className="w-full px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold focus:outline-none focus:shadow-outline duration-200 flex items-center justify-center gap-2"
							>
								<IconFileText size={16} />
								Manage Drafts
							</button>
						</div>
						{lastAutoSave && (
							<div className="text-xs text-slate-400 mt-2 text-center">
								Auto-saved at {lastAutoSave.toLocaleTimeString()}
							</div>
						)}
					</div>
					<div className='flex flex-col gap-4'>
						<div className='flex flex-col gap-1'>
							<label className="block text-slate-400 text-sm font-bold" htmlFor="tags">Tags</label>
							<Input type="text" id="tags" name="tags" className="w-full" 
								placeholder="e.g. React, JavaScript, Web Development" onKeyDown={addTag}/>
							<span className='text-slate-500 text-sm'>*Press enter to submit</span>
							{blog.tags && blog.tags.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-2">
									{blog.tags.map((tag, index) => (
										<span key={index} className="bg-[#0f6252] flex items-center text-white pl-3 pr-2 py-1 rounded-md text-sm">
											{tag}
											<IconX className='inline cursor-pointer ml-2' size={16} onClick={() => {
												setBlog((prev) => ({
													...prev,
													tags: prev.tags?.filter((_, i) => i !== index),
												}));
											}} />
										</span>
									))}
								</div>
							)}
						</div>
						<div className='flex flex-col gap-1'>
							<label className="block text-slate-400 text-sm font-bold" htmlFor="category">Category</label>
							<Input type="text" id="category" name="category" className="w-full" value={blog.category || ''} onChange={insertionEdit} placeholder="e.g. Tutorial, Random Posts" />
						</div>
					</div>
					<ThumbnailController setThumbnailFile={setThumbnailFile} blog={blog} setBlog={setBlog} />
					<button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create Post</button>
					<div className='block xl:hidden text-slate-400 text-sm font-bold border-b border-slate-600 pt-12'>
						{preview ? 'Preview' : 'Editor'}
					</div>
				</div>
      </form>
    </div>
  </>)
}

const ThumbnailController = ({
  blog,
  setBlog,
  setThumbnailFile
}: {
  blog: Partial<blogStructure_>,
  setBlog: React.Dispatch<React.SetStateAction<Partial<blogStructure_>>>
  setThumbnailFile: React.Dispatch<React.SetStateAction<File | null>> // Tambah prop ini
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState<string>('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!isImageFile(file)) {
        console.error('File yang diunggah bukan gambar.');
        return;
      }

      const originalSizeKB = Math.round(file.size / 1024)
      setCompressionInfo(`Processing: ${formatFileSize(file.size)}`)
      setIsCompressing(true)

      try {
        // Compress thumbnail if larger than 200KB
        const compressedFile = await progressiveCompress(file, {
          maxSizeKB: 200,
          maxWidth: 800,
          maxHeight: 600,
          quality: 0.8,
          format: 'jpeg'
        })

        const compressedSizeKB = Math.round(compressedFile.size / 1024)
        const reductionPercent = Math.round((1 - compressedSizeKB/originalSizeKB) * 100)
        
        setCompressionInfo(
          `${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)} (${reductionPercent}% reduction)`
        )
        
        // Simpan compressed file untuk upload
        setThumbnailFile(compressedFile);
        
        // Buat preview
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          setBlog((prev) => ({
            ...prev,
            thumbnail: dataUrl, // Preview dari compressed file
          }));
          setIsCompressing(false)
          
          // Clear compression info after 5 seconds
          setTimeout(() => setCompressionInfo(''), 5000)
        };

        reader.onerror = () => {
          console.error('Failed to process thumbnail');
          setIsCompressing(false)
          setCompressionInfo('')
        }
        
      } catch (error) {
        console.error('Thumbnail compression failed:', error)
        setIsCompressing(false)
        setCompressionInfo('')
      }
    }
  };

	const triggerFileUpload = () => {
		fileInputRef.current?.click();
	};

	return (<>
		<div>
			<label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="thumbnail">Thumbnail</label>
			<div className='flex items-center gap-2'>
				<input type="file" id="thumbnail" name="thumbnail" accept="image/*" ref={fileInputRef} 
					className="hidden" onChange={handleFileSelect} />
			</div>
			<div 
				onClick={() => !isCompressing && triggerFileUpload()} 
				style={{
					backgroundImage: blog?.thumbnail ? `url(${blog.thumbnail})` : 'none',
				}} 
				className={`w-full h-48 hover:bg-opacity-15 bg-slate-600/20 hover:bg-slate-600/30 duration-200 gap-2 rounded-lg bg-cover bg-center flex items-stretch justify-stretch cursor-pointer ${
					isCompressing ? 'opacity-50 cursor-not-allowed' : ''
				}`}
			>
				<div className={`flex grow items-center justify-center gap-2 hover:opacity-100 rounded-lg bg-slate-700/80 duration-200 ${blog?.thumbnail ? 'opacity-0' : 'opacity-70'}`}>
					{isCompressing ? (
						<>
							<IconUpload size={16} className="animate-pulse" />
							<span>Compressing...</span>
						</>
					) : (
						<>
							<IconUpload size={16} />
							<span>
								{blog?.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
							</span>
						</>
					)}
				</div>
			</div>
			
			{/* Compression info */}
			{compressionInfo && (
				<div className="text-xs text-green-600 bg-green-50/10 p-2 rounded border border-green-200/20 mt-2">
					📦 {compressionInfo}
				</div>
			)}
			
			<div className="text-xs text-slate-500 mt-1">
				Images larger than 200KB will be automatically compressed
			</div>
		</div>
	</>)
}

export default BlogCreate