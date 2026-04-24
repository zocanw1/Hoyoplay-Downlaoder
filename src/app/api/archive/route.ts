import { NextResponse } from 'next/server';

const GITHUB_TREE_API = "https://api.github.com/repos/UIGF-org/HoYoPlay-Launcher-Background/git/trees/main?recursive=1";

const CDN_MAP: Record<string, string> = {
    "hk4e_global": "https://launcher-webstatic.hoyoverse.com/launcher-public", // Genshin Impact
    "bh3_global": "https://launcher-webstatic.hoyoverse.com/launcher-public",  // Honkai Impact 3rd
    "hkrpg_global": "https://fastcdn.hoyoverse.com/static-resource-v2",        // Honkai: Star Rail
    "nap_global": "https://fastcdn.hoyoverse.com/static-resource-v2"           // Zenless Zone Zero
};

const GAME_NAMES: Record<string, string> = {
    "hk4e_global": "Genshin Impact",
    "bh3_global": "Honkai Impact 3rd",
    "hkrpg_global": "Honkai Star Rail",
    "nap_global": "Zenless Zone Zero"
};

export async function GET() {
    try {
        const response = await fetch(GITHUB_TREE_API, {
            // Revalidate cache every 1 hour (3600s) to keep API limits safe
            next: { revalidate: 3600 } 
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from GitHub: ${response.status}`);
        }

        const data = await response.json();
        const tree = data.tree || [];

        // Regex for media files: output/hoyoplay_global_text/<game>/<type>/<year>/<month>/<day>/<filename>
        const pattern = /^output\/hoyoplay_global_text\/([^\/]+)\/(video|image)\/(\d{4})\/(\d{2})\/(\d{2})\/([^\/]+\.(webm|png|jpg|webp))$/i;

        const results = [];

        for (const item of tree) {
            const match = item.path.match(pattern);
            if (match) {
                const [, game_biz, type, year, month, day, filename] = match;

                // Only process recognized Global versions
                if (CDN_MAP[game_biz]) {
                    const baseUrl = CDN_MAP[game_biz];
                    const cdnUrl = `${baseUrl}/${year}/${month}/${day}/${filename}`;
                    const gameName = GAME_NAMES[game_biz] || game_biz;
                    const dateFolder = `${year}-${month}-${day}`;

                    results.push({
                        game: gameName,
                        gameId: game_biz,
                        type, // 'video' | 'image'
                        date: dateFolder,
                        filename,
                        url: cdnUrl
                    });
                }
            }
        }

        // Sort results by date descending
        results.sort((a, b) => b.date.localeCompare(a.date));

        return NextResponse.json({ success: true, count: results.length, data: results });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
