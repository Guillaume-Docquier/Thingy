from rest_framework import serializers

from authentication.serializers import AccountSerializer
from posts.models import Post, Category, Subcategory, Region, Town, Condition, PostImage, Status
from posts.fields import Base64ImageField


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


class StatusSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Status
        fields = ('id', 'name')
        read_only_fields = ('id')

class PostSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True, required=False)

    subcategory_details = SubCategorySerializer(source='subcategory', read_only=True, required=False)
    subcategory = serializers.PrimaryKeyRelatedField(queryset=Subcategory.objects.all(), write_only=True)

    condition_details = ConditionSerializer(source='condition', read_only=True, required=False)
    condition = serializers.PrimaryKeyRelatedField(queryset=Condition.objects.all(), write_only=True)

    location_details = TownSerializer(source='location', read_only=True, required=False)

    location =  serializers.PrimaryKeyRelatedField(queryset=Town.objects.all(), write_only=True)
    #image = serializers.ImageField(source='image', max_length=None, use_url = True, required=False)

    #location = serializers.PrimaryKeyRelatedField(queryset=Town.objects.all(), write_only=True)

    status_details = StatusSerializer(source='status', read_only=True, required=False)
    status = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all(), write_only=True, required=False)

    image = Base64ImageField(required=False)


    class Meta:
        model = Post

        fields = ('id', 'author', 'title', 'description', 'price',
                  'condition_details', 'condition', 'location_details',
                  'location', 'created_at', 'subcategory_details' , 'subcategory', 'updated_at', 'image', 'status', 'status_details')
        #read_only_fields = ('id', 'created_at', 'updated_at' )#, 'location_details', 'subcategory_details', 'condition_details')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(PostSerializer, self).get_validation_exclusions()

        return exclusions + ['author']


# class SimplePostReviewSerializer(serializers.ModelSerializer):
#     reviewauthor = AccountSerializer(read_only=True, required=False)
#
#     class Meta:
#         model = PostReview
#         fields = ('id', 'rating', 'reviewauthor')

#
# class PostWithReviews(PostSerializer):
#     reviews = SimplePostReviewSerializer(read_only=True, required=False, many=True)
#
#     class Meta(PostSerializer.Meta):
#         fields = ('id', 'author', 'title', 'description', 'price',
#                   'condition_details', 'location_details', 'created_at', 'subcategory_details', 'status_details', 'updated_at', 'image', 'reviews')
#
#
# class PostReviewSerializer(serializers.ModelSerializer):
#     reviewauthor = AccountSerializer(read_only=True, required=False)
#     post = PostSerializer(read_only=True, required=False)
#
#     class Meta:
#         model = PostReview
#         fields = ('id', 'rating', 'comment','post', 'reviewauthor')
#         read_only_fields = ('id')
#
#     def get_validation_exclusions(self, *args, **kwargs):
#         exclusions = super(PostReviewSerializer, self).get_validation_exclusions()
#
#         return exclusions + ['author']

class PostImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PostImage
        fields = ('url','id', 'post', 'image')
        post = serializers.Field(source='post.id')



# class ReviewSerializer(serializers.ModelSerializer):
#     reviewed_user = AccountSerializer(read_only=True, required=False)
#     reviewauthor = AccountSerializer(read_only=True, required=False)
#
#     class Meta:
#         model = Review
#         fields = ('id', 'reviewed_user', 'rating', 'comment', 'author_of_review')
#         read_only_fields = ('id')

    # def get_validation_exclusions(self, *args, **kwargs):
    #     exclusions = super(ReviewSerializer, self).get_validation_exclusions()
    #
    #     return exclusions + ['author']
