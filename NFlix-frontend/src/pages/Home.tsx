import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import Navbar from "@/components/Navbar";
import RowSkeleton from "@/components/RowSkeleton";
import VideoModal from "@/components/VideoModal";
import { useDebounce } from "@/hooks/useDebounce";
import { useMovies } from "@/hooks/useMovies";
import { useMyList } from "@/hooks/useMyList";
import { searchMovies } from "@/api/movieApi";
import type { Movie } from "@/types/movie";

const Home = () => {
  const { byGenre, featured, movies, loading, error } = useMovies();
  const { ids: myListIds } = useMyList();

  const [selected, setSelected] = useState<Movie | null>(null);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 350);
  const [results, setResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!debounced.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchMovies(debounced)
      .then((r) => !cancelled && setResults(r))
      .finally(() => !cancelled && setSearching(false));
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const handlePlay = (m: Movie) => {
    setSelected(m);
    setOpen(true);
  };

  const myListMovies = useMemo(
    () => movies.filter((m) => myListIds.includes(m.id)),
    [movies, myListIds]
  );

  const showingSearch = debounced.trim().length > 0;

  // Basic SEO
  useEffect(() => {
    document.title = "NFLIX – Stream Movies & Shows";
    const desc =
      "Discover trending movies and shows. Watch trailers, build your list, and explore by genre on NFLIX.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar search={search} onSearchChange={setSearch} />

      {showingSearch ? (
        <main className="pt-24 px-4 md:px-12 pb-24 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Results for “{debounced}”
          </h1>
          {searching ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-md bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground">No matches found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {results.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handlePlay(m)}
                  className="group relative aspect-[2/3] rounded-md overflow-hidden transition-smooth hover:scale-[1.04] text-left"
                >
                  <img
                    src={m.thumbnail}
                    alt={m.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-card-gradient" />
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <p className="text-sm font-semibold line-clamp-1">{m.title}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      ) : (
        <>
          <Hero movie={featured} onPlay={handlePlay} onMore={handlePlay} />
          <main className="relative -mt-16 md:-mt-32 z-10 pb-24">
            {error && (
              <div className="px-4 md:px-12 py-4 text-sm text-destructive">
                {error}
              </div>
            )}
            {loading ? (
              <>
                <RowSkeleton />
                <RowSkeleton />
                <RowSkeleton />
              </>
            ) : (
              <>
                {myListMovies.length > 0 && (
                  <MovieRow
                    title="My List"
                    movies={myListMovies}
                    onPlay={handlePlay}
                  />
                )}
                {byGenre.map((row) => (
                  <MovieRow
                    key={row.genre.id}
                    title={row.genre.name}
                    movies={row.movies}
                    onPlay={handlePlay}
                  />
                ))}
              </>
            )}
          </main>
        </>
      )}

      <VideoModal movie={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default Home;
