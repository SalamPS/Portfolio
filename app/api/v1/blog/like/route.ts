import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/api/lib/mongodb';
import BlogModel from '@/app/api/models/blogModel';

// POST - Like/Unlike blog
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const body = await request.json();
    const { action } = body; // 'like' or 'unlike'
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID' },
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
    
    if (action === 'like') {
      blog.likes += 1;
    } else if (action === 'unlike') {
      blog.likes = Math.max(0, blog.likes - 1);
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid action. Use "like" or "unlike"' },
        { status: 400 }
      );
    }
    
    await blog.save();
    
    return NextResponse.json({
      success: true,
      message: `Blog ${action}d successfully`,
      data: { likes: blog.likes }
    });
    
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}