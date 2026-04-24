'use client';

import { useState, useMemo } from 'react';

type MediaItem = {
    game: string;
    gameId: string;
    type: 'video' | 'image';
    date: string;
    filename: string;
    url: string;
};

const GAMES = [
    { id: 'hk4e_global', name: 'Genshin Impact' },
    { id: 'hkrpg_global', name: 'Honkai: Star Rail' },
    { id: 'nap_global', name: 'Zenless Zone Zero' },
    { id: 'bh3_global', name: 'Honkai Impact 3rd' },
];

export default function ArchiveGallery({ initialData }: { initialData: MediaItem[] }) {
    const [activeGame, setActiveGame] = useState<string>('hk4e_global');
    const [activeType, setActiveType] = useState<'all' | 'video' | 'image'>('all');
    const [downloading, setDownloading] = useState<string | null>(null);

    const filteredData = useMemo(() => {
        return initialData.filter(item => {
            const matchGame = item.gameId === activeGame;
            const matchType = activeType === 'all' || item.type === activeType;
            return matchGame && matchType;
        });
    }, [initialData, activeGame, activeType]);

    const handleDownload = async (item: MediaItem) => {
        try {
            setDownloading(item.url);
            // Construct proxy URL
            const proxyUrl = `/api/download?url=${encodeURIComponent(item.url)}`;

            // Create hidden link to trigger download
            const a = document.createElement('a');
            a.href = proxyUrl;
            a.download = item.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Gagal mengunduh file.");
        } finally {
            setDownloading(null);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center animate-slide-up">
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        HoYoPlay Archive
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Eksplorasi dan unduh sejarah visual dari Launcher HoYoverse.
                    </p>
                </header>

                {/* Game Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    {GAMES.map((game) => (
                        <button
                            key={game.id}
                            onClick={() => setActiveGame(game.id)}
                            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeGame === game.id
                                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(92,111,255,0.4)]'
                                    : 'glass-panel text-text-secondary hover:text-white hover:bg-surface-hover'
                                }`}
                        >
                            {game.name}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-4 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {(['all', 'video', 'image'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${activeType === type ? 'bg-surface-hover text-primary border border-primary/50' : 'text-text-secondary glass-panel hover:bg-surface-hover'
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-text-secondary glass-panel rounded-2xl">
                            <p className="text-xl">Tidak ada media yang ditemukan.</p>
                        </div>
                    ) : (
                        filteredData.map((item, index) => (
                            <div
                                key={`${item.date}-${item.filename}`}
                                className="glass-panel rounded-2xl overflow-hidden group flex flex-col animate-slide-up"
                                style={{ animationDelay: `${0.1 + (index % 10) * 0.05}s` }}
                            >
                                <div className="relative aspect-video bg-surface overflow-hidden">
                                    {item.type === 'video' ? (
                                        <video
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                            muted
                                            loop
                                            playsInline
                                            preload="metadata"
                                            onMouseEnter={(e) => {
                                                const playPromise = e.currentTarget.play();
                                                if (playPromise !== undefined) {
                                                    playPromise.catch((error) => {
                                                        // Ignore AbortError caused by pausing before play finishes
                                                        if (error.name !== 'AbortError' && error.name !== 'NotSupportedError') {
                                                            console.error("Video play error:", error);
                                                        }
                                                    });
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.pause();
                                                // Only reset time if it's safe (loaded)
                                                if (e.currentTarget.readyState >= 1) {
                                                    e.currentTarget.currentTime = 0;
                                                }
                                            }}
                                            onError={(e) => {
                                                console.error("Video source error for:", item.url);
                                                // Handle NotSupportedError by ignoring or logging
                                            }}
                                        >
                                            <source src={item.url} type="video/webm" />
                                        </video>
                                    ) : (
                                        <img
                                            src={item.url}
                                            alt={item.filename}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                            loading="lazy"
                                        />
                                    )}
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-mono border border-white/10">
                                        {item.date}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col grow justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-text-secondary truncate" title={item.filename}>
                                            {item.filename}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(item)}
                                        disabled={downloading === item.url}
                                        className="w-full py-2.5 bg-surface-hover hover:bg-primary border border-white/5 rounded-xl font-medium transition-all duration-300 glow-on-hover disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {downloading === item.url ? (
                                            <span className="animate-pulse">Mengunduh...</span>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Unduh {item.type === 'video' ? 'Video' : 'Gambar'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <footer className="mt-20 pt-8 border-t border-white/10 text-center text-text-secondary text-sm animate-fade-in pb-8">
                    <p className="mb-2">
                        Data bersumber dari repositori GitHub <a href="https://github.com/UIGF-org/HoYoPlay-Launcher-Background" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">UIGF-org/HoYoPlay-Launcher-Background</a>.
                    </p>
                    <p>
                        Proyek ini tidak berafiliasi dengan, disponsori, atau disetujui secara khusus oleh HoYoverse.<br />
                        Semua aset game, latar belakang launcher, video, dan gambar adalah milik COGNOSPHERE PTE. LTD.
                    </p>
                </footer>
            </div>
        </div>
    );
}
