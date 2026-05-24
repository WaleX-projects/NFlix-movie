from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyTokenObtainPairView
from .views import MovieViewSet, ProfileViewSet, UserAccountView,RegisterView,UserDetailView

router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')
router.register(r'profiles', ProfileViewSet, basename='user-profiles')

urlpatterns = [
    # User Account Info
    path('api/account/', UserAccountView.as_view(), name='user_account'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 2. User , Profile & Movie Endpoints
    path('auth/me/', UserDetailView.as_view(), name='user_detail'),
    path('', include(router.urls)),

    
    
]

"""
auth: {
    login: "/auth/login/",
    register: "/auth/register/",
    profile: "/auth/me/",
  },
  
  """