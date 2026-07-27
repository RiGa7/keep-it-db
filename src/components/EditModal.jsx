import { useState, useEffect } from "react";
import Editor from "./Editor";
import LabelPicker from "./LabelPicker";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";

function EditModal({ note, onClose, onSave, onDelete, existingLabels = [] }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [label, setLabel] = useState(note.label || "");
  const [labelColor, setLabelColor] = useState(note.label_color || "");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  // Auto-save with 1s debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave(note.id, { title, content, label, label_color: labelColor });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [title, content, label, labelColor]);

  function handleDeleteClick() {
    setShowDeleteModal(true);
  }

  function confirmDeleteAction() {
    onDelete(note.id);
    onClose();
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="group w-full max-w-4xl bg-secondary rounded-xl shadow-2xl border border-tertiary"
      >

        {/* Note body */}
        <div className="p-2 md:p-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent text-white text-xl font-semibold placeholder:text-gray-400 outline-none mb-4"
          />

          <Editor value={content} onChange={setContent} showToolbar={showToolbar} />

          <div className="flex items-center justify-between gap-1 mt-1 pt-1 border-t border-white/10">

            <div className="flex items-center justify-end gap-1">
              <IconButton
                onClick={() => setShowToolbar(!showToolbar)}
                size="small"
                title="Formatting options"
                sx={{ color: showToolbar ? "#fff" : "#a3a2a2ff", transition: "color 0.2s", "&:hover": { color: "#f1f1f1ff", backgroundColor: "rgba(219, 219, 219, 0.1)" } }}
              >
                <FormatColorTextIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => setShowLabel(!showLabel)}
                size="small"
                title="Add label"
                sx={{ color: showLabel ? "#fff" : "#a3a2a2ff", transition: "color 0.2s", "&:hover": { color: "#f1f1f1ff", backgroundColor: "rgba(219, 219, 219, 0.1)" } }}
              >
                <LabelOutlinedIcon fontSize="small" />
              </IconButton>

            </div>
            <IconButton
              onClick={handleDeleteClick}
              size="small"
              title="Delete note"
              sx={{
                color: "#9ca3af",
                transition: "color 0.2s",
                "&:hover": { color: "#f87171", backgroundColor: "rgba(248,113,113,0.1)" },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>

          </div>

          {showLabel && (
            <Fade in={showLabel}>
              <div className="mt-1">
                <LabelPicker
                  label={label}
                  labelColor={labelColor}
                  onLabelChange={setLabel}
                  onColorChange={setLabelColor}
                  existingLabels={existingLabels}
                />
              </div>
            </Fade>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-primary p-6 rounded-xl border border-secondary shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200"
          >
            <p className="mb-6">Are you sure you want to delete this note? You won&apos;t be able to restore it later.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-secondary font-medium hover:bg-white/10 transition-colors"
              >
                No
              </button>
              <button
                onClick={confirmDeleteAction}
                className="px-4 py-0.5 rounded-lg border border-danger text-danger bg-gray font-medium hover:bg-danger/90 hover:text-white transition-all"
              >
                <span className="flex flex-col">
                  <span>Yes,</span>
                  <span className="text-xs">Delete this note</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditModal;