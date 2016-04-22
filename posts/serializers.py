from rest_framework import serializers

from authentication.serializers import AccountSerializer
from posts.models import Post, Category, Subcategory, Region, Town, PostReview, Condition


class CategorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    #subcategory = SubCategorySerializer(read_only=True, required=False)

    class Meta:
        model = Category

        fields = ('id', 'cname')
        read_only_fields = ('id')

class SubCategorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    category = CategorySerializer(read_only=True, required=False)

    class Meta:
        model = Subcategory

        fields = ('id', 'sub_cat_name', 'category')
        read_only_fields = ('id')


class RegionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Region
        fields = ('id', 'name')
        read_only_fields = ('id')


class TownSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    region = RegionSerializer(read_only=True, required=False)

    class Meta:
        model = Town

        fields = ('id', 'name', 'region')
        read_only_fields = ('id')

class ConditionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Condition
        fields = ('id', 'cond_desc', 'cond_grade')
        read_only_fields = ('id')


class PostSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True, required=False)
    subcategory = SubCategorySerializer(read_only=True, required=False)
    condition = ConditionSerializer(read_only=True, required=False)
    location = TownSerializer(read_only=True, required=False)

	
    class Meta:
        model = Post

        fields = ('id', 'author', 'title', 'description', 'price',
                  'condition', 'location', 'created_at', 'subcategory', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(PostSerializer, self).get_validation_exclusions()

        return exclusions + ['author']


class SimplePostReviewSerializer(serializers.ModelSerializer):
    reviewauthor = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = PostReview
        fields = ('id', 'rating', 'reviewauthor')




class PostWithReviews(PostSerializer):
    reviews = SimplePostReviewSerializer(read_only=True, required=False, many=True)

    class Meta(PostSerializer.Meta):
        fields = ('id', 'author', 'title', 'description', 'price',
                  'condition', 'location', 'created_at', 'subcategory', 'updated_at', 'reviews')


class PostReviewSerializer(serializers.ModelSerializer):
    reviewauthor = AccountSerializer(read_only=True, required=False)
    post = PostSerializer(read_only=True, required=False)

    class Meta:
        model = PostReview
        fields = ('id', 'rating', 'comment','post', 'reviewauthor')
        read_only_fields = ('id')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(PostReviewSerializer, self).get_validation_exclusions()

        return exclusions + ['author']

