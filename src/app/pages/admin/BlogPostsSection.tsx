import { useEffect, useState } from 'react';
import { ExternalLink, FilePenLine, ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RichTextEditor } from './RichTextEditor';
import {
  createBlogPost,
  createBlogSlug,
  deleteBlogPost,
  estimateReadTime,
  fetchAllBlogPosts,
  updateBlogPost,
  uploadBlogImage,
  type BlogPostInput,
  type BlogPostRow,
  type BlogPostStatus,
} from '../../../lib/blogService';

const categories = ['HR Trends', 'Recruitment', 'Leadership', 'Career Growth'];
const emptyForm = {
  title: '', slug: '', excerpt: '', contentHtml: '', category: 'HR Trends',
  authorName: 'Cr8Careers', featuredImageUrl: '', status: 'draft' as BlogPostStatus,
};

function BlogEditor({ post, onClose, onSaved }: { post: BlogPostRow | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState(() => post ? {
    title: post.title, slug: post.slug, excerpt: post.excerpt, contentHtml: post.content_html,
    category: post.category, authorName: post.author_name, featuredImageUrl: post.featured_image_url ?? '', status: post.status,
  } : emptyForm);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTitle = (title: string) => setForm(current => ({ ...current, title, slug: slugTouched ? current.slug : createBlogSlug(title) }));

  const save = async (status: BlogPostStatus) => {
    setError(null);
    const slug = createBlogSlug(form.slug);
    if (!form.title.trim()) return setError('Add a post title.');
    if (!slug) return setError('Add a valid URL slug.');
    if (!form.excerpt.trim()) return setError('Add a short excerpt.');
    if (!form.contentHtml.replace(/<[^>]*>/g, '').trim()) return setError('Add the article content.');

    setSaving(true);
    const payload: BlogPostInput = {
      title: form.title.trim(), slug, excerpt: form.excerpt.trim(), content_html: form.contentHtml,
      category: form.category, author_name: form.authorName.trim() || 'Cr8Careers',
      featured_image_url: form.featuredImageUrl.trim() || null, status,
      published_at: status === 'published' ? (post?.published_at ?? new Date().toISOString()) : null,
      read_time_minutes: estimateReadTime(form.contentHtml),
    };
    const result = post ? await updateBlogPost(post.id, payload) : await createBlogPost(payload);
    setSaving(false);
    if (result.error) {
      setError(result.error.toLowerCase().includes('duplicate') ? 'That URL slug is already used by another post.' : result.error);
      return;
    }
    await onSaved();
    onClose();
  };

  const handleImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true); setError(null);
    const result = await uploadBlogImage(file);
    setUploading(false);
    if (result.error) return setError(result.error);
    setForm(current => ({ ...current, featuredImageUrl: result.url ?? '' }));
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/55 p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="blog-editor-title">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div><h2 id="blog-editor-title" className="font-['DM_Sans',sans-serif] text-xl font-bold text-gray-900">{post ? 'Edit blog post' : 'Create blog post'}</h2><p className="font-['DM_Sans',sans-serif] text-sm text-gray-500">Save privately as a draft or publish to the Insight Centre.</p></div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close editor"><X /></button>
        </div>
        <div className="space-y-6 p-6 sm:p-8">
          {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-['DM_Sans',sans-serif] text-sm text-red-800">{error}</div>}
          <div className="grid gap-6 md:grid-cols-2">
            <div><label htmlFor="blog-title" className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">Title *</label><input id="blog-title" value={form.title} onChange={e => updateTitle(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="Article title" /></div>
            <div><label htmlFor="blog-slug" className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">URL slug *</label><div className="flex rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-[#ed2a10]"><span className="border-r border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-500">/insight-centre/</span><input id="blog-slug" value={form.slug} onChange={e => { setSlugTouched(true); setForm(current => ({ ...current, slug: createBlogSlug(e.target.value) })); }} className="min-w-0 flex-1 rounded-r-lg px-3 py-3 outline-none" /></div></div>
          </div>
          <div><label htmlFor="blog-excerpt" className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">Excerpt *</label><textarea id="blog-excerpt" value={form.excerpt} onChange={e => setForm(current => ({ ...current, excerpt: e.target.value }))} rows={3} maxLength={320} className="w-full rounded-lg border border-gray-300 px-4 py-3" placeholder="A short summary shown on the Insight Centre card." /><p className="mt-1 text-right text-xs text-gray-500">{form.excerpt.length}/320</p></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div><label htmlFor="blog-category" className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">Category</label><select id="blog-category" value={form.category} onChange={e => setForm(current => ({ ...current, category: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3">{categories.map(category => <option key={category}>{category}</option>)}</select></div>
            <div><label htmlFor="blog-author" className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">Author</label><input id="blog-author" value={form.authorName} onChange={e => setForm(current => ({ ...current, authorName: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3" /></div>
          </div>
          <div><span className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">Featured image</span><div className="grid gap-4 sm:grid-cols-[12rem_1fr] sm:items-center"><div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">{form.featuredImageUrl ? <img src={form.featuredImageUrl} alt="Featured image preview" className="h-full w-full object-cover" /> : <ImagePlus className="text-gray-400" />}</div><div><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-['DM_Sans',sans-serif] text-sm font-semibold hover:bg-gray-50"><ImagePlus className="h-4 w-4" />{uploading ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={uploading} onChange={e => handleImage(e.target.files?.[0])} className="sr-only" /></label>{form.featuredImageUrl && <button type="button" onClick={() => setForm(current => ({ ...current, featuredImageUrl: '' }))} className="ml-3 text-sm font-semibold text-red-600">Remove</button>}<p className="mt-2 text-xs text-gray-500">JPG, PNG, WebP or GIF, up to 5 MB.</p></div></div></div>
          <div><span className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">Article content *</span><RichTextEditor value={form.contentHtml} onChange={contentHtml => setForm(current => ({ ...current, contentHtml }))} /><p className="mt-2 text-xs text-gray-500">Estimated reading time: {estimateReadTime(form.contentHtml)} min</p></div>
        </div>
        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={() => save('draft')} disabled={saving} className="rounded-lg border border-[#016e71] px-5 py-2.5 font-semibold text-[#016e71] hover:bg-[#e8f5f4] disabled:opacity-60">{saving ? 'Saving…' : 'Save draft'}</button>
          <button type="button" onClick={() => save('published')} disabled={saving} className="rounded-lg bg-[#ed2a10] px-5 py-2.5 font-semibold text-white hover:bg-[#d42610] disabled:opacity-60">{saving ? 'Saving…' : post?.status === 'published' ? 'Update published post' : 'Publish post'}</button>
        </div>
      </div>
    </div>
  );
}

export default function BlogPostsSection() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<BlogPostRow | null | undefined>(undefined);

  const load = async () => {
    setLoading(true);
    const result = await fetchAllBlogPosts();
    setPosts(result.data); setError(result.error); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (post: BlogPostRow) => {
    if (!confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    const result = await deleteBlogPost(post.id);
    if (result.error) return setError(result.error);
    await load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-['DM_Sans',sans-serif] text-2xl font-bold text-gray-900">Blog posts</h2><p className="font-['DM_Sans',sans-serif] text-gray-600">Create and publish articles to the Insight Centre.</p></div><button type="button" onClick={() => setEditing(null)} className="inline-flex items-center gap-2 rounded-lg bg-[#ed2a10] px-5 py-3 font-['DM_Sans',sans-serif] font-semibold text-white hover:bg-[#d42610]"><Plus className="h-5 w-5" />New post</button></div>
      {error && <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      {loading ? <div className="rounded-xl bg-white p-10 text-center text-gray-500">Loading posts…</div> : posts.length === 0 ? <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center"><FilePenLine className="mx-auto h-10 w-10 text-gray-400" /><h3 className="mt-4 text-lg font-bold text-gray-900">No blog posts yet</h3><p className="mt-2 text-gray-500">Create a draft or publish your first Insight Centre article.</p></div> : <div className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="divide-y divide-gray-200">{posts.map(post => <article key={post.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"><div className="h-20 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-32">{post.featured_image_url ? <img src={post.featured_image_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{post.status === 'published' ? 'Published' : 'Draft'}</span><span className="text-xs text-gray-500">{post.category}</span></div><h3 className="mt-2 truncate font-['DM_Sans',sans-serif] text-lg font-bold text-gray-900">{post.title}</h3><p className="mt-1 truncate text-sm text-gray-500">/insight-centre/{post.slug}</p></div><div className="flex items-center gap-2">{post.status === 'published' && <Link to={`/insight-centre/${post.slug}`} target="_blank" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label={`View ${post.title}`}><ExternalLink className="h-5 w-5" /></Link>}<button type="button" onClick={() => setEditing(post)} className="rounded-lg p-2 text-[#016e71] hover:bg-[#e8f5f4]" aria-label={`Edit ${post.title}`}><FilePenLine className="h-5 w-5" /></button><button type="button" onClick={() => remove(post)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${post.title}`}><Trash2 className="h-5 w-5" /></button></div></article>)}</div></div>}
      {editing !== undefined && <BlogEditor post={editing} onClose={() => setEditing(undefined)} onSaved={load} />}
    </div>
  );
}
