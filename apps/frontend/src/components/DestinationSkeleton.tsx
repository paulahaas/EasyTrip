export function DestinationSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden animate-fade-in"
      style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Hero skeleton */}
      <div className="h-36 et-shimmer" />

      {/* Body skeleton */}
      <div className="p-5 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg p-3 flex flex-col gap-2" style={{ background: '#1e2029' }}>
              <div className="et-shimmer h-2.5 w-14 rounded" />
              <div className="et-shimmer h-4 w-24 rounded" />
            </div>
          ))}
        </div>
        <div className="et-shimmer h-16 rounded-lg" />
        <div className="et-shimmer h-16 rounded-lg" />
      </div>
    </div>
  )
}
