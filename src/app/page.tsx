import ArchiveGallery from '@/components/ArchiveGallery';

// Make sure the host URL is correct for SSR data fetching
async function getArchiveData() {
  try {
    // Determine the base URL. In development it's localhost:3000
    // Note: It's better to fetch directly using absolute URL in server components or call the API function directly.
    // To avoid hardcoding localhost, we can fetch from our own github tree here, or just call the API logic directly.
    
    // Instead of doing a self-fetch which requires absolute URL, let's fetch GitHub directly here
    // or re-use the logic. For simplicity, we'll fetch GitHub tree directly.
    
    const GITHUB_TREE_API = "https://api.github.com/repos/UIGF-org/HoYoPlay-Launcher-Background/git/trees/main?recursive=1";

    const CDN_MAP: Record<string, string> = {
        "hk4e_global": "https://launcher-webstatic.hoyoverse.com/launcher-public",
        "bh3_global": "https://launcher-webstatic.hoyoverse.com/launcher-public",
        "hkrpg_global": "https://fastcdn.hoyoverse.com/static-resource-v2",
        "nap_global": "https://fastcdn.hoyoverse.com/static-resource-v2"
    };

    const GAME_NAMES: Record<string, string> = {
        "hk4e_global": "Genshin Impact",
        "bh3_global": "Honkai Impact 3rd",
        "hkrpg_global": "Honkai Star Rail",
        "nap_global": "Zenless Zone Zero"
    };

    const response = await fetch(GITHUB_TREE_API, { next: { revalidate: 3600 } });
    if (!response.ok) return [];

    const data = await response.json();
    const tree = data.tree || [];

    const pattern = /^output\/hoyoplay_global_text\/([^\/]+)\/(video|background)\/(\d{4})\/(\d{2})\/(\d{2})\/([^\/]+\.(webm|png|jpg|webp))$/i;
    const results = [];

    for (const item of tree) {
        const match = item.path.match(pattern);
        if (match) {
            const [, game_biz, typePath, year, month, day, filename] = match;

            if (CDN_MAP[game_biz]) {
                const baseUrl = CDN_MAP[game_biz];
                const cdnUrl = `${baseUrl}/${year}/${month}/${day}/${filename}`;
                const gameName = GAME_NAMES[game_biz] || game_biz;
                const dateFolder = `${year}-${month}-${day}`;
                const type = typePath === 'background' ? 'image' : 'video';

                results.push({
                    game: gameName,
                    gameId: game_biz,
                    type: type as 'video'|'image',
                    date: dateFolder,
                    filename,
                    url: cdnUrl
                });
            }
        }
    }

    results.sort((a, b) => b.date.localeCompare(a.date));
    return results;
  } catch (error) {
    console.error("Failed to fetch archive data:", error);
    return [];
  }
}

export default async function Home() {
  const data = await getArchiveData();

  return (
    <main>
      <ArchiveGallery initialData={data} />
    </main>
  );
}
