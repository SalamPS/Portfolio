/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/global/Input"
import { blogDummy, blogStructure_ } from '@/components/interface/blogStructure'
import { IconUpload, IconX, IconDeviceFloppy, IconFileText } from '@tabler/icons-react'
import { NotificationModal } from '@/components/global/Modal'
import client from '@/lib/auth'
import BlockEditor from '../create/AdvancedBlockEditor'
import { markdownToBlocks } from '../create/blockUtils'
import BlockPreview from '../create/BlockPreview'
import DraftManager from '../create/DraftManager'
import { saveDraft, autoSaveDraft, BlogDraft, getCurrentDraft } from '../create/draftUtils'

interface BlogEditProps {
	initialBlog: blogStructure_
}

const BlogEdit = ({ initialBlog }: BlogEditProps) => {
	const router = useRouter()
	const [preview, setPreview] = useState(false)	
	const [blog, setBlog] = useState<Partial<blogStructure_>>({
		...initialBlog,
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

	useEffect(() => {
		console.log('Initial blog data:', initialBlog)
		
		// Load current edit draft if exists
		const currentEditDraft = getCurrentDraft(true)
		if (currentEditDraft && currentEditDraft.id.includes(`edit-${initialBlog._id}`)) {
			setBlog(prev => ({
				...prev,
				title: currentEditDraft.title,
				content: currentEditDraft.content,
				tags: currentEditDraft.tags,
			}))
			setCurrentDraftId(currentEditDraft.id)
		}
	}, [initialBlog])

  // Auto-save draft when blog content changes
  useEffect(() => {
    if (blog.title || blog.content) {
      const timer = setTimeout(() => {
        const draftId = autoSaveDraft({
          id: currentDraftId || `edit-${initialBlog._id}`,
          title: blog.title || '',
          content: blog.content || '',
          authorId: blog.authorId || '1',
          authorName: blog.authorName || 'SalamPS',
          tags: blog.tags || [],
          thumbnail: blog.thumbnail || '',
        }, true) // isEdit = true
        
        if (!currentDraftId) {
          setCurrentDraftId(draftId)
        }
        setLastAutoSave(new Date())
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [blog.title, blog.content, blog.tags, blog.thumbnail, blog.authorId, blog.authorName, currentDraftId, initialBlog._id])

  const handleContentChange = useCallback((markdown: string) => {
    setBlog(prev => ({ ...prev, content: markdown }))
  }, [])

  const handleManualSave = () => {
    const draftId = saveDraft({
      id: currentDraftId || `edit-${initialBlog._id}`,
      title: blog.title || '',
      content: blog.content || '',
      authorId: blog.authorId || '1',
      authorName: blog.authorName || 'SalamPS',
      tags: blog.tags || [],
      thumbnail: blog.thumbnail || '',
    }, true) // isEdit = true
    
    if (!currentDraftId) {
      setCurrentDraftId(draftId)
    }
    
    showNotification('success', 'Draft Saved', 'Your draft has been saved successfully!')
  }

  const handleLoadDraft = (draft: BlogDraft) => {
    setBlog({
      ...blog, // Keep original blog metadata
      title: draft.title,
      content: draft.content,
      tags: draft.tags,
    })
    setCurrentDraftId(draft.id)
    showNotification('info', 'Draft Loaded', `Draft "${draft.title || 'Untitled'}" has been loaded`)
  }

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
		if (!blog.thumbnail && !thumbnailFile) {
			showNotification('error', 'Validation Error', 'Thumbnail is required');
			return;
		}
		
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('content', blog.content);
		formData.append('authorId', blog.authorId || '');
		formData.append('category', blog.category || 'General');
    formData.append('tags', JSON.stringify(blog.tags));
    
    // Hanya append thumbnail file jika ada file baru yang dipilih
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    // Update blog berdasarkan slug
    client.put(`blog/${initialBlog._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        if (response.data.success) {
          showNotification('success', 'Success', 'Blog updated successfully!');
          // Redirect ke blog setelah berhasil update
          setTimeout(() => {
            router.push(`/blog/${initialBlog.slug}`);
          }, 2000);
        } else {
          showNotification('error', 'Update Failed', response.data.message || 'Failed to update blog');
        }
      })
      .catch((error) => {
        console.error('Error updating blog:', error);
        showNotification('error', 'Error', 'An error occurred while updating the blog. Please try again later.');
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
			isEdit={true}
		/>
		<div className="flex flex-col xl:flex-row px-8 pt-24 xl:py-36 xl:px-28 gap-4 xl:gap-8">
      <form className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full" onSubmit={handleSubmit}>
				<main className='xl:col-span-2 order-2 xl:order-1'>
					{!preview ? <>
						<section id='title' className='mb-4'>
							<label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="title">Title</label>
							<Input type="text" id="title" name="title" className="w-full" value={blog.title || ''} onChange={insertionEdit} required />
						</section>
						<section id='md-editor' className='group'>
							<label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="content">Content</label>
							<BlockEditor
								initialContent={blog.content || ''}
								onChange={handleContentChange}
								placeholder="Start editing your blog content..."
								autoSave={false}
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
							<Input type="text" id="category" name="category" className="w-full" placeholder="e.g. Tutorial, Random Posts" value={blog.category || ''} onChange={insertionEdit} />
						</div>
					</div>
					<ThumbnailController setThumbnailFile={setThumbnailFile} blog={blog} setBlog={setBlog} />
					<button type="submit" className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Update Post</button>
					<button 
						type="button" 
						onClick={() => router.back()}
						className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						Cancel
					</button>
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
  setThumbnailFile: React.Dispatch<React.SetStateAction<File | null>>
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        console.error('File yang diunggah bukan gambar.');
        return;
      }
      
      // Simpan file untuk upload
      setThumbnailFile(file);
      
      // Buat preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setBlog((prev) => ({
          ...prev,
          thumbnail: dataUrl, // Hanya untuk preview
        }));
      };
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
			<div onClick={triggerFileUpload} style={{
				backgroundImage: blog?.thumbnail ? `url(${blog.thumbnail})` : 'none',
			}} className='w-full h-48 hover:bg-opacity-15 bg-slate-600/20 hover:bg-slate-600/30 duration-200 gap-2 rounded-lg bg-cover bg-center flex items-stretch justify-stretch cursor-pointer'>
				<div className={`flex grow items-center justify-center gap-2 hover:opacity-100 rounded-lg bg-slate-700/80 duration-200 ${blog?.thumbnail ? 'opacity-0' : 'opacity-70'}`}>
					<IconUpload size={16} />
					<span>
						{blog?.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
					</span>
				</div>
			</div>
		</div>
	</>)
}

export default BlogEdit
