import { Check, Play, Plus } from "lucide-react";
import type { Movie } from "@/types/movie";
import { useMyList } from "@/hooks/useMyList";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  onPlay: (m: Movie) => void;
}

const MovieCard = ({ movie, onPlay }: MovieCardProps) => {
  const { has, toggle } = useMyList();
  const inList = has(movie.id);

  return (
    <article
      className={cn(
        "group relative shrink-0 w-[160px] sm:w-[200px] md:w-[230px] aspect-[2/3]",
        "rounded-md overflow-hidden cursor-pointer",
        "transition-smooth hover:scale-[1.08] hover:z-20 hover:shadow-card"
      )}
      onClick={() => onPlay(movie)}
    >
      <img
        src={movie.thumbnail}
        alt={movie.title}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-card-gradient opacity-90 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 group-hover:translate-y-0 transition-smooth">
        <h3 className="text-sm font-semibold line-clamp-1">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1 opacity-0 group-hover:opacity-100 transition-smooth">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="text-emerald-400 font-semibold">
              {Math.round((movie.rating ?? 7.5) * 10)}% Match
            </span>
            <span>{new Date(movie.release_date).getFullYear()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(movie);
              }}
              className="h-7 w-7 grid place-items-center rounded-full bg-foreground text-background hover:bg-foreground/90"
              aria-label="Play"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle(movie.id);
              }}
              className="h-7 w-7 grid place-items-center rounded-full border border-foreground/60 text-foreground hover:border-foreground"
              aria-label={inList ? "Remove from My List" : "Add to My List"}
            >
              {inList ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
