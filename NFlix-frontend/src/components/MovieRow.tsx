import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onPlay: (m: Movie) => void;
}

const MovieRow = ({ title, movies, onPlay }: MovieRowProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (!movies.length) return null;

  return (
    <section className="relative group/row py-4 md:py-6">
      <h2 className="px-4 md:px-12 text-lg md:text-xl font-semibold mb-3">
        {title}
      </h2>
      <div className="relative">
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className="hidden md:grid place-items-center absolute left-0 top-0 bottom-0 w-12 z-20 bg-background/40 hover:bg-background/70 opacity-0 group-hover/row:opacity-100 transition-smooth"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <div
          ref={scrollerRef}
          className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 md:px-12 py-6 -my-6"
        >
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} onPlay={onPlay} />
          ))}
        </div>
        <button
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className="hidden md:grid place-items-center absolute right-0 top-0 bottom-0 w-12 z-20 bg-background/40 hover:bg-background/70 opacity-0 group-hover/row:opacity-100 transition-smooth"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
    </section>
  );
};

export default MovieRow;
