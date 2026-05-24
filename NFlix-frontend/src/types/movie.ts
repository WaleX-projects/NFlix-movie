export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  genres: Genre[];
  thumbnail: string;
  backdrop?: string;
  video_file: string; // YouTube id or url
  rating?: number;
}

export interface MoviesByGenre {
  genre: Genre;
  movies: Movie[];
}
