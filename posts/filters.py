import django_filters
from django.db import models
from django.contrib.auth.models import User
from posts.models import Post
from posts.serializers import PostSerializer
from rest_framework import filters
from rest_framework import generics

class PostFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(name="price", lookup_type='gte')
    max_price = django_filters.NumberFilter(name="price", lookup_type='lte')

    filter_overrides = {
        models.CharField: {
            'filter_class': django_filters.CharFilter,
            'extra': lambda f: {
                'lookup_expr': 'icontains',
            },
        }
    }

    location__region__name = django_filters.CharFilter(name='location__region__name', lookup_expr='exact')

    # created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        model = Post
        fields =  ['title','min_price', 'max_price', 'description', 'location__name', 'subcategory__sub_cat_name',
                   'subcategory__category__cname', 'location__region__name','author__username', 'condition__cond_desc']

