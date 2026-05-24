import { useEffect, useMemo, useState } from "react";
import { getMovies } from "@/api/movieApi";
import type { Movie, MoviesByGenre } from "@/types/movie";

interface UseMoviesResult {
  movies: Movie[];
  byGenre: MoviesByGenre[];
  featured: Movie | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMovies(): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getMovies()
      .then((data) => {
        if (!cancelled) setMovies(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message ?? "Failed to load movies");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const byGenre = useMemo<MoviesByGenre[]>(() => {
    const map = new Map<number, MoviesByGenre>();
    for (const m of movies) {
      for (const g of m.genres) {
        if (!map.has(g.id)) map.set(g.id, { genre: g, movies: [] });
        map.get(g.id)!.movies.push(m);
      }
    }
    return Array.from(map.values());
  }, [movies]);

  const featured = useMemo<Movie | null>(() => {
    if (!movies.length) return null;
    return [...movies].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
  }, [movies]);

  return {
    movies,
    byGenre,
    featured,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}
