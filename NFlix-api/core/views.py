from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Movie, Profile, Genre
from .serializers import MovieSerializer, RegisterSerializer, UserSerializer, ProfileSerializer


from rest_framework import generics, viewsets, permissions
from django.contrib.auth import get_user_model


User = get_user_model()


# 1. Browse Movies
from rest_framework import viewsets, filters


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    #permission_classes = [IsAuthenticated]
    
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    # Add the SearchFilter to backends
    filter_backends = [filters.SearchFilter]
    # Specify the fields you want to search against
    search_fields = ['title', 'genre', 'director__name']

# 2. Manage the different Profiles (Dad, Mom, Kids)
class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return profiles belonging to the logged-in user
        return Profile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically attach the profile to the current user
        serializer.save(user=self.request.user)

# 3. View/Edit the main User Account
class UserAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserAccountSerializer(request.user)
        return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

# View to get the "Who's Watching?" data
class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# ViewSet for Profile CRUD (Create, List, Delete profiles)
class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.filter(account=self.request.user)


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
