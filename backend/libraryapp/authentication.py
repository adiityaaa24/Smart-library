from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from django.contrib.auth.models import User
from .models import Student


class RoleBasedJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        role = validated_token.get("role")
        user_id = validated_token.get("user_id")

        if user_id is None:
            raise InvalidToken("Token mein user identification nahi mila")

        if role == "student":
            try:
                student = Student.objects.get(id=user_id)
            except Student.DoesNotExist:
                raise AuthenticationFailed("Student nahi mila")

            if not student.is_active:
                raise AuthenticationFailed("Ye account block hai")

            student.is_authenticated = True  # DRF permission checks isko use karte hain
            return student

        elif role == "admin":
            try:
                user = User.objects.get(id=user_id, is_staff=True)
            except User.DoesNotExist:
                raise AuthenticationFailed("Admin nahi mila")
            return user

        raise AuthenticationFailed("Invalid token role")