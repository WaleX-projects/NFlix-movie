from rest_framework import serializers
from .models import Movie, Genre, Profile
#Watchlist


# Existing Serializers
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    class Meta:
        model = Movie
        fields = ['id', 'title', 'description', 'release_date', 'genres', 'thumbnail', 'video_file']



from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    # Write-only ensures the password doesn't show up in GET requests
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    
    class Meta:
        model = User
        fields = ("name",'email', 'password')

    
    def create(self, validated_data):
        # Remove password2 before passing to create_user
        
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user


from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'name', 'avatar', 'is_kids', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        # Automatically link the profile to the logged-in user
        validated_data['account'] = self.context['request'].user
        return super().create(validated_data)
        
class UserSerializer(serializers.ModelSerializer):
    # This allows the frontend to get all profiles linked to the account immediately
    profiles = ProfileSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email',"name" ,'profiles')
        
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserSerializer # The one we created earlier

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom data to the response
        # self.user is the user instance being authenticated
        data['user'] = UserSerializer(self.user).data
        
        return data
                
        