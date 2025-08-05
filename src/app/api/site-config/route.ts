import { NextResponse } from 'next/server';
import { getCachedSiteConfig } from '@/lib/strapi/site-config';

export async function GET() {
  try {
    const siteConfig = await getCachedSiteConfig();
    
    if (!siteConfig) {
      return NextResponse.json(
        { error: 'Site configuration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: siteConfig.attributes
    });
  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site configuration' },
      { status: 500 }
    );
  }
}