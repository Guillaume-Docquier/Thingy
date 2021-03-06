from django.shortcuts import render
from rest_framework import viewsets, permissions
from review.models import Review, Rating
from review.serializers import ReviewSerializer, ReviewedUserSerializer
from authentication.models import Account
from review.permissions import IsAuthorOfReview
from rest_framework import filters
from review.filters import *
from django.db.models import Avg, Max, Min


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)

    filter_class = ReviewFilter

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthorOfReview(),)


    def perform_create(self, serializer):
        instance = serializer.save(review_author=self.request.user)
        return super(ReviewViewSet, self).perform_create(serializer)

class ReviewedUserViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = ReviewedUserSerializer