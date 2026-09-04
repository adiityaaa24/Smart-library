from rest_framework.permissions import BasePermission
from .models import Student


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and getattr(request.user, "is_staff", False))


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and isinstance(request.user, Student))