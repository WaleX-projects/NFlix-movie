import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Movie } from "@/types/movie";

interface VideoModalProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

function toEmbedUrl(video: string): string {
  if (!video) return "";
  if (video.startsWith("http")) {
    try {
      const u = new URL(video);
      const id = u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    } catch {
      return video;
    }
  }
  return `https://www.youtube.com/embed/${video}?autoplay=1&rel=0`;
}

const VideoModal = ({ movie, open, onOpenChange }: VideoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-card border-border overflow-hidden">
        {movie && (
          <div className="animate-scale-in">
            <div className="relative aspect-video bg-black">
              {open && (
                <iframe
                  className="w-full h-full"
                  src={toEmbedUrl(movie.video_file)}
                  title={movie.title}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl font-bold">{movie.title}</h2>
                <span className="text-sm text-emerald-400 font-semibold">
                  {Math.round((movie.rating ?? 7.5) * 10)}% Match
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span className="px-1.5 border border-border rounded">HD</span>
                <span>{movie.genres.map((g) => g.name).join(" • ")}</span>
              </div>
              <p className="mt-4 text-sm text-foreground/85 leading-relaxed">
                {movie.description}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
