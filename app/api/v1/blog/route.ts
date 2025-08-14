import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/api/lib/mongodb';
import BlogModel from '@/app/api/models/blogModel';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface BlogQuery_ {
  $or?: Array<{
    title?: { $regex: string; $options: string };
    content?: { $regex: string; $options: string };
  }>;
  tags?: { $in: string[] };
  authorId?: string;
}

// GET - Mendapatkan semua blog atau blog berdasarkan query
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');
    const authorId = searchParams.get('authorId');
    
    const query: BlogQuery_ = {};
    
    // Filter berdasarkan pencarian
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter berdasarkan tags
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }
    
    // Filter berdasarkan author
    if (authorId) {
      query.authorId = authorId;
    }
    
    const skip = (page - 1) * limit;
    
    const blogs = await BlogModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await BlogModel.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}

// POST - Membuat blog baru dengan multipart
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    console.log('Received request to create a new blog');
    
    const formData = await request.formData();
    
    // Extract form fields
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const authorId = formData.get('authorId') as string;
    const authorName = formData.get('authorName') as string;
    const category = formData.get('category') as string;
    const tagsString = formData.get('tags') as string;
    const thumbnailFile = formData.get('thumbnail') as File;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Parse tags
    const tags = tagsString ? JSON.parse(tagsString) : [];
    
    // Validasi input
    if (!title || !content || !authorId || !authorName) {
      return NextResponse.json(
        { success: false, message: 'Title, content, authorId, and authorName are required' },
        { status: 400 }
      );
    }
    
    if (!thumbnailFile || thumbnailFile.size === 0) {
      return NextResponse.json(
        { success: false, message: 'Thumbnail is required' },
        { status: 400 }
      );
    }
    
    // Validasi tipe file
    if (!thumbnailFile.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Thumbnail must be an image file' },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${thumbnailFile.name}`;
    const uploadDir = join(process.cwd(), 'public', 'blog', 'thumbnails');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    const filePath = join(uploadDir, fileName);
    
    // Save file
    const bytes = await thumbnailFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // URL untuk thumbnail
    const thumbnailUrl = `/blog/thumbnails/${fileName}`;
    
    const newBlog = new BlogModel({
      title,
      content,
      authorId,
      authorName,
      category,
      slug,
      tags,
      thumbnail: thumbnailUrl
    });
    
    const savedBlog = await newBlog.save();
    
    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      data: savedBlog
    }, { status: 201 });
    
  } catch (error: unknown) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}