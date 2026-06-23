function Note(props) {
  function handleEdit() {
    props.onEditClick({
      id: props.id,
      title: props.title,
      content: props.content,
      label: props.label,
      label_color: props.label_color,
    });
  }

  // Determine styles for the label chip based on whether a custom color is set
  const labelStyle = props.label_color
    ? {
      backgroundColor: `${props.label_color}10`, // 20% opacity hex
      borderColor: `${props.label_color}20`,
      color: props.label_color,
    }
    : {};

  return (
    <div
      onClick={handleEdit}
      className="group relative bg-secondary border border-tertiary rounded-xl py-4 px-3 hover:shadow-sm hover:scale-102 transition-all duration-200 flex flex-col min-h-[220px] cursor-pointer"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">

          {/* Label chip */}
          {props.label && (
            <span
              className={`inline-block text-xs font-medium border rounded-full px-2.5 py-0.5 mb-2 ${!props.label_color ? "text-white border-white/50 bg-white/10" : ""
                }`}
              style={labelStyle}
            >
              {props.label}
            </span>
          )}

          <h1 className="text-xl font-semibold text-white mb-3 break-words">
            {props.title}
          </h1>

          <div
            className="note-content prose prose-invert max-w-none text-gray-300 leading-relaxed line-clamp-10"
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        </div>
      </div>
    </div>
  );
}

export default Note;