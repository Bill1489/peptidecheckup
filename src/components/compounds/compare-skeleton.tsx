/** Prerendered placeholder shown while the compare tool reads the URL and saved preferences. */
export function CompareSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading comparison" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <div className="skeleton h-11 w-40 rounded-full" />
          <div className="skeleton h-11 w-28 rounded-full" />
        </div>
        <div className="skeleton h-11 w-64 rounded-full" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="grid grid-cols-[8.5rem_1fr_1fr] sm:grid-cols-[11rem_1fr_1fr_1fr]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-b border-line p-4 last:border-b-0">
              <div className="skeleton h-4 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
