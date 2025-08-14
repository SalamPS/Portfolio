import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/api/lib/mongodb';
import BlogModel from '@/app/api/models/blogModel';
import { blogStructure_ } from '@/components/interface/blogStructure';
import fs from 'fs';
import path from 'path';

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
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
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
    const formData = await request.formData();
    
    // Validasi ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID' },
        { status: 400 }
      );
    }
    
    // Extract form fields
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const authorId = formData.get('authorId') as string;
    const category = formData.get('category') as string;
    const tagsString = formData.get('tags') as string;
    const thumbnailFile = formData.get('thumbnail') as File | null;
    
    // Parse tags
    const tags = tagsString ? JSON.parse(tagsString) : [];
    
    // Validasi input wajib
    if (!title || !content || !authorId) {
      return NextResponse.json(
        { success: false, message: 'Title, content, and authorId are required' },
        { status: 400 }
      );
    }

    console.log('Updating blog with ID:', id);
    
    // Cari blog yang akan diupdate
    const existingBlog = await BlogModel.findById(id);
    
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Validasi autorisasi
    if (existingBlog.authorId !== authorId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to update this blog' },
        { status: 403 }
      );
    }
    
    // Prepare update data
    const updateData: Partial<blogStructure_> = {
      title,
      content,
      category,
      tags,
      updatedAt: new Date()
    };
    
    // Handle thumbnail upload jika ada file baru
    if (thumbnailFile && thumbnailFile.size > 0) {
      // Validasi tipe file
      if (!thumbnailFile.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, message: 'Thumbnail must be an image file' },
          { status: 400 }
        );
      }
      
      try {
        // Generate unique filename
        const timestamp = Date.now();
        const originalName = thumbnailFile.name;
        const fileName = `${timestamp}-${originalName}`;
        const uploadsDir = path.join(process.cwd(), 'public', 'blog', 'thumbnails');
        const filePath = path.join(uploadsDir, fileName);
        
        // Ensure directory exists
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        // Save file
        const bytes = await thumbnailFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        fs.writeFileSync(filePath, buffer);
        
        // Update thumbnail path
        updateData.thumbnail = `/blog/thumbnails/${fileName}`;
        
        // Optionally delete old thumbnail
        if (existingBlog.thumbnail && existingBlog.thumbnail.startsWith('/blog/thumbnails/')) {
          const oldFilePath = path.join(process.cwd(), 'public', existingBlog.thumbnail);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        
      } catch (uploadError) {
        console.error('Error uploading thumbnail:', uploadError);
        return NextResponse.json(
          { success: false, message: 'Failed to upload thumbnail' },
          { status: 500 }
        );
      }
    }
    
    // Update blog
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
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
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
    
    // Validasi autorisasi
    if (authorId && blog.authorId !== authorId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to delete this blog' },
        { status: 403 }
      );
    }
    
    // Hapus file thumbnail jika ada
    if (blog.thumbnailLink && blog.thumbnailLink.startsWith('/blog/thumbnails/')) {
      const filePath = path.join(process.cwd(), 'public', blog.thumbnailLink);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await BlogModel.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
    
  } catch (error: unknown) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
