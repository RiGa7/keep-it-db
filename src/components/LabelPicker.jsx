import { useState, useRef, useEffect } from "react";

export const LABEL_COLORS = [
  { name: "Pastel Red", value: "#D25353" },
  { name: "Pastel Pink", value: "#FDACAC" },
  { name: "Pastel Blue", value: "#789DBC" },
  { name: "Pastel Green", value: "#B1D3B9" },
  { name: "Pastel Yellow", value: "#F0F8A4" },
  { name: "Pastel Sage", value: "#95F7AC" },
  { name: "Pastel Purple", value: "#A294F9" },
  { name: "Pastel Brown", value: "#A7727D" },
];

/**
 * Renders a label text input + color swatch picker.
 *
 * Props:
 *   label        {string}  - current label text
 *   labelColor   {string}  - current hex color (or "")
 *   onLabelChange(text)
 *   onColorChange(hexOrEmpty)
 *   existingLabels {array} - list of existing labels to suggest
 */
export default function LabelPicker({ label, labelColor, onLabelChange, onColorChange, existingLabels = [] }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = label 
    ? existingLabels
        .filter((l) => l.name.toLowerCase().startsWith(label.toLowerCase()) && l.name.toLowerCase() !== label.toLowerCase())
        .slice(0, 4)
    : [];

  return (
    <div className="flex flex-col gap-1 pt-2 border-t border-tertiary" ref={wrapperRef}>

      {/* Text row */}
      <div className="flex items-center gap-2 relative">
        {/* Dot preview */}
        <span
          className="w-3 h-3 rounded-full shrink-0 border border-white/10 transition-colors duration-200"
          style={{ backgroundColor: labelColor || "#4a4f58" }}
        />
        <input
          value={label}
          onChange={(e) => {
            const val = e.target.value;
            onLabelChange(val);
            setShowSuggestions(true);
            if (val.trim() === "") {
              onColorChange("");
            } else {
              const match = existingLabels.find(
                (l) => l.name.toLowerCase() === val.trim().toLowerCase()
              );
              if (match) {
                onColorChange(match.color || "");
              }
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Add label or group..."
          className="flex-1 bg-transparent text-sm text-gray-100 placeholder:text-gray-dark outline-none"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-2 top-4 mt-1 w-48 bg-tertiary border border-tertiary rounded-lg shadow-xl z-10 overflow-hidden">
            {suggestions.map((s) => (
              <button
                key={s.name}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-2"
                onClick={() => {
                  onLabelChange(s.name);
                  onColorChange(s.color || "");
                  setShowSuggestions(false);
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color || "#4a4f58" }}
                />
                <span className="truncate">{s.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color swatches */}
      <div className="flex items-center gap-1.5 flex-wrap pl-5">
        {LABEL_COLORS.map(({ name, value }) => {
          const isActive = labelColor === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onColorChange(isActive ? "" : value)}
              title={name}
              className="w-2.5 h-2.5 md:w-5 md:h-5 rounded-full transition-all duration-150 hover:scale-125 focus:outline-none"
              style={{
                backgroundColor: value,
                boxShadow: isActive ? `0 0 0 2px #222831, 0 0 0 3.5px ${value}` : "none",
                transform: isActive ? "scale(1.15)" : undefined,
              }}
            />
          );
        })}

        {/* Clear color */}
        {labelColor && (
          <button
            type="button"
            onClick={() => onColorChange("")}
            title="Remove color"
            className="w-6 h-6 rounded-full border border-tertiary text-gray-dark text-[10px] flex items-center justify-center hover:border-danger hover:text-danger transition-colors duration-150"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
