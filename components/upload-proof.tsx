"use client";

import { useRef, useState } from "react";
import { Camera, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadProof({
  onUpload,
  disabled,
}: {
  onUpload?: (url: string) => void;
  disabled?: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadToLocal = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data.url;
  };

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) return;

    setFile(selectedFile);

    try {
      const url = await uploadToLocal(selectedFile);

      console.log("Uploaded:", url);

      onUpload?.(url);
    } catch (err) {
      console.error(err);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0]);
        }}
      />

      <div
        onDragOver={(e) => !disabled && e.preventDefault()}
        onDrop={disabled ? undefined : onDrop}
        onClick={disabled ? undefined : openFilePicker}
        className={`border-2 border-dashed border-purple-300 rounded-2xl 
    p-8 text-center transition 
    bg-muted/30 backdrop-blur-md
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-purple-50"}
  `}
      >
        {!file ? (
          <>
            <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag & drop image here
            </p>
          </>
        ) : (
          <div className="space-y-3">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="rounded-xl max-h-48 mx-auto object-cover"
            />

            <div className="flex justify-center gap-3">
              <Button size="sm" onClick={openFilePicker} disabled={disabled}>
                Change
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => setFile(null)}
                disabled={disabled}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
