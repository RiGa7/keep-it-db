import { useEffect, useState } from 'react'
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import EditModal from "../components/EditModal";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api"

function Home() {
    const { token, logout } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingNote, setEditingNote] = useState(null);
    const [error, setError] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState("");


    const authHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${API_URL}/notes`, {
                    headers: { "Authorization": `Bearer ${token}` },
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        logout();
                        return;
                    }
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
    }, [token]);

    const addNote = async (newNote) => {
        try {
            const response = await fetch(`${API_URL}/notes`, {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify(newNote),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add note");
            }

            const data = await response.json();
            setNotes((prevNotes) => {
                const updated = [data, ...prevNotes];
                if (data.label) {
                    return updated.map((note) => {
                        if (note.id !== data.id && note.label === data.label) {
                            return { ...note, label_color: data.label_color };
                        }
                        return note;
                    });
                }
                return updated;
            });

        } catch (error) {
            console.error("Error adding note:", error.message);
        }
    };

    const editNote = async (id, updatedNote) => {
        try {
            const response = await fetch(`${API_URL}/notes/${id}`, {
                method: "PUT",
                headers: authHeaders,
                body: JSON.stringify(updatedNote),
            });

            const data = await response.json();

            setNotes((prevNotes) =>
                prevNotes.map((note) => {
                    if (note.id === id) {
                        return data;
                    }
                    if (data.label && note.label === data.label) {
                        return { ...note, label_color: data.label_color };
                    }
                    return note;
                })
            );

        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    const deleteNote = async (id) => {
        try {
            await fetch(`${API_URL}/notes/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });

            setNotes((prevNotes) =>
                prevNotes.filter((note) => note.id !== id)
            );

            // Close modal if the deleted note was open
            if (editingNote?.id === id) {
                setEditingNote(null);
            }

        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const labels = Object.values(notes.reduce((acc, note) => {
        if (note.label) {
            if (!acc[note.label]) {
                acc[note.label] = { name: note.label, color: note.label_color };
            } else if (!acc[note.label].color && note.label_color) {
                acc[note.label].color = note.label_color;
            }
        }
        return acc;
    }, {}));

    const filteredNotes = selectedLabel ? notes.filter(n => n.label === selectedLabel) : notes;

    return (
        <section className="min-h-screen flex bg-primary bg-[url('https://www.transparenttextures.com/patterns/inspiration-geometry.png')]">

            <Sidebar labels={labels} selectedLabel={selectedLabel} onSelectLabel={setSelectedLabel} />
            <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pb-10">



                <CreateArea onAdd={addNote} existingLabels={labels} />

                {loading && (
                    <div className="text-center text-white text-lg mt-10">
                        Loading notes...
                    </div>
                )}

                {error && (
                    <div className="max-w-md mx-auto mt-10 bg-red-500/10 border border-red-400 text-red-400 rounded-xl p-5 text-center">
                        <p className="mb-4">Error: {error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-2 rounded-lg bg-accent text-primary font-semibold hover:scale-105 transition-transform"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && filteredNotes.length === 0 && (
                    <div className="text-center text-accent text-lg mt-16">
                        No notes found. Create your first note!
                    </div>
                )}

                {!loading && !error && filteredNotes.length > 0 && (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 mt-10">
                        {filteredNotes.map((noteItem) => (
                            <Note
                                key={noteItem.id}
                                id={noteItem.id}
                                title={noteItem.title}
                                content={noteItem.content}
                                label={noteItem.label}
                                label_color={noteItem.label_color}
                                onDelete={deleteNote}
                                onEdit={editNote}
                                onEditClick={setEditingNote}
                            />
                        ))}
                    </div>
                )}

            </main>

            {editingNote && (
                <EditModal
                    note={editingNote}
                    onClose={() => setEditingNote(null)}
                    onSave={editNote}
                    onDelete={deleteNote}
                    existingLabels={labels}
                />
            )}

        </section>
    )
}

export default Home