import django_filters
from django.contrib.auth.models import User
from posts.models import Post
from posts.serializers import PostSerializer
from rest_framework import filters
from rest_framework import generics

class PostFilter(filters.FilterSet):
    min_price = django_filters.NumberFilter(name="price", lookup_type='gte')
    max_price = django_filters.NumberFilter(name="price", lookup_type='lte')
    class Meta:
        model = Post
        fields = ['title', 'min_price', 'max_price']

