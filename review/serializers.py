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
    #reviewed_user = AccountSerializer(read_only=True, required=False)
    #review_author = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), write_only=True)

    #review_author_details = AccountSerializer(read_only=True, required=False)
    review_author = serializers.ReadOnlyField(source='review_author.username', read_only=True, required=False)
    #review_author = AccountSerializer(read_only=True, required=False)

    review_author_image = serializers.ImageField(source='review_author.image', read_only=True, required=False)
    #review_author_image64 = serializers.Base64ImageField(review_author_image)

    rating_details = RatingSerializer(source='rating', read_only=True, required=False)
    rating = serializers.PrimaryKeyRelatedField(queryset=Rating.objects.all(), write_only=True)


    class Meta:
        model = Review
        fields = ('id', 'reviewed_user','review_author', 'review_author_image', 'rating', 'rating_details', 'created', 'comment')

class ReviewedUserSerializer(serializers.ModelSerializer):
    reviewed_user = serializers.PrimaryKeyRelatedField(many=True, queryset=Review.objects.all())

    class Meta:
        model = Account
        fields = ('id', 'username', 'reviewed_user')

