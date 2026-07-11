"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function AnalysisPage() {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFileName(file ? file.name : null);
  };

  return (
    <main className="min-h-screen bg-[color:var(--background)] px-4 py-8 sm:px-6 lg:px-8">
      <Container>
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
                Waiting to start analysis.
              </div>
            </section>

            <div className="flex justify-end">
              <Button type="button">Start Analysis</Button>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
