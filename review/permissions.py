from rest_framework import permissions

class IsAuthorOfReview(permissions.BasePermission):
    def has_object_permission(self, request, view, review):
        if request.user:
            return review.review_author == request.user
        return False
