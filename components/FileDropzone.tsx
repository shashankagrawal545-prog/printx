// FILE: apps/web/components/FileDropzone.tsx
// Drag-and-drop file input — accepts PDF, DOCX, JPG, PNG up to 25MB

"use client";

import    { useRef, useState, DragEvent, ChangeEvent } from "react";

const ACCEPTED = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];
const MAX_MB = 25;

interface Props {
  onFileAccepted:   (file: File) => void;
  file: File | null;
  uploading: boolean;
}

export default function FileDropzone({ onFileAccepted, file, uploading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [validationError, setValidationError] = useState("");

  const validate = (f: File): string => {
    if (!ACCEPTED.includes(f.type)) return "Unsupported file type. Use PDF, DOCX, JPG or PNG.";
    if (f.size > MAX_MB * 1024 * 1024) return `File too large. Max ${MAX_MB} MB.`;
    return "";
  };

  const handleFile = (f: File) => {
    const err = validate(f);
    if (err) { setValidationError(err); return; }
    setValidationError("");
    onFileAccepted(f);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  // Uploaded state
  if (file && !uploading) {
    return (
      <div className="border border-green-700/50 bg-green-900/10 rounded-xl p-4 flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-green-800/30 rounded-lg flex items-center justify-center text-green-400 text-xs font-bold">✓</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-green-300 truncate">{file.name}</p>
          <p className="text-xs text-green-700">{(file.size / 1024 / 1024).toFixed(2)} MB — uploaded</p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="text-xs text-[#6b6860] hover:text-[#e8642a] transition-colors shrink-0"
        >
          Replace
        </button>
        <input ref={inputRef} type="file" accept=".pdf,.docx,.jpg,.jpeg,.png" className="hidden" onChange={onInputChange} />
      </div>
    );
  }

  return (
    <div>
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all mb-2
          ${dragging ? "border-[#e8642a] bg-[#e8642a]/5" : "border-[#2e2c28] hover:border-[#e8642a]/50 bg-[#1a1916]"}
          ${uploading ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <div className="text-3xl mb-3 opacity-40">⬆</div>
        {uploading ? (
          <p className="text-sm text-[#a09c90]">Uploading…</p>
        ) : (
          <>
            <p className="text-sm text-[#a09c90] mb-1">Drop file here or <span className="text-[#e8642a]">browse</span></p>
            <p className="text-xs text-[#3d3b36]">PDF · DOCX · JPG · PNG — max 25 MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={onInputChange}
          disabled={uploading}
        />
      </div>
      {validationError && <p className="text-red-400 text-xs">{validationError}</p>}
    </div>
  );
}
