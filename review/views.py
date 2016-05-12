from django.shortcuts import render
from rest_framework import viewsets
from review.models import Review, Rating
from review.serializers import ReviewSerializer, ReviewedUserSerializer
from authentication.models import Account

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        instance = serializer.save(review_author=self.request.user)
        return super(ReviewViewSet, self).perform_create(serializer)

class ReviewedUserViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = ReviewedUserSerializer