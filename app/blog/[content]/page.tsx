import BlogContent from "@/components/blog/content/BlogContent";
import GlobalNavbar from "@/components/global/Navbar";
import dbConnect from '@/app/api/lib/mongodb';
import BlogModel from '@/app/api/models/blogModel';
import { blogStructure_, blogAds_, commentStructure_ } from "@/components/interface/blogStructure";
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Params {
  content: string;
}

interface BlogDocument {
  _id: { toString(): string };
  slug: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: { toISOString(): string };
  updatedAt: { toISOString(): string };
  comments: commentStructure_[];
  tags: string[];
  category: string;
  likes: string[];
  saves: string[];
  thumbnail: string;
}

// Fungsi untuk fetch data blog
async function getBlogData(slug: string): Promise<{ blog: blogStructure_; ads: blogAds_[] } | null> {
  try {
    await dbConnect();
    
    const blog = await BlogModel.findOne({ slug: slug }).lean() as BlogDocument | null;
    
    if (!blog) {
      return null;
    }
    
    // Convert ObjectId dan Date untuk serialization
    const serializedBlog: blogStructure_ = {
      _id: blog._id.toString(),
      slug: blog.slug,
      title: blog.title,
      content: blog.content,
      authorId: blog.authorId,
      authorName: blog.authorName,
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
      comments: blog.comments || [],
      tags: blog.tags || [],
      category: blog.category || '',
      likes: blog.likes || [],
      saves: blog.saves || [],
      thumbnail: blog.thumbnail || '',
    };

    const ads: blogAds_[] = [
      {
        adsId: '1',
        adsTitle: 'Lamp.Devs',
        adsImageLink: '/ads/ads-1.png',
        adsLink: 'https://salamp.id',
      },
      {
        adsId: '2',
        adsTitle: 'Jetson AGX Orin',
        adsImageLink: 'https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/_jcr_content/root/responsivegrid/nv_container_1336425203/nv_image.coreimg.100.850.jpeg/1734419987053/jetson-orin-nano-super-dev-kit-ari.jpeg',
        adsLink: 'https://developer.nvidia.com/embedded/jetson-agx-orin-devkit',
      },
    ];

    return {
      blog: serializedBlog,
      ads
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Generate metadata untuk SEO
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { content } = await params;
  const data = await getBlogData(content);
  
  if (!data) {
    return {
      title: {
        absolute: 'LampBlog | Not Found'
      },
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: {
      absolute: `LampBlog | ${data.blog.title}`
    },
    description: data.blog.content.substring(0, 160).replace(/<[^>]*>/g, ''), // Strip HTML untuk description
    keywords: data.blog.tags.join(', '),
    authors: [{ name: data.blog.authorName }],
    openGraph: {
      title: `LampBlog | ${data.blog.title}`,
      description: data.blog.content.substring(0, 160).replace(/<[^>]*>/g, ''),
      images: data.blog.thumbnail ? [data.blog.thumbnail] : [],
      type: 'article',
      publishedTime: data.blog.createdAt.toString(),
      modifiedTime: data.blog.updatedAt.toString(),
      authors: [data.blog.authorName],
      tags: data.blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: `LampBlog | ${data.blog.title}`,
      description: data.blog.content.substring(0, 160).replace(/<[^>]*>/g, ''),
      images: data.blog.thumbnail ? [data.blog.thumbnail] : [],
    }
  };
}

export default async function BlogPageParams({ params }: { params: Promise<Params> }) {
  const { content } = await params;
  const data = await getBlogData(content);

  if (!data) {
    notFound();
  }

  console.log("BlogPageParams content:", content);

  return (
    <>
      <GlobalNavbar />
      <BlogContent data={data.blog} ads={data.ads} />
    </>
  );
}