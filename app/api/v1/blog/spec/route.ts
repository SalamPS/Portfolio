import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/api/lib/mongodb';
import BlogModel from '@/app/api/models/blogModel';

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
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}