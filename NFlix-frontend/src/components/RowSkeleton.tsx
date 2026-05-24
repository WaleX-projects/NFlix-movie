interface RowSkeletonProps {
  title?: string;
  count?: number;
}

const RowSkeleton = ({ title = "Loading…", count = 7 }: RowSkeletonProps) => (
  <section className="py-4 md:py-6">
    <div className="px-4 md:px-12 mb-3">
      <div className="h-5 w-40 rounded bg-muted animate-pulse" />
    </div>
    <div className="flex gap-2 md:gap-3 overflow-hidden px-4 md:px-12">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="shrink-0 w-[160px] sm:w-[200px] md:w-[230px] aspect-[2/3] rounded-md bg-muted animate-pulse"
        />
      ))}
    </div>
  </section>
);

export default RowSkeleton;
