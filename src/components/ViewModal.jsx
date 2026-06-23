function ViewModal({ note, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-secondary w-full max-w-2xl rounded-xl p-6 shadow-md">

        <div className="flex items-start justify-between mb-4">

          <h2 className="text-2xl font-bold text-white">
            {note.title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>

        </div>

        <div className="max-h-[70vh] overflow-y-auto">

          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {note.content}
          </p>

        </div>

      </div>

    </div>
  );
}

export default ViewModal;