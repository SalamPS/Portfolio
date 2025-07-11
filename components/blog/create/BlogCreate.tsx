/* eslint-disable @next/next/no-img-element */
'use client'

import { useRef, useState } from 'react'
import { Input } from "@/components/global/Input"
import { AutoMD } from "@/components/utils/Markdown"
import { blogDummy, blogStructure_ } from '@/components/interface/blogStructure'
import { IconUpload, IconX } from '@tabler/icons-react'
import client from '@/lib/auth'

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
			alert('Title is required');
			return;
		}
		if (!blog.content) {
			alert('Content is required');
			return;
		}
		if (!blog.authorName) {
			alert('Author name is required');
			return;
		}
		if (!blog.tags || blog.tags.length === 0) {
			alert('At least one tag is required');
			return;
		}
		if (!blog.thumbnail) {
			alert('Thumbnail is required');
			return;
		}
    if (!thumbnailFile) {
      alert('Thumbnail is required');
      return;
    }
		
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('content', blog.content);
    formData.append('authorId', blog.authorId || '1');
    formData.append('authorName', blog.authorName);
    formData.append('tags', JSON.stringify(blog.tags));
    formData.append('thumbnail', thumbnailFile);

    client.post('blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        if (response.data.success) {
          alert('Blog created successfully!');
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
          alert('Failed to create blog: ' + response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error creating blog:', error);
        alert('An error occurred while creating the blog. Please try again later.');
      });
	}

  return (<>
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

							<div className='flex gap-2 rounded-t-lg bg-slate-400/20 p-3 duration-200'>

							</div>
							<textarea className="w-full h-80 p-4 border rounded-b-lg outline-none resize-none bg-transparent duration-200 border-slate-400/30" 
								required name="content" id="content" onChange={insertionEdit} value={blog['content']} >
							</textarea>
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
								<AutoMD content={blog['content'] || blogDummy.content} />
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
						<span className="block text-slate-400 text-end text-sm font-bold mb-2">Blog Utilites</span>
						<button className={`w-full px-4 py-3 rounded-xl text-white font-bold focus:outline-none focus:shadow-outline duration-200 ${preview ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-slate-500/20 hover:bg-slate-500/30'}`}
							onClick={(e) => {e.preventDefault(); setPreview(!preview);}}>
							Toggle Preview
						</button>
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
							<Input type="text" id="category" name="category" className="w-full" placeholder="e.g. Tutorial, Random Posts" />
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

export default BlogCreate