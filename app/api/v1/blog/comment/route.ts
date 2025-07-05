import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/api/lib/mongodb';
import BlogModel from '@/app/api/models/blogModel';

// POST - Tambah comment ke blog
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const body = await request.json();
    const { authorId, authorName, content } = body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    if (!authorId || !authorName || !content) {
      return NextResponse.json(
        { success: false, message: 'AuthorId, authorName, and content are required' },
        { status: 400 }
      );
    }
    
    const blog = await BlogModel.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    const newComment = {
      authorId,
      authorName,
      content,
      createdAt: new Date()
    };
    
    blog.comments.push(newComment);
    await blog.save();
    
    return NextResponse.json({
      success: true,
      message: 'Comment added successfully',
      data: newComment
    }, { status: 201 });
    
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}