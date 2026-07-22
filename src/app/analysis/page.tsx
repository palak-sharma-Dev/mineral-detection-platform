"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { apiRequest, downloadApiFile, notifyWorkflowUpdated, uploadApiFile } from "@/lib/api";

interface UploadResponse {
  uploadId: string;
  originalFileName: string;
  uploadStatus: string;
  predictionStatus: string;
  jobId?: string;
  aiUnavailable?: boolean;
}

interface PredictionStatusData {
  uploadStatus: string;
  predictionStatus: string;
  jobId?: string;
  predictionError?: string;
}

interface PredictionResultData {
  prediction?: Record<string, unknown>;
  uploadStatus: string;
  predictionStatus: string;
  reportGenerated?: boolean;
}

interface ReportItem {
  _id: string;
  uploadId: string;
  reportStatus: string;
}

type PredictionPhase = "idle" | "uploading" | "processing" | "completed" | "failed" | "unavailable" | "timed_out";

const POLL_INTERVAL_MS = 10000;
const MAX_POLL_ATTEMPTS = 18;
const REPORT_LOOKUP_ATTEMPTS = 5;
const REPORT_LOOKUP_DELAY_MS = 2000;
const MAX_CONSECUTIVE_POLL_ERRORS = 3;

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parsePredictionResult(prediction?: Record<string, unknown>) {
  const detectedMinerals = Array.isArray(prediction?.detectedMinerals)
    ? (prediction.detectedMinerals as string[])
    : [];
  const confidenceScore =
    typeof prediction?.confidenceScore === "number" ? prediction.confidenceScore : undefined;
  const summary = typeof prediction?.summary === "string" ? prediction.summary : undefined;

  return { detectedMinerals, confidenceScore, summary };
}

function getStatusBadge(phase: PredictionPhase) {
  switch (phase) {
    case "uploading":
      return { label: "Uploading", className: "border-sky-400/25 bg-sky-400/10 text-sky-200" };
    case "processing":
      return { label: "Analyzing", className: "border-amber-400/25 bg-amber-400/10 text-amber-200" };
    case "completed":
      return { label: "Completed", className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200" };
    case "failed":
      return { label: "Failed", className: "border-red-400/25 bg-red-400/10 text-red-200" };
    case "unavailable":
      return { label: "Unavailable", className: "border-orange-400/25 bg-orange-400/10 text-orange-200" };
    case "timed_out":
      return { label: "Timed Out", className: "border-violet-400/25 bg-violet-400/10 text-violet-200" };
    default:
      return { label: "Ready", className: "border-white/15 bg-white/[0.06] text-zinc-300" };
  }
}

export default function AnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [predictionPhase, setPredictionPhase] = useState<PredictionPhase>("idle");
  const [analysisStatus, setAnalysisStatus] = useState("Upload a mineral image to begin analysis.");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastUpload, setLastUpload] = useState<UploadResponse | null>(null);
  const [predictionResult, setPredictionResult] = useState<ReturnType<typeof parsePredictionResult> | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const pollAbortRef = useRef(false);

  const isBusy = predictionPhase === "uploading" || predictionPhase === "processing";

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
      pollAbortRef.current = true;
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetPredictionState = () => {
    pollAbortRef.current = true;
    setPredictionPhase("idle");
    setAnalysisStatus("Upload a mineral image to begin analysis.");
    setUploadProgress(0);
    setLastUpload(null);
    setPredictionResult(null);
    setReportId(null);
    setError(null);
  };

  const setFile = (file?: File) => {
    if (!file || isBusy) {
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Upload a JPG or PNG mineral image.");
      return;
    }

    pollAbortRef.current = true;
    setSelectedFile(file);
    setPredictionPhase("idle");
    setAnalysisStatus("Image selected. Upload to start AI analysis.");
    setUploadProgress(0);
    setLastUpload(null);
    setPredictionResult(null);
    setReportId(null);
    setError(null);
  };

  const findReportForUpload = async (uploadId: string) => {
    for (let attempt = 0; attempt < REPORT_LOOKUP_ATTEMPTS; attempt += 1) {
      try {
        const response = await apiRequest<ReportItem[]>("/reports?limit=10");
        const report = (response.data ?? []).find((item) => String(item.uploadId) === String(uploadId));
        if (report) {
          setReportId(report._id);
          return;
        }
      } catch {
        // Report lookup is optional; Reports page remains available.
      }

      if (attempt < REPORT_LOOKUP_ATTEMPTS - 1) {
        await sleep(REPORT_LOOKUP_DELAY_MS);
      }
    }
  };

  const fetchPredictionResult = async (jobId: string) => {
    for (let attempt = 0; attempt < REPORT_LOOKUP_ATTEMPTS; attempt += 1) {
      const resultResponse = await apiRequest<PredictionResultData>(`/predict/result/${jobId}`);
      if (resultResponse.data?.prediction) {
        return resultResponse.data;
      }

      if (attempt < REPORT_LOOKUP_ATTEMPTS - 1) {
        await sleep(REPORT_LOOKUP_DELAY_MS);
      }
    }

    return null;
  };

  const pollPredictionJob = async (jobId: string, uploadId: string) => {
    pollAbortRef.current = false;
    setPredictionPhase("processing");
    setAnalysisStatus("Image uploaded. Running AI mineral analysis.");

    let consecutiveErrors = 0;

    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
      if (pollAbortRef.current) {
        return;
      }

      try {
        const statusResponse = await apiRequest<PredictionStatusData>(`/predict/status/${jobId}`);
        const statusData = statusResponse.data;

        if (!statusData) {
          throw new Error("Unable to read prediction status.");
        }

        if (statusData.predictionStatus === "completed") {
          const resultData = await fetchPredictionResult(jobId);

          if (!resultData?.prediction) {
            throw new Error("Analysis completed but no prediction data was returned.");
          }

          consecutiveErrors = 0;

          const parsed = parsePredictionResult(resultData.prediction);
          setPredictionResult(parsed);
          setPredictionPhase("completed");
          setAnalysisStatus("AI analysis completed successfully.");
          setLastUpload((current) =>
            current ? { ...current, predictionStatus: "completed", uploadStatus: "completed" } : current
          );
          await findReportForUpload(uploadId);
          notifyWorkflowUpdated();
          return;
        }

        if (statusData.predictionStatus === "failed") {
          setPredictionPhase("failed");
          setLastUpload((current) => (current ? { ...current, predictionStatus: "failed", uploadStatus: "failed" } : current));
          setError(statusData.predictionError ?? "AI analysis failed. Please try uploading again.");
          setAnalysisStatus("AI analysis failed.");
          notifyWorkflowUpdated();
          return;
        }

        setAnalysisStatus(
          `Analyzing image (${titleCase(statusData.predictionStatus)}). Attempt ${attempt + 1} of ${MAX_POLL_ATTEMPTS}.`
        );
      } catch (pollError) {
        if (pollAbortRef.current) {
          return;
        }

        consecutiveErrors += 1;
        if (consecutiveErrors < MAX_CONSECUTIVE_POLL_ERRORS && attempt < MAX_POLL_ATTEMPTS - 1) {
          setAnalysisStatus("Temporary connection issue while checking analysis status. Retrying...");
          await sleep(POLL_INTERVAL_MS);
          continue;
        }

        const message = pollError instanceof Error ? pollError.message : "Unable to check prediction status.";
        setPredictionPhase("failed");
        setError(message);
        setAnalysisStatus("AI analysis could not be completed.");
        notifyWorkflowUpdated();
        return;
      }

      if (attempt < MAX_POLL_ATTEMPTS - 1) {
        await sleep(POLL_INTERVAL_MS);
      }
    }

    setPredictionPhase("timed_out");
    setError("Analysis is taking longer than expected. Check History or Reports for updates.");
    setAnalysisStatus("Analysis timed out.");
    notifyWorkflowUpdated();
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
    if (!isBusy) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!selectedFile || isBusy) {
      if (!selectedFile) {
        setError("Select an image before uploading.");
      }
      return;
    }

    pollAbortRef.current = true;
    setError(null);
    setPredictionPhase("uploading");
    setUploadProgress(0);
    setAnalysisStatus("Uploading image.");
    setLastUpload(null);
    setPredictionResult(null);
    setReportId(null);

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

      if (!upload) {
        throw new Error("Upload completed but no response data was returned.");
      }

      if (upload.aiUnavailable || !upload.jobId) {
        setPredictionPhase("unavailable");
        setError(
          "Your image was uploaded, but the AI service is temporarily unavailable. Try again later or check History for status updates."
        );
        setAnalysisStatus("Upload saved. AI analysis unavailable.");
        notifyWorkflowUpdated();
        return;
      }

      notifyWorkflowUpdated();
      await pollPredictionJob(upload.jobId, upload.uploadId);
    } catch (uploadError) {
      setPredictionPhase("failed");
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image");
      setAnalysisStatus("Upload failed.");
      notifyWorkflowUpdated();
    }
  };

  const handleDownloadReport = async () => {
    if (!reportId) {
      return;
    }

    setIsDownloadingReport(true);
    try {
      await downloadApiFile(`/reports/${reportId}/download`, `report-${reportId}.json`);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Unable to download report");
    } finally {
      setIsDownloadingReport(false);
    }
  };

  const statusBadge = getStatusBadge(predictionPhase);

  const resultCards = [
    {
      title: "Detected Minerals",
      value: predictionResult?.detectedMinerals.length
        ? predictionResult.detectedMinerals.join(", ")
        : predictionPhase === "processing"
          ? "Analyzing..."
          : predictionPhase === "completed"
            ? "None detected"
            : "Awaiting analysis",
      description:
        predictionPhase === "completed"
          ? "Minerals identified by the AI model from your uploaded image."
          : "Mineral detection results appear after analysis completes.",
    },
    {
      title: "Confidence Score",
      value:
        typeof predictionResult?.confidenceScore === "number"
          ? `${predictionResult.confidenceScore}%`
          : predictionPhase === "processing"
            ? "Calculating..."
            : "Unavailable",
      description: "Model confidence for the detected mineral classification.",
    },
    {
      title: "Processing Status",
      value: titleCase(lastUpload?.predictionStatus ?? predictionPhase),
      description: analysisStatus,
    },
    {
      title: "Expert Review",
      value: predictionPhase === "completed" ? "Available Soon" : "Not Started",
      description: "Expert review can begin once AI analysis results are confirmed.",
    },
  ];

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
                      Upload mineral imagery to run AI detection. Results include detected minerals, confidence scoring,
                      and a downloadable report.
                    </p>
                  </div>

                  <div className={`rounded-full border px-4 py-2 text-sm font-semibold ${statusBadge.className}`}>
                    {statusBadge.label}
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
                      className={`flex min-h-[18rem] flex-col items-center justify-center rounded-3xl border border-dashed p-6 text-center transition ${
                        isBusy
                          ? "cursor-not-allowed border-white/10 bg-zinc-950/50 opacity-60"
                          : isDragging
                            ? "cursor-pointer border-[color:var(--primary)] bg-[color:var(--primary)]/10"
                            : "cursor-pointer border-white/15 bg-zinc-950/70 hover:border-[color:var(--primary)]/50 hover:bg-white/[0.035]"
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
                        disabled={isBusy}
                        onChange={handleFileChange}
                      />
                    </label>

                    {selectedFileMeta ? (
                      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 text-sm text-zinc-300">
                        Selected: <span className="font-semibold text-white">{selectedFileMeta}</span>
                      </div>
                    ) : null}

                    {uploadProgress > 0 && predictionPhase === "uploading" ? (
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

                    {predictionPhase === "processing" ? (
                      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                        <div className="flex items-center gap-3">
                          <div className="garud-loading-line h-1 w-16 rounded-full bg-amber-200/30" />
                          <p className="text-sm font-medium text-amber-100">AI analysis in progress...</p>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-amber-200/80">{analysisStatus}</p>
                      </div>
                    ) : null}

                    {error ? <p className="text-sm font-medium text-[color:var(--error)]">{error}</p> : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Button type="button" onClick={() => void handleUpload()} disabled={isBusy || !selectedFile}>
                        {predictionPhase === "uploading"
                          ? "Uploading..."
                          : predictionPhase === "processing"
                            ? "Analyzing..."
                            : "Upload & Analyze"}
                      </Button>
                      {predictionPhase === "completed" || predictionPhase === "failed" || predictionPhase === "timed_out" || predictionPhase === "unavailable" ? (
                        <Button type="button" variant="secondary" onClick={resetPredictionState}>
                          Start New Analysis
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-6">
                  <h2 className="text-xl font-semibold text-white">Preview & Results</h2>
                  <p className="mt-2 text-sm text-zinc-500">
                    {predictionPhase === "completed"
                      ? "Uploaded image and AI analysis summary."
                      : "Selected imagery appears here before and during analysis."}
                  </p>

                  <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Selected mineral upload preview" className="h-[24rem] w-full object-contain" />
                    ) : (
                      <div className="flex h-[24rem] flex-col items-center justify-center p-8 text-center">
                        <span className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                          No Image Selected
                        </span>
                        <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
                          Upload a mineral image to preview it here and view analysis results when ready.
                        </p>
                      </div>
                    )}
                  </div>

                  {predictionPhase === "completed" && predictionResult?.summary ? (
                    <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/80">Summary</p>
                      <p className="mt-3 text-sm leading-6 text-emerald-50">{predictionResult.summary}</p>
                    </div>
                  ) : null}

                  {predictionPhase === "completed" ? (
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      {reportId ? (
                        <Link
                          href={`/reports`}
                          className="inline-flex items-center justify-center rounded-[0.5rem] border border-[color:var(--primary)] bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--primary)]/90"
                        >
                          View Generated Report
                        </Link>
                      ) : (
                        <Link
                          href="/reports"
                          className="inline-flex items-center justify-center rounded-[0.5rem] border border-white/10 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.09]"
                        >
                          Go to Reports
                        </Link>
                      )}
                    </div>
                  ) : null}
                </section>
              </div>

              <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {resultCards.map((card) => (
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
                    Upload triggers automatic AI analysis. Results are saved to your history, snapshots, and reports.
                  </p>
                  {lastUpload ? (
                    <div className="mt-5 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
                      <span>Upload: {lastUpload.originalFileName}</span>
                      <span>Status: {titleCase(lastUpload.uploadStatus)}</span>
                      <span>Prediction: {titleCase(lastUpload.predictionStatus)}</span>
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
