import { useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, 
  ImageIcon, Highlighter, List, ListOrdered, Quote 
} from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  fontClass: string;
}

export function Editor({ content, onChange, fontClass }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl shadow-md max-h-[500px] object-cover my-6 transition-all border border-stone-200 dark:border-slate-800',
        }
      }),
      Placeholder.configure({
        placeholder: 'Write your thoughts...',
        emptyEditorClass: 'before:content-[attr(data-placeholder)] before:float-left before:h-0 before:pointer-events-none before:text-stone-400 dark:before:text-slate-600 before:italic',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: `prose prose-stone dark:prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[500px] ${fontClass} prose-p:leading-loose prose-headings:${fontClass} prose-p:text-stone-700 dark:prose-p:text-slate-300 prose-headings:text-stone-900 dark:prose-headings:text-slate-100 prose-a:text-stone-600 dark:prose-a:text-indigo-400 prose-strong:text-stone-900 dark:prose-strong:text-slate-200 prose-blockquote:border-l-4 prose-blockquote:border-indigo-400 dark:prose-blockquote:border-indigo-500 prose-blockquote:bg-stone-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:font-normal prose-blockquote:not-italic prose-li:text-stone-700 dark:prose-li:text-slate-300 text-[17px] mark:bg-amber-200 dark:mark:bg-amber-500/40 dark:mark:text-slate-100`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor classes when fontClass changes
  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          attributes: {
            class: `prose prose-stone dark:prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[500px] ${fontClass} prose-p:leading-loose prose-headings:${fontClass} prose-p:text-stone-700 dark:prose-p:text-slate-300 prose-headings:text-stone-900 dark:prose-headings:text-slate-100 prose-a:text-stone-600 dark:prose-a:text-indigo-400 prose-strong:text-stone-900 dark:prose-strong:text-slate-200 prose-blockquote:border-l-4 prose-blockquote:border-indigo-400 dark:prose-blockquote:border-indigo-500 prose-blockquote:bg-stone-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:font-normal prose-blockquote:not-italic prose-li:text-stone-700 dark:prose-li:text-slate-300 text-[17px] mark:bg-amber-200 dark:mark:bg-amber-500/40 dark:mark:text-slate-100`,
          }
        }
      });
    }
  }, [fontClass, editor]);

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          editor?.chain().focus().setImage({ src: reader.result }).run();
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full relative">
      {editor && (
        <div className="sticky top-0 z-40 bg-stone-50/90 dark:bg-slate-950/90 backdrop-blur-md pb-4 pt-2 mb-4 border-b border-stone-200/50 dark:border-slate-800/50 flex items-center gap-1 flex-wrap">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg transition-all cursor-pointer ${editor.isActive('bold') ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800 hover:text-stone-800 dark:hover:text-slate-200'}`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg transition-all cursor-pointer ${editor.isActive('italic') ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800 hover:text-stone-800 dark:hover:text-slate-200'}`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded-lg transition-all cursor-pointer ${editor.isActive('strike') ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800 hover:text-stone-800 dark:hover:text-slate-200'}`}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 rounded-lg transition-all cursor-pointer ${editor.isActive('highlight') ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800 hover:text-stone-800 dark:hover:text-slate-200'}`}
            title="Highlight"
          >
            <Highlighter size={16} />
          </button>

          <div className="w-px h-5 bg-stone-300 dark:bg-slate-700 mx-1"></div>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded-lg transition-all cursor-pointer ${editor.isActive('heading', { level: 1 }) ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800 hover:text-stone-800 dark:hover:text-slate-200'}`}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-lg transition-all cursor-pointer ${editor.isActive('heading', { level: 2 }) ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800 hover:text-stone-800 dark:hover:text-slate-200'}`}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-lg transition-all cursor-pointer ${editor.isActive('blockquote') ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800 hover:text-stone-800 dark:hover:text-slate-200'}`}
            title="Blockquote"
          >
            <Quote size={16} />
          </button>

          <div className="w-px h-5 bg-stone-300 dark:bg-slate-700 mx-1"></div>
          
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg transition-all cursor-pointer ${editor.isActive('bulletList') ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800 hover:text-stone-800 dark:hover:text-slate-200'}`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-lg transition-all cursor-pointer ${editor.isActive('orderedList') ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold' : 'text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800 hover:text-stone-800 dark:hover:text-slate-200'}`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>

          <div className="w-px h-5 bg-stone-300 dark:bg-slate-700 mx-1"></div>
          
          <button
            onClick={addImage}
            className="p-2 rounded-lg transition-all cursor-pointer text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800 hover:text-stone-800 dark:hover:text-slate-200"
            title="Add Image"
          >
            <ImageIcon size={16} />
          </button>
        </div>
      )}
      
      <div className="w-full">
        <EditorContent editor={editor} />
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
