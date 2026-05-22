import React, { useState } from 'react';
import { useAppState } from '../lib/state';
import { BookOpen, Calendar, Eye, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export const BlogView: React.FC = () => {
  const { blogs, lang, settings } = useAppState();
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const activeBlog = blogs.find(b => b.id === selectedBlogId);

  return (
    <div id="blog-parent-view" className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {activeBlog ? (
        <article id="individual-article" className="bg-white border rounded-3xl p-6 md:p-8 space-y-6 dark:bg-gray-800 dark:border-gray-700">
          <button
            id="back-to-blogs-list-btn"
            onClick={() => setSelectedBlogId(null)}
            className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-950 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সকল ব্লগে ফিরে যান' : 'Back to Article Feed'}</span>
          </button>

          <img
            src={activeBlog.imageUrl}
            alt={activeBlog.titleEn}
            className="w-full h-80 object-cover rounded-2xl shadow-xs"
          />

          <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full uppercase dark:bg-emerald-950/40 dark:text-emerald-300 font-bold">
              {lang === 'bn' ? activeBlog.categoryBn : activeBlog.categoryEn}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(activeBlog.createdAt).toLocaleDateString()}</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{activeBlog.views + 65} views</span>
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-950 dark:text-white leading-tight">
            {lang === 'bn' ? activeBlog.titleBn : activeBlog.titleEn}
          </h1>

          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line border-t border-gray-100 pt-6">
            {lang === 'bn' ? activeBlog.contentBn : activeBlog.contentEn}
          </p>
        </article>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full dark:bg-emerald-950/40">
              📚 Educational Resource Hub
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              {lang === 'bn' ? 'ব্লগ, টিউটোরিয়াল ও সর্বশেষ নিউজ' : 'Digital Booster Educational Feed'}
            </h1>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {lang === 'bn' ? 'সোশ্যাল মিডিয়া পেইজের রিচ বাড়াতে এবং শর্ট লিংক ভিজিটর বৃদ্ধির কার্যকারী কৌশল হ্যাকস' : 'Expert tricks, bystander guidelines, and URL shortener traffic monetization schemes'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((b) => (
              <div
                key={b.id}
                id={`blog-card-${b.id}`}
                onClick={() => setSelectedBlogId(b.id)}
                className="bg-white border rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col justify-between dark:bg-gray-800 dark:border-gray-700"
              >
                <div>
                  <img
                    src={b.imageUrl}
                    alt={b.titleEn}
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm dark:bg-emerald-900/10">
                        {lang === 'bn' ? b.categoryBn : b.categoryEn}
                      </span>
                      <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="font-bold text-gray-950 dark:text-white text-base leading-snug line-clamp-2">
                      {lang === 'bn' ? b.titleBn : b.titleEn}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                      {lang === 'bn' ? b.contentBn : b.contentEn}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-50/50 mt-2 flex justify-between items-center text-xs text-emerald-600 hover:text-emerald-500 font-bold dark:border-gray-700/50">
                  <span>{lang === 'bn' ? 'বিস্তারিত পড়ুন' : 'Read Article'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
