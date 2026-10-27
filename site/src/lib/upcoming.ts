import { movies } from "@/data/movies";
import { releaseTimestamp } from "./release";

/** Movies with a release date still in the future, soonest first */
export function getUpcomingMovies(now = Date.now()) {
  return movies
    .filter((m) => m.releaseDate && releaseTimestamp(m.releaseDate) > now)
    .sort((a, b) => a.releaseDate!.localeCompare(b.releaseDate!));
}
