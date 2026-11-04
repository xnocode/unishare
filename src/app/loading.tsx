export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0f6b63] border-t-transparent" />
        <p className="text-[13px] font-medium text-[#4b5552]">Loading…</p>
      </div>
    </div>
  );
}
