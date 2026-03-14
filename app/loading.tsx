
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}