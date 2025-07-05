import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/app/api/lib/mongodb';
import BlogModel from '@/app/api/models/blogModel';
import { blogStructure_ } from '@/app/components/interface/blogStructure';

// GET - Mendapatkan blog berdasarkan ID
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug parameter is required' },
        { status: 400 }
      );
    }
    
    const blog = await BlogModel.findOne({ slug: slug });
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        blog,
        ads: [
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
        ]
      }
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