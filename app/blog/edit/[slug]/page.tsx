import { notFound } from 'next/navigation'
import BlogEdit from '@/components/blog/edit/BlogEdit'
import GlobalNavbar from '@/components/global/Navbar'
import { Metadata } from 'next'
import client from '@/lib/auth'

export const metadata: Metadata = {
	title: "Edit Blog",
	description: "Edit Salam's blog post. But, are you belong to this journey?"
}

// Simulasi fungsi untuk mendapatkan blog berdasarkan slug
async function getBlogBySlug(slug: string) {
	// Dalam implementasi nyata, ini akan mengambil data dari database
	return client
		.get(`/blog/spec?slug=${slug}`)
		.then((response) => {
			console.log('Blog data:', response)
			const data = response.data
			return data.success ? data.data.blog : null
		})
		.catch((error) => {
			console.error('Error fetching blog:', error)
			return null
		})
}

interface PageProps {
	params: Promise<{ slug: string }>
}

export default async function EditBlogPage({ params }: PageProps) {
	const { slug } = await params
	
	// Decode slug jika diperlukan
	const decodedSlug = decodeURIComponent(slug)
	
	// Ambil blog berdasarkan slug
	const blog = await getBlogBySlug(decodedSlug)
	
	// Jika blog tidak ditemukan, tampilkan not found
	if (!blog) {
		notFound()
	}
	
	return (
		<>
			<GlobalNavbar />
			<BlogEdit initialBlog={blog} />
		</>
	)
}
