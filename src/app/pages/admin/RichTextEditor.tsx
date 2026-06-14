import { useState, useEffect, type ReactNode } from 'react';
import { useEditor, EditorContent, BubbleMenu, type Editor } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import {
  Undo2, Redo2, Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, Pilcrow,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, IndentIncrease, IndentDecrease,
  Quote, Code, Minus, Link2, Palette, Highlighter, Eraser,
} from 'lucide-react';

// Custom font-size mark built on TextStyle (TipTap has no built-in font size in v2).
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] };
  },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (element: HTMLElement) => element.style.fontSize || null,
          renderHTML: (attributes: { fontSize?: string | null }) =>
            attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: (size: string) => ({ chain }) => chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize: () => ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

const EDITOR_CLASS = `w-full px-3 py-2 min-h-[140px] focus:outline-none
  [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through
  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-2
  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-1.5
  [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-1
  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1
  [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-2
  [&_pre]:bg-gray-100 [&_pre]:rounded [&_pre]:p-2 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:my-1 [&_pre]:whitespace-pre-wrap
  [&_a]:text-blue-600 [&_a]:underline
  [&_hr]:border-gray-300 [&_hr]:my-2`;

const FONT_SIZES = [
  { label: 'Small', value: '0.875rem' },
  { label: 'Normal', value: '1rem' },
  { label: 'Large', value: '1.25rem' },
  { label: 'X-Large', value: '1.5rem' },
  { label: 'XX-Large', value: '2rem' },
];

function Sep() {
  return <div className="w-px h-5 bg-gray-300 mx-0.5 shrink-0" />;
}

function Btn({ title, onClick, active, children }: { title: string; onClick: () => void; active?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded hover:bg-gray-200 transition-colors flex items-center justify-center shrink-0 ${active ? 'bg-gray-200 text-[#ed2a10]' : 'text-gray-700'}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const insertLink = () => {
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setLinkUrl('');
    setShowLinkInput(false);
  };

  return (
    <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      {/* History */}
      <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 size={14} /></Btn>
      <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 size={14} /></Btn>
      <Sep />

      {/* Text style */}
      <Btn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={14} /></Btn>
      <Btn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={14} /></Btn>
      <Btn title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={14} /></Btn>
      <Btn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={14} /></Btn>
      <Btn title="Subscript" active={editor.isActive('subscript')} onClick={() => editor.chain().focus().toggleSubscript().run()}><span className="text-xs font-medium leading-none">x<sub>2</sub></span></Btn>
      <Btn title="Superscript" active={editor.isActive('superscript')} onClick={() => editor.chain().focus().toggleSuperscript().run()}><span className="text-xs font-medium leading-none">x<sup>2</sup></span></Btn>
      <Sep />

      {/* Font size */}
      <select
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => {
          const v = e.target.value;
          if (v === '1rem' || v === '') editor.chain().focus().unsetFontSize().run();
          else editor.chain().focus().setFontSize(v).run();
          (e.target as HTMLSelectElement).value = '';
        }}
        defaultValue=""
        title="Font size"
        className="text-xs border border-gray-300 rounded px-1 py-1 bg-white text-gray-700 cursor-pointer h-7"
      >
        <option value="" disabled>Size</option>
        {FONT_SIZES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
      </select>
      <Sep />

      {/* Headings */}
      <Btn title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={14} /></Btn>
      <Btn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={14} /></Btn>
      <Btn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={14} /></Btn>
      <Btn title="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}><Pilcrow size={14} /></Btn>
      <Sep />

      {/* Alignment */}
      <Btn title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft size={14} /></Btn>
      <Btn title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter size={14} /></Btn>
      <Btn title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight size={14} /></Btn>
      <Btn title="Justify" active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}><AlignJustify size={14} /></Btn>
      <Sep />

      {/* Lists & indent */}
      <Btn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={14} /></Btn>
      <Btn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={14} /></Btn>
      <Btn title="Indent" onClick={() => editor.chain().focus().sinkListItem('listItem').run()}><IndentIncrease size={14} /></Btn>
      <Btn title="Outdent" onClick={() => editor.chain().focus().liftListItem('listItem').run()}><IndentDecrease size={14} /></Btn>
      <Sep />

      {/* Blocks */}
      <Btn title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={14} /></Btn>
      <Btn title="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code size={14} /></Btn>
      <Btn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={14} /></Btn>
      <Sep />

      {/* Link */}
      <div className="relative">
        <Btn
          title="Insert link"
          active={editor.isActive('link')}
          onClick={() => {
            setLinkUrl(editor.getAttributes('link').href ?? '');
            setShowLinkInput(v => !v);
          }}
        ><Link2 size={14} /></Btn>
        {showLinkInput && (
          <div className="absolute top-9 left-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex gap-2 items-center min-w-[230px]">
            <input
              autoFocus
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') insertLink(); if (e.key === 'Escape') setShowLinkInput(false); }}
              placeholder="https://..."
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button type="button" onClick={insertLink} className="bg-[#ed2a10] text-white px-2 py-1 rounded text-sm hover:bg-[#d42610] shrink-0">
              {linkUrl ? 'Add' : 'Remove'}
            </button>
          </div>
        )}
      </div>
      <Sep />

      {/* Color */}
      <label title="Font color" className="p-1.5 rounded hover:bg-gray-200 cursor-pointer flex items-center justify-center relative" onMouseDown={(e) => e.preventDefault()}>
        <Palette size={14} className="text-gray-700" />
        <input type="color" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()} />
      </label>
      <label title="Highlight color" className="p-1.5 rounded hover:bg-gray-200 cursor-pointer flex items-center justify-center relative" onMouseDown={(e) => e.preventDefault()}>
        <Highlighter size={14} className="text-gray-700" />
        <input type="color" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" onInput={(e) => editor.chain().focus().toggleHighlight({ color: (e.target as HTMLInputElement).value }).run()} />
      </label>
      <Sep />

      {/* Clear */}
      <Btn title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><Eraser size={14} /></Btn>
    </div>
  );
}

export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    editorProps: {
      attributes: { class: EDITOR_CLASS },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sync when the value changes from outside (e.g. loading an existing course),
  // but never while the user is actively typing.
  useEffect(() => {
    if (editor && !editor.isFocused && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  return (
    <div className="border border-gray-300 rounded-lg font-['DM_Sans',sans-serif]">
      {editor && <Toolbar editor={editor} />}
      <div className="relative">
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="bg-gray-900 rounded-lg shadow-xl flex items-center gap-0.5 px-1.5 py-1">
              <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }} className="p-1.5 rounded hover:bg-gray-700 text-white transition-colors"><Bold size={13} /></button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }} className="p-1.5 rounded hover:bg-gray-700 text-white transition-colors"><Italic size={13} /></button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }} className="p-1.5 rounded hover:bg-gray-700 text-white transition-colors"><UnderlineIcon size={13} /></button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }} className="p-1.5 rounded hover:bg-gray-700 text-white transition-colors"><Strikethrough size={13} /></button>
              <div className="w-px h-4 bg-gray-600 mx-0.5" />
              <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }} className="p-1.5 rounded hover:bg-gray-700 text-white transition-colors"><List size={13} /></button>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }} className="p-1.5 rounded hover:bg-gray-700 text-white transition-colors"><ListOrdered size={13} /></button>
            </div>
          </BubbleMenu>
        )}
        {editor?.isEmpty && (
          <span className="absolute top-2 left-3 text-gray-400 text-sm pointer-events-none select-none">
            Write lesson content here...
          </span>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
