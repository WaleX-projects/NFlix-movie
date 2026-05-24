import api from "./axios";
import { endpoints } from "./endpoints";
import type { Movie } from "@/types/movie";
import { MOCK_MOVIES } from "./mockData";

const USE_MOCK = !import.meta.env.VITE_API_BASE_URL;

const delay = <T,>(value: T, ms = 600) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export async function getMovies(): Promise<Movie[]> {
  if (USE_MOCK) return delay(MOCK_MOVIES);
  const { data } = await api.get<Movie[]>(endpoints.movies.list);
  return data;
}

export async function getMoviesByGenre(genreId: number): Promise<Movie[]> {
  if (USE_MOCK)
    return delay(MOCK_MOVIES.filter((m) => m.genres.some((g) => g.id === genreId)));
  const { data } = await api.get<Movie[]>(endpoints.movies.byGenre(genreId));
  return data;
}

export async function getMovie(id: number): Promise<Movie> {
  if (USE_MOCK) {
    const found = MOCK_MOVIES.find((m) => m.id === id);
    if (!found) throw new Error("Movie not found");
    return delay(found, 200);
  }
  const { data } = await api.get<Movie>(endpoints.movies.detail(id));
  return data;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (USE_MOCK) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return delay(
      MOCK_MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      ),
      300
    );
  }
  const { data } = await api.get<Movie[]>(endpoints.movies.search, {
    params: { q: query },
  });
  return data;
}
