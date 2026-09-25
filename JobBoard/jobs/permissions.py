from rest_framework import permissions


class IsEmployer(permissions.BasePermission):
    """Only authenticated users with role='employer' can access."""
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'employer'
        )


class IsOwnerEmployer(permissions.BasePermission):
    """Only the employer who posted the job can edit/delete it."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.employer == request.user
    