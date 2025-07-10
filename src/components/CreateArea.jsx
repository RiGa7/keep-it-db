import React, { useState } from "react";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Zoom from '@mui/material/Zoom';
import Fade from '@mui/material/Fade';

function CreateArea(props) {
  const [note, setNote] = useState({ title: "", content: "" });
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  function handleCheck() {
    setChecked((prev) => !prev);
  };

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "content" && error) {
      setError("");
    }

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote(event) {
    event.preventDefault();

    const trimmedContent = note.content.trim();
    if (!trimmedContent) {
      setError("Note content cannot be empty");
      return;
    }

    setError("");
    props.onAdd({ ...note, content: trimmedContent });
    setNote({ title: "", content: "" });
  }

  return (
    <div className="create-area-container">
      <form className="create-note">
        {/* Error message inside form */}
        {error && (
          <Fade in={!!error}>
            <div className="error">{error}</div>
          </Fade>
        )}

        {checked && (
          <Fade in={checked}>
            <input
              name="title"
              onChange={handleChange}
              value={note.title}
              placeholder="Title"
            />
          </Fade>
        )}

        <textarea
          onClick={() => {
            setChecked(true);
            setError(""); 
          }}
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={checked ? 3 : 1}
        />

        <Zoom in={checked}>
          <Fab onClick={submitNote}><AddIcon /></Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;