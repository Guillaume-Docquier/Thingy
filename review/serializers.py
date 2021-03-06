from rest_framework import serializers
#from django.contrib.auth.models import User
from review.models import Review, Rating
from authentication.models import Account
from authentication.serializers import AccountSerializer
from posts.fields import Base64ImageField


class RatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Rating
        fields = ('id', 'rating_grade')

class ReviewSerializer(serializers.ModelSerializer):
    review_author = AccountSerializer(read_only=True, required=False)

    rating_details = RatingSerializer(source='rating', read_only=True, required=False)
    rating = serializers.PrimaryKeyRelatedField(queryset=Rating.objects.all(), write_only=True)


    class Meta:
        model = Review
        fields = ('id', 'reviewed_user','review_author', 'rating', 'rating_details', 'created', 'comment')

class ReviewedUserSerializer(serializers.ModelSerializer):
    reviewed_user = serializers.PrimaryKeyRelatedField(many=True, queryset=Review.objects.all())

    class Meta:
        model = Account
        fields = ('id', 'username', 'reviewed_user')
