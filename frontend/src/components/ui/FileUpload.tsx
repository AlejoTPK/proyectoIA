import React, { useCallback, useState } from "react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

interface FileUploadProps {
  onUpload: (file: File) => void;
  loading?: boolean;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  loading = false,
  accept = ".pdf,.txt",
}) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    if (selectedFile && !loading) {
      onUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div className="w-full max-w-[480px] flex flex-col gap-6">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative group flex flex-col items-center justify-center gap-3 p-12 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center",
          dragging
            ? "border-[#0066cc] bg-[#0066cc]/5 scale-[1.02]"
            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
        )}
      >
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-transform duration-300",
          dragging ? "scale-110" : "group-hover:scale-110"
        )}>
          {selectedFile ? "📄" : "☁️"}
        </div>
        
        <div className="space-y-1">
          <p className="font-display text-[17px] font-semibold text-ink">
            {selectedFile ? selectedFile.name : "Subir archivos"}
          </p>
          <p className="text-[14px] text-gray-500">
            {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Arrastra un PDF o TXT aquí"}
          </p>
        </div>

        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
      </label>

      {selectedFile && (
        <div className="flex justify-center animate-in fade-in slide-in-from-top-2">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full max-w-[200px]"
          >
            {loading ? "Indexando..." : "Indexar ahora"}
          </Button>
        </div>
      )}
    </div>
  );
};
