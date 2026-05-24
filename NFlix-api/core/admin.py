from django.contrib import admin
from .models import Profile,Movie,Genre,VideoHistory,Watchlist
# Register your models here.
admin.site.register(Profile)
admin.site.register(Movie)
admin.site.register(Genre)
admin.site.register(VideoHistory)
admin.site.register(Watchlist)