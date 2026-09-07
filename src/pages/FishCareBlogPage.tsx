import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BlogArticle } from '../types';
import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  Archive,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Tag,
  ArrowRight,
  FileText,
  User,
} from 'lucide-react';

export const FishCareBlogPage: React.FC = () => {
  const { blogs, t, searchQuery, setSearchQuery } = useApp();
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [showArchiveTab, setShowArchiveTab] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Extract unique published years
  const availableYears = useMemo(() => {
    const years: number[] = Array.from(new Set(blogs.map((b) => Number(b.publishedYear))));
    return years.sort((a, b) => b - a);
  }, [blogs]);

  // Check if there are archived articles
  const hasArchivedArticles = useMemo(() => {
    return blogs.some((b) => b.status === 'archived');
  }, [blogs]);

  // Filtered active articles
  const activeArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return blogs.filter((b) => {
      if (b.status !== 'active') return false;
      if (selectedYear !== 'all' && b.publishedYear !== selectedYear) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [blogs, searchQuery, selectedYear]);

  // Filtered archived articles (searchable)
  const archivedArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return blogs.filter((b) => {
      if (b.status !== 'archived') return false;
      if (selectedYear !== 'all' && b.publishedYear !== selectedYear) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [blogs, searchQuery, selectedYear]);

  const displayedArticles = showArchiveTab ? archivedArticles : activeArticles;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Hatchery Science &amp; Technical Advisories</span>
        </div>
        <h1 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Fish Care &amp; Hatchery Guides
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Field-tested protocols for hormone spawning, biofloc water chemistry, disease prevention, and high-density <em>Clarias batrachus</em> grow-out.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, protocols, diseases..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filter by Year & Archive Toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Year Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedYear === 'all'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {t('allYears')}
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedYear === year
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Archive Section Tab (Only visible if there is at least one article tagged as archived) */}
          {hasArchivedArticles && (
            <button
              onClick={() => setShowArchiveTab(!showArchiveTab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                showArchiveTab
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('archiveArticles')} ({archivedArticles.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Article Detail Modal / Reader */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white cursor-pointer"
            >
              ✕
            </button>

            {/* Slideshow of Images */}
            {selectedArticle.images.length > 0 && (
              <div className="relative aspect-16/9 bg-slate-950 overflow-hidden flex-shrink-0">
                <img
                  src={selectedArticle.images[activeSlideIndex % selectedArticle.images.length]}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />

                {selectedArticle.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveSlideIndex((prev) =>
                          prev === 0 ? selectedArticle.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveSlideIndex((prev) =>
                          (prev + 1) % selectedArticle.images.length
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Article Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="px-2.5 py-0.5 rounded-full font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                  {selectedArticle.category}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedArticle.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {selectedArticle.author}
                </span>
              </div>

              <h2 className="font-outfit text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {selectedArticle.title}
              </h2>

              {/* YouTube Video Embed if available */}
              {selectedArticle.youtubeUrl && (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5 mb-2">
                    <PlayCircle className="w-4 h-4" />
                    Technical Video Demonstration
                  </span>
                  <div className="aspect-16/9 rounded-xl overflow-hidden bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Video tutorial"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedArticle.content}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => {
              setSelectedArticle(article);
              setActiveSlideIndex(0);
            }}
            className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer group"
          >
            {/* Card Image */}
            <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
              <img
                src={article.images[0]}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 text-white backdrop-blur-xs border border-white/20">
                  {article.category}
                </span>
                {article.status === 'archived' && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                    Archived
                  </span>
                )}
              </div>
              {article.youtubeUrl && (
                <div className="absolute bottom-3 right-3 p-1.5 rounded-full bg-rose-600 text-white shadow-md">
                  <PlayCircle className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" />
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span>{article.readingTimeMinutes} min read</span>
                </div>

                <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>{t('readGuide')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Year {article.publishedYear}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {displayedArticles.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-semibold">
            No articles match your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedYear('all');
            }}
            className="mt-3 text-xs text-sky-600 font-bold hover:underline"
          >
            Reset search filters
          </button>
        </div>
      )}
    </div>
  );
};
