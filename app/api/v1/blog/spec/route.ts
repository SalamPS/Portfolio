import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/api/lib/mongodb';
import BlogModel from '@/app/api/models/blogModel';
import { blogStructure_ } from '@/app/components/interface/blogStructure';

// GET - Mendapatkan blog berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
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
    
    return NextResponse.json({
      success: true,
      data: blog
    });
    
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}

// PUT - Update blog berdasarkan ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const body = await request.json();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    const { title, content, tags, authorId } = body;
    
    const blog = await BlogModel.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Opsional: Validasi bahwa hanya author yang bisa update
    if (authorId && blog.authorId !== authorId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to update this blog' },
        { status: 403 }
      );
    }
    
    const updateData: Partial<blogStructure_> = { updatedAt: new Date() };
    
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags;
    
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog
    });
    
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}

// DELETE - Hapus blog berdasarkan ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');
    
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
    
    // Opsional: Validasi bahwa hanya author yang bisa delete
    if (authorId && blog.authorId !== authorId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to delete this blog' },
        { status: 403 }
      );
    }
    
    await BlogModel.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
    
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}