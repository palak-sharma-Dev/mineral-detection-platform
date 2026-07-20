"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { notifyWorkflowUpdated, uploadApiFile } from "@/lib/api";

interface UploadResponse {
  uploadId: string;
  originalFileName: string;
  uploadStatus: string;
  predictionStatus: string;
  jobId?: string;
  aiUnavailable?: boolean;
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const reservedCards = [
  {
    title: "Prediction",
    value: "Model Integration Pending",
    description: "Prediction output will appear after the AI model is connected.",
  },
  {
    title: "Confidence Score",
    value: "Unavailable",
    description: "Confidence scoring is reserved for validated model responses.",
  },
  {
    title: "Processing Status",
    value: "Upload Ready",
    description: "Upload processing is available. Model inference is disabled.",
  },
  {
    title: "Expert Review",
    value: "Not Started",
    description: "Expert review begins after model results are available.",
  },
];

export default function AnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState("Model Integration Pending");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastUpload, setLastUpload] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const selectedFileMeta = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return `${selectedFile.name} - ${formatFileSize(selectedFile.size)}`;
  }, [selectedFile]);

  const previewUrl = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const setFile = (file?: File) => {
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Upload a JPG or PNG mineral image.");
      return;
    }

    setSelectedFile(file);
    setAnalysisStatus("Model Integration Pending");
    setUploadProgress(0);
    setLastUpload(null);
    setError(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setFile(event.dataTransfer.files?.[0]);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Select an image before uploading.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setUploadProgress(0);
    setAnalysisStatus("Uploading image.");
    setLastUpload(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const uploadResponse = await uploadApiFile<UploadResponse>("/upload", formData, {
        onProgress: (progress) => {
          setUploadProgress(progress);
          setAnalysisStatus(`Uploading image (${progress}%).`);
        },
      });

      const upload = uploadResponse.data ?? null;
      setLastUpload(upload);
      setAnalysisStatus(upload ? `Upload ${titleCase(upload.uploadStatus)}. Model Integration Pending.` : "Upload completed. Model Integration Pending.");
      notifyWorkflowUpdated();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image");
      setAnalysisStatus("Upload failed. Model Integration Pending.");
      notifyWorkflowUpdated();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard allowedRoles={["customer"]}>
      <SidebarLayout>
        <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-50 sm:px-6 lg:px-8">
          <Container>
            <Breadcrumbs items={[{ href: "/dashboard", label: "Dashboard" }, { label: "Analysis" }]} />

            <div className="mx-auto mt-6 max-w-7xl">
              <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.3)] sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--secondary)]">
                      AI Workspace
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      Mineral Image Analysis
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
                      Upload mineral imagery for the workspace queue. Model inference actions remain disabled until the AI model is connected.
                    </p>
                  </div>

                  <div className="rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-200">
                    Model Integration Pending
                  </div>
                </div>
              </section>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
                  <div className="flex flex-col gap-5">
                    <div>
                      <h2 className="text-xl font-semibold text-white">Image Upload</h2>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        Drag and drop a JPG or PNG image, or browse from your device.
                      </p>
                    </div>

                    <label
                      htmlFor="mineral-image"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`flex min-h-[18rem] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed p-6 text-center transition ${
                        isDragging
                          ? "border-[color:var(--primary)] bg-[color:var(--primary)]/10"
                          : "border-white/15 bg-zinc-950/70 hover:border-[color:var(--primary)]/50 hover:bg-white/[0.035]"
                      }`}
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-lg font-semibold text-[color:var(--primary)]">
                        UP
                      </span>
                      <span className="mt-5 text-base font-semibold text-white">Drop image here</span>
                      <span className="mt-2 text-sm text-zinc-500">JPG and PNG supported</span>
                      <input
                        id="mineral-image"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>

                    {selectedFileMeta ? (
                      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 text-sm text-zinc-300">
                        Selected: <span className="font-semibold text-white">{selectedFileMeta}</span>
                      </div>
                    ) : null}

                    {uploadProgress > 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
                        <div className="flex items-center justify-between text-xs text-zinc-500">
                          <span>Upload progress</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--secondary)] transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : null}

                    {error ? <p className="text-sm font-medium text-[color:var(--error)]">{error}</p> : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Button type="button" onClick={() => void handleUpload()} disabled={isSubmitting || !selectedFile}>
                        {isSubmitting ? "Uploading" : "Upload Image"}
                      </Button>
                      <button
                        type="button"
                        disabled
                        className="rounded-[0.5rem] border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-zinc-500"
                      >
                        Run Prediction Disabled
                      </button>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
                  <h2 className="text-xl font-semibold text-white">Preview</h2>
                  <p className="mt-2 text-sm text-zinc-500">Selected imagery appears here before upload.</p>

                  <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Selected mineral upload preview" className="h-[24rem] w-full object-contain" />
                    ) : (
                      <div className="flex h-[24rem] flex-col items-center justify-center p-8 text-center">
                        <span className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                          No Image Selected
                        </span>
                        <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
                          Upload preview is reserved for the selected mineral image. No predictions are shown until a model is connected.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {reservedCards.map((card) => (
                  <div key={card.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{card.title}</p>
                    <p className="mt-4 text-lg font-semibold text-white">{card.value}</p>
                    <p className="mt-3 text-sm leading-6 text-zinc-500">{card.description}</p>
                  </div>
                ))}
              </section>

              <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
                <h2 className="text-xl font-semibold text-white">Workspace Status</h2>
                <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
                  <p className="text-sm font-semibold text-white">{analysisStatus}</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    The image upload workflow is available. Prediction, confidence scoring and expert review are reserved until model integration is complete.
                  </p>
                  {lastUpload ? (
                    <div className="mt-5 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
                      <span>Upload: {lastUpload.originalFileName}</span>
                      <span>Status: {titleCase(lastUpload.uploadStatus)}</span>
                      <span>Prediction: Model Pending</span>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          </Container>
        </div>
      </SidebarLayout>
    </AuthGuard>
  );
}
