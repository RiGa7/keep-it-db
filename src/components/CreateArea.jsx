import { useState, useRef, useEffect, useCallback } from "react";
import Editor from "./Editor";
import LabelPicker from "./LabelPicker";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Zoom from "@mui/material/Zoom";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";

function CreateArea({ onAdd, existingLabels = [] }) {
  const [note, setNote] = useState({ title: "", content: "", label: "", label_color: "" });
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const formRef = useRef(null);

  function handleContentChange(html) {
    if (error) setError("");
    setNote((prev) => ({ ...prev, content: html }));
  }

  const handleSave = useCallback(() => {
    const temp = document.createElement("div");
    temp.innerHTML = note.content;
    const text = temp.textContent || temp.innerText || "";

    // If both title and text are empty, just close it without saving.
    if (!text.trim() && !note.title.trim()) {
      setChecked(false);
      setShowToolbar(false);
      setShowLabel(false);
      setError("");
      return;
    }

    if (!text.trim()) {
      setError("Note content cannot be empty");
      return;
    }

    onAdd({ ...note });

    setNote({ title: "", content: "", label: "", label_color: "" });
    setEditorKey((k) => k + 1);
    setChecked(false);
    setError("");
    setShowToolbar(false);
    setShowLabel(false);
  }, [note, onAdd]);

  function submitNote(event) {
    if (event) event.preventDefault();
    handleSave();
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        if (checked) {
          handleSave();
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [checked, handleSave]);

  return (
    <div className="flex justify-center lg:mt-10">
      <form ref={formRef} className="group relative w-full max-w-4xl bg-secondary border border-tertiary rounded-xl hover:shadow-lg transition-all duration-200 p-2 md:p-5">

        {error && (
          <Fade in={!!error}>
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-400/30 rounded-lg px-4 py-2">
              {error}
            </div>
          </Fade>
        )}

        {checked && (
          <Fade in={checked}>
            <input
              name="title"
              value={note.title}
              onChange={(e) => setNote((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Title"
              className="w-full bg-transparent text-white text-xl font-semibold placeholder:text-gray-400 outline-none mb-4"
            />
          </Fade>
        )}

        {!checked ? (
          <div
            onClick={() => setChecked(true)}
            autoFocus
            className="text-gray-dark cursor-text py-1 select-none"
          >
            Take a note...
          </div>
        ) : (
          <Editor
          autofoucs
            key={editorKey}
            value={note.content}
            onChange={handleContentChange}
            showToolbar={showToolbar}
          />
        )}

        {checked && (
          <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-white/10">

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


          </div>
        )}

        {checked && showLabel && (
          <Fade in={checked && showLabel}>
            <div className="mt-3">
              <LabelPicker
                label={note.label}
                labelColor={note.label_color}
                onLabelChange={(text) => setNote((prev) => ({ ...prev, label: text }))}
                onColorChange={(color) => setNote((prev) => ({ ...prev, label_color: color }))}
                existingLabels={existingLabels}
              />
            </div>
          </Fade>
        )}

        <Zoom in={checked}>
          <Fab
            onClick={submitNote}
            size="medium"
            sx={{
              zIndex: 1,
              position: "absolute",
              right: 20,
              bottom: -20,
              backgroundColor: "#2bc7ae",
              color: "#222831",
              "&:hover": { backgroundColor: "#32E0C4" },
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>

      </form>
    </div>
  );
}

export default CreateArea;