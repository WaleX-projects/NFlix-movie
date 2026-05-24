export const endpoints = {
  movies: {
    list: "/movies/",
    byGenre: (genreId: number | string) => `/movies/genre/${genreId}`,
    detail: (id: number | string) => `/movies/${id}`,
    search: "/movies/?search",
  },
  auth: {
    login: "/auth/login/",
    register: "/auth/register/",
    profile: "/auth/me/",
  },
} as const;
