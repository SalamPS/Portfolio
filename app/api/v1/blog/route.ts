import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/api/lib/mongodb';
import BlogModel from '@/app/api/models/blogModel';

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

// POST - Membuat blog baru
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    console.log('Received request to create a new blog'); 
    
    const body = await request.json();
    const { title, content, authorId, authorName, tags } = body;
    
    // Validasi input
    if (!title || !content || !authorId || !authorName) {
      return NextResponse.json(
        { success: false, message: 'Title, content, authorId, and authorName are required' },
        { status: 400 }
      );
    }
    console.log('Creating new blog with data:', body);
    
    const newBlog = new BlogModel({
      title,
      content,
      authorId,
      authorName,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      tags: tags || []
    });
    
    console.log('New Blog:', newBlog);
    const savedBlog = await newBlog.save();
    
    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      data: savedBlog
    }, { status: 201 });
    
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}