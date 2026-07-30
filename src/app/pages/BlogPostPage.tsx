import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { ArrowLeft, Clock3 } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { fetchPublishedBlogPost, type BlogPostRow } from '../../lib/blogService';

export default function BlogPostPage() {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<BlogPostRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchPublishedBlogPost(slug).then(result => {
      if (!active) return;
      setPost(result.data); setError(result.error); setLoading(false);
    });
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-white"><SiteHeader activePage="insight" /><main className="px-4 pb-24 pt-48 text-center text-gray-500">Loading article…</main><SiteFooter /></div>;
  if (error || !post) return <div className="min-h-screen bg-white"><SiteHeader activePage="insight" /><main className="mx-auto max-w-3xl px-4 pb-24 pt-48 text-center"><h1 className="text-3xl font-bold text-[#1d1d1d]">Article not found</h1><p className="mt-3 text-gray-600">This article may have been unpublished or its address may have changed.</p><Link to="/insight-centre" className="mt-6 inline-flex items-center gap-2 font-bold text-[#016e71]"><ArrowLeft className="h-4 w-4" />Back to Insight Centre</Link></main><SiteFooter /></div>;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader activePage="insight" />
      <main>
        <header className="bg-[#fffaf5] pb-16 pt-44 lg:pb-20 lg:pt-52">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <Link to="/insight-centre" className="inline-flex items-center gap-2 rounded-sm font-['DM_Sans',sans-serif] font-bold text-[#016e71] hover:opacity-75"><ArrowLeft className="h-4 w-4" />Insight Centre</Link>
            <p className="mt-8 font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-widest text-[#ed2a10]">{post.category}</p>
            <h1 className="mt-3 font-['DM_Sans',sans-serif] text-4xl font-bold leading-tight tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-6xl">{post.title}</h1>
            <p className="mt-5 font-['DM_Sans',sans-serif] text-xl leading-relaxed text-gray-600">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500"><span>By {post.author_name}</span><time dateTime={post.published_at ?? undefined}>{post.published_at ? new Date(post.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</time><span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" />{post.read_time_minutes} min read</span></div>
          </div>
        </header>
        {post.featured_image_url && <div className="mx-auto -mb-6 mt-10 max-w-5xl px-4 sm:px-6"><img src={post.featured_image_url} alt="" className="max-h-[34rem] w-full rounded-xl object-cover" /></div>}
        <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <div
            className="font-['DM_Sans',sans-serif] text-lg leading-8 text-gray-800 [&_a]:font-semibold [&_a]:text-[#016e71] [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#f58c21] [&_blockquote]:pl-5 [&_h1]:mb-5 [&_h1]:mt-10 [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-bold [&_li]:mb-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:my-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-7"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content_html) }}
          />
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
