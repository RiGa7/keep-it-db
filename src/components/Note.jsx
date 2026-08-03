import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

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
      draggable
      onDragStart={props.onDragStart}
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
      onDragEnd={props.onDragEnd}
      className="group relative bg-secondary rounded-xl p-2 md:py-4 md:px-3 hover:shadow-lg border border-secondary hover:border-tertiary transition-all duration-200 flex flex-col min-h-[220px] cursor-pointer"
    >
      {/* Drag handle — visible on hover */}
      <div
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity duration-150 cursor-grab active:cursor-grabbing text-gray-400"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DragIndicatorIcon style={{ fontSize: 18 }} />
      </div>

      <div className="flex flex-col h-full">
        <div className="flex-1">

          {/* Label chip */}
          {props.label && (
            <span
              className={`inline-block text-xs font-medium border rounded-full px-2.5 py-0.5 mb-2 ${!props.label_color ? "text-white border-white/50 bg-white/20" : ""
                }`}
              style={labelStyle}
            >
              {props.label}
            </span>
          )}

          <h1 className="text-xl font-semibold text-white md:mb-3 break-words">
            {props.title}
          </h1>

          <div
            className="text-xs md:text-md note-content prose prose-invert max-w-none text-gray-300 leading-relaxed line-clamp-10"
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        </div>
      </div>
    </div>
  );
}

export default Note;