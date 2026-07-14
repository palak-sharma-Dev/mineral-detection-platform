"use client";

import { ChangeEvent, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { apiRequest, notifyWorkflowUpdated, uploadApiFile } from "@/lib/api";

interface UploadResponse {
  uploadId: string;
  originalFileName: string;
  uploadStatus: string;
  predictionStatus: string;
  jobId?: string;
  aiUnavailable?: boolean;
}

interface PredictionStatusResponse {
  uploadStatus: string;
  predictionStatus: string;
  jobId?: string;
  predictionError?: string;
}

interface PredictionResultResponse {
  prediction?: unknown;
  uploadStatus?: string;
  predictionStatus: string;
  reportGenerated?: boolean;
}

interface ReportItem {
  _id: string;
  reportStatus: string;
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AnalysisPage() {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState("Waiting to start analysis.");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [reportStatus, setReportStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFileName(file ? file.name : null);
    setSelectedFile(file ?? null);
    setAnalysisStatus("Waiting to start analysis.");
    setAnalysisResult(null);
    setUploadProgress(0);
    setReportStatus(null);
    setError(null);
  };

  const pollPrediction = async (jobId: string) => {
    for (let attempt = 0; attempt < 36; attempt += 1) {
      const statusResponse = await apiRequest<PredictionStatusResponse>(`/predict/status/${jobId}`);
      const status = statusResponse.data;

      if (!status) {
        return;
      }

      setAnalysisStatus(`Prediction ${titleCase(status.predictionStatus)}.`);

      if (status.predictionStatus === "failed") {
        setError(status.predictionError ?? "Prediction failed");
        notifyWorkflowUpdated();
        return;
      }

      if (status.predictionStatus === "completed") {
        const resultResponse = await apiRequest<PredictionResultResponse>(`/predict/result/${jobId}`);
        setAnalysisResult(JSON.stringify(resultResponse.data?.prediction ?? {}, null, 2));
        setAnalysisStatus("Prediction Completed.");
        const reportsResponse = await apiRequest<ReportItem[]>("/reports?limit=1");
        const latestReport = reportsResponse.data?.[0];
        setReportStatus(latestReport ? `Report ${titleCase(latestReport.reportStatus)}.` : "Report generation pending.");
        notifyWorkflowUpdated();
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    setAnalysisStatus("Prediction is still running.");
    notifyWorkflowUpdated();
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) {
      setError("Select an image file before starting analysis");
      return;
    }

    setError(null);
    setAnalysisResult(null);
    setReportStatus(null);
    setIsSubmitting(true);
    setUploadProgress(0);
    setAnalysisStatus("Uploading image.");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const uploadResponse = await uploadApiFile<UploadResponse>("/upload", formData, {
        onProgress: (progress) => {
          setUploadProgress(progress);
          setAnalysisStatus(`Uploading image (${progress}%).`);
        },
      });

      const upload = uploadResponse.data;
      notifyWorkflowUpdated();
      setAnalysisStatus(upload ? `Prediction ${titleCase(upload.predictionStatus)}.` : "Upload completed.");

      if (upload?.aiUnavailable || !upload?.jobId) {
        setAnalysisStatus("Waiting for AI processing.");
        return;
      }

      if (upload?.jobId) {
        await pollPrediction(upload.jobId);
      }
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : "Unable to start analysis");
      setAnalysisStatus("Analysis failed.");
      notifyWorkflowUpdated();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard allowedRoles={["customer"]}>
      <main className="min-h-screen bg-[color:var(--background)] px-4 py-8 sm:px-6 lg:px-8">
        <Container>
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/dashboard", label: "Dashboard" }, { label: "Analysis" }]} />
          <div className="mx-auto max-w-4xl rounded-[0.75rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--card)] p-6 sm:p-8">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--foreground-secondary)]">
                Authenticated workflow
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">Analysis</h1>
            </div>

            <div className="space-y-5">
              <section className="rounded-[0.625rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--background)] p-5">
                <h2 className="text-base font-semibold text-[color:var(--foreground)]">Upload Mineral Image</h2>
                <label
                  htmlFor="mineral-image"
                  className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[0.625rem] border border-dashed border-[color:var(--foreground-muted)]/24 bg-[color:var(--card)] px-4 py-8 text-center transition hover:border-[color:var(--primary)]/40"
                >
                  <p className="text-sm font-medium text-[color:var(--foreground)]">Supported formats: JPG and PNG</p>
                  <p className="mt-2 text-sm text-[color:var(--foreground-secondary)]">
                    Select an image file to begin the analysis request.
                  </p>
                  <input
                    id="mineral-image"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                {selectedFileName ? (
                  <p className="mt-3 text-sm text-[color:var(--foreground)]">Selected file: {selectedFileName}</p>
                ) : null}
                {uploadProgress > 0 ? (
                  <div className="mt-3 h-2 overflow-hidden rounded-[0.5rem] bg-[color:var(--foreground-muted)]/12">
                    <div
                      className="h-full bg-[color:var(--primary)] transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                ) : null}
              </section>

              <section className="rounded-[0.625rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--background)] p-5">
                <h2 className="text-base font-semibold text-[color:var(--foreground)]">
                  Geographic Area / Coordinates
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-[color:var(--foreground)]">Latitude</span>
                    <input
                      type="text"
                      placeholder="Enter latitude"
                      className="w-full rounded-[0.5rem] border border-[color:var(--foreground-muted)]/16 bg-[color:var(--card)] px-3 py-2.5 text-[color:var(--foreground)] outline-none ring-0"
                    />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-[color:var(--foreground)]">Longitude</span>
                    <input
                      type="text"
                      placeholder="Enter longitude"
                      className="w-full rounded-[0.5rem] border border-[color:var(--foreground-muted)]/16 bg-[color:var(--card)] px-3 py-2.5 text-[color:var(--foreground)] outline-none ring-0"
                    />
                  </label>
                </div>
                <label className="mt-4 block space-y-2 text-sm">
                  <span className="font-medium text-[color:var(--foreground)]">Bounding Box</span>
                  <input
                    type="text"
                    placeholder="Enter bounding box"
                    className="w-full rounded-[0.5rem] border border-[color:var(--foreground-muted)]/16 bg-[color:var(--card)] px-3 py-2.5 text-[color:var(--foreground)] outline-none ring-0"
                  />
                </label>
              </section>

              <section className="rounded-[0.625rem] border border-[color:var(--foreground-muted)]/14 bg-[color:var(--background)] p-5">
                <h2 className="text-base font-semibold text-[color:var(--foreground)]">Analysis Status</h2>
                <div className="mt-4 rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--card)] px-4 py-4 text-sm text-[color:var(--foreground-secondary)]">
                  {analysisStatus}
                </div>
                {error ? (
                  <p className="mt-3 text-sm font-medium text-[color:var(--error)]">{error}</p>
                ) : null}
                {analysisResult ? (
                  <pre className="mt-3 overflow-x-auto rounded-[0.5rem] border border-[color:var(--foreground-muted)]/12 bg-[color:var(--card)] px-4 py-4 text-xs text-[color:var(--foreground)]">
                    {analysisResult}
                  </pre>
                ) : null}
                {reportStatus ? (
                  <p className="mt-3 text-sm text-[color:var(--foreground-secondary)]">{reportStatus}</p>
                ) : null}
              </section>

              <div className="flex justify-end">
                <Button type="button" onClick={() => void handleStartAnalysis()} disabled={isSubmitting}>
                  {isSubmitting ? "Starting Analysis" : "Start Analysis"}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </AuthGuard>
  );
}
