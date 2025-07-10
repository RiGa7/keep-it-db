import React, { useState, useEffect } from "react";
import Header from "./Header";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5000/notes";

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }
        
        setNotes(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError(error.message);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const addNote = async (newNote) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add note");
      }
      
      const data = await response.json();
      setNotes(prevNotes => [data, ...prevNotes]);
    } catch (error) {
      console.error("Error adding note:", error.message);
    }
  };

  const editNote = async (id, updatedNote) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote)
      });
      const data = await response.json();
      setNotes(prevNotes => prevNotes.map(note => (note.id === id ? data : note)));
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      
      {loading && <div className="loading">Loading notes...</div>}
      
      {error && (
        <div className="error">
          Error: {error}
          <br />
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
      
      <div className="notes-grid">
        {!loading && !error && notes.length === 0 && (
          <div className="empty">No notes found. Create your first note!</div>
        )}
        
        {!loading && !error && notes.length > 0 && notes.map((noteItem) => (
          <Note
            key={noteItem.id}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
            onEdit={editNote}
          />
        ))}
      </div>
    </div>
  );
}

export default App;