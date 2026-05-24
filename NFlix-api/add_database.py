import os
import django
import requests
import time
from  dotenv import load_dotenv
load_dotenv()


# 1. Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Movie, Genre

# API Keys
TMDB_API_KEY = os.environ.get("TMDB_API_KEY")


# TMDB Genre ID Mapping
TMDB_GENRES = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi & Fantasy",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
}

def get_kinocheck_video(tmdb_id):
    """Fetches the English trailer from KinoCheck."""
    try:
        # Added &language=en to fix the German video issue
        url = f"https://api.kinocheck.com/movies?tmdb_id={tmdb_id}&language=en"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(data)
            if 'trailer' in data and data['trailer']:
                
                print("trailer", data['trailer'])
                video_id = data['trailer'].get('youtube_video_id')
                if video_id:
                    return f"https://www.youtube.com/embed/{video_id}?autoplay=1&enablejsapi=1"
    except Exception:
        pass
    # Fallback to a placeholder if no trailer is found
    return 'https://www.w3schools.com/html/mov_bbb.mp4'

def fetch_and_save_movies():
    IMAGE_BASE = "https://image.tmdb.org/t/p/original"
    
    # List of endpoints to hit for variety
    endpoints = [
        "movie/popular",
        "movie/top_rated",
        "movie/now_playing"
    ]
    
    # Increase range(1, 6) to range(1, 11) if you want even more (200+ movies)
    for endpoint in endpoints:
        print(f"\n--- Fetching from: {endpoint} ---")
        
        for page in range(1, 4):  # Gets 3 pages per endpoint
            TMDB_URL = f"https://api.themoviedb.org/3/{endpoint}?api_key={TMDB_API_KEY}&language=en-US&page={page}"
            
            try:
                response = requests.get(TMDB_URL).json()
                if 'results' not in response:
                    break

                for item in response['results']:
                    tmdb_id = item['id']
                    title = item['title']

                    # 1. Fetch Video from KinoCheck (English)
                    video_url = get_kinocheck_video(tmdb_id)

                    # 2. Create or Update Movie
                    movie, created = Movie.objects.update_or_create(
                        title=title,
                        defaults={
                            'description': item.get('overview', ''),
                            'release_date': item.get('release_date') if item.get('release_date') else '2024-01-01',
                            'thumbnail': f"{IMAGE_BASE}{item.get('poster_path')}" if item.get('poster_path') else "",
                            'video_file': video_url,
                        }
                    )

                    # 3. Handle Genres
                    genre_ids = item.get('genre_ids', [])
                    for g_id in genre_ids:
                        genre_name = TMDB_GENRES.get(g_id)
                        if genre_name:
                            genre_obj, _ = Genre.objects.get_or_create(name=genre_name)
                            movie.genres.add(genre_obj)

                    status = "Created" if created else "Updated"
                    print(f"[{status}] {title}")
                
                # Small delay to respect API limits
                time.sleep(0.2)
                
            except Exception as e:
                print(f"Error fetching page {page} for {endpoint}: {e}")

if __name__ == "__main__":
    start_time = time.time()
    fetch_and_save_movies()
    print(f"\nTask Finished in {round(time.time() - start_time, 2)} seconds.")
