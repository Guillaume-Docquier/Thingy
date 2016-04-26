<<<<<<< HEAD
#import django_filters
=======
import django_filters
from django.db import models
>>>>>>> dbaffffbc7b93922135e347ec48d218cde6a1b31
from django.contrib.auth.models import User
from posts.models import Post
from posts.serializers import PostSerializer
from rest_framework import filters
from rest_framework import generics


class PostFilter(filters.FilterSet):
    min_price = django_filters.NumberFilter(name="price", lookup_type='gte')
    max_price = django_filters.NumberFilter(name="price", lookup_type='lte')
    title = django_filters.CharFilter( )

class PostFilter(django_filters.FilterSet):


    #http://django-filter.readthedocs.org/en/latest/ref/filterset.html

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
    location__name = django_filters.CharFilter(name='location__name', lookup_expr='exact')

    # created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)


 
    class Meta:
        model = Post
        fields =  ['title','min_price', 'max_price', 'description', 'location__name', 'subcategory__sub_cat_name',
                   'subcategory__category__cname', 'location__region__name','author__username', 'condition__cond_desc']


# import django_filters
# from django.contrib.auth.models import User
# from posts.models import Post
# from posts.serializers import PostSerializer
# from rest_framework import filters
# from rest_framework import generics
#
# class PostFilter(filters.FilterSet):
#     #min_price = django_filters.NumberFilter(name="price", lookup_type='gte')
#     #max_price = django_filters.NumberFilter(name="price", lookup_type='lte')
#     #title = django_filters.CharFilter( )
#
#     # filter_overrides = {
#     #     Post.CharField: {
#     #         'filter_class': django_filters.CharFilter,
#     #         'extra': lambda f: {
#     #             'lookup_expr': 'icontains',
#     #         },
#     #     }
#     # }
#
#     class Meta:
#         model = Post
#         fields =  {
#             'title': ['icontains']}
#
#        # , 'min_price', 'max_price'}
#
