import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";

import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';

const ToolbarBtn = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault(); // prevent editor losing focus
      onClick();
    }}
    title={title}
    className={`
      px-1.5 py-0.5 rounded text-xs md:text-sm font-medium transition-all duration-150
      ${active
        ? "bg-accent/20 text-accent"
        : "text-gray-400 hover:text-white hover:bg-white/10"
      }
    `}
  >
    {children}
  </button>
);

export default function Editor({ value, onChange, showToolbar }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: "Take a note..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col">
      <EditorContent
        editor={editor}
        className="max-h-[60vh] overflow-y-auto scrollbar text-white"
      />
      {showToolbar && (
        <div className="flex flex-wrap gap-1 px-1 pt-2 border-t border-tertiary mt-1">
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <FormatBoldIcon className="text-[18px]! md:text-[24px]!" />
          </ToolbarBtn>

          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <FormatItalicIcon className="text-[18px]! md:text-[24px]!" />
          </ToolbarBtn>

          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <FormatStrikethroughIcon className="text-[18px]! md:text-[24px]!" />
          </ToolbarBtn>

          <div className="w-px bg-tertiary mx-1 self-stretch" />


          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarBtn>

          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarBtn>

          <div className="w-px bg-tertiary mx-1 self-stretch" />

          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <FormatListBulletedOutlinedIcon className="text-[18px]! md:text-[24px]!" />
          </ToolbarBtn>

          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <FormatListNumberedOutlinedIcon className="text-[18px]! md:text-[24px]!" />
          </ToolbarBtn>

          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            active={editor.isActive("taskList")}
            title="Checklist"
          >
            <ChecklistOutlinedIcon className="text-[18px]! md:text-[24px]!" />
          </ToolbarBtn>

          <div className="w-px bg-tertiary mx-1 self-stretch" />

          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline Code"
          >
            {"</>"}
          </ToolbarBtn>

          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <FormatQuoteIcon className="text-[18px]! md:text-[24px]!" />
          </ToolbarBtn>
        </div>
      )}

    </div>
  );
}