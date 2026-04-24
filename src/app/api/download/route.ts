import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status}`);
        }

        const filename = url.split('/').pop() || 'download';
        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        // Read stream and pipe to response
        const blob = await response.blob();

        return new NextResponse(blob, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'public, max-age=86400'
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
