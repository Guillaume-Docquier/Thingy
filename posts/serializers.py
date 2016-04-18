from rest_framework import serializers

from authentication.serializers import AccountSerializer
from posts.models import Post, Category


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category

        fields = ('id', 'cname')
        read_only_fields = ('id')


class PostSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True, required=False)
    category = CategorySerializer(read_only=True, required=False)
	
    class Meta:
        model = Post

        fields = ('id', 'author', 'title', 'description', 'price','category', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(PostSerializer, self).get_validation_exclusions()

        return exclusions + ['author']
