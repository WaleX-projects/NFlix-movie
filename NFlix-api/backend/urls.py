from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # Ensure 'core' matches the actual name of your app folder
    path('api/', include('core.urls')), 
]

# This allows Django to serve images (thumbnails) and videos during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
