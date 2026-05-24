import { Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/movie";

interface HeroProps {
  movie: Movie | null;
  onPlay: (m: Movie) => void;
  onMore: (m: Movie) => void;
}

const Hero = ({ movie, onPlay, onMore }: HeroProps) => {
  if (!movie) {
    return (
      <div className="relative h-[70vh] md:h-[88vh] w-full bg-muted animate-pulse" />
    );
  }

  const bg = movie.backdrop ?? movie.thumbnail;

  return (
    <section className="relative h-[70vh] md:h-[88vh] w-full overflow-hidden">
      <img
        src={bg}
        alt={movie.title}
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-bottom-fade" />

      <div className="relative z-10 h-full flex items-end md:items-center px-4 md:px-12 pb-24 md:pb-0">
        <div className="max-w-2xl animate-fade-in">
          <p className="text-xs md:text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Featured · #1 in Movies Today
          </p>
          <h1 className="text-4xl md:text-7xl font-black leading-tight text-balance drop-shadow-2xl">
            {movie.title}
          </h1>
          <p className="mt-4 text-base md:text-lg text-foreground/85 max-w-xl line-clamp-3 md:line-clamp-4">
            {movie.description}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button
              onClick={() => onPlay(movie)}
              size="lg"
              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              <Play className="h-5 w-5 fill-current" /> Play
            </Button>
            <Button
              onClick={() => onMore(movie)}
              size="lg"
              variant="secondary"
              className="gap-2 bg-secondary/70 hover:bg-secondary text-foreground backdrop-blur"
            >
              <Info className="h-5 w-5" /> More Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
