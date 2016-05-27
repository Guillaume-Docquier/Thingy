import django_filters

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework import filters
from rest_framework import generics
from custom_functions import *

from itertools import groupby

from django.http import JsonResponse

from posts.filters import PostFilter
from posts.models import Post, Category, Subcategory, Region, Town, Condition, Status
from posts.permissions import IsAuthorOfPost
from posts.serializers import PostSerializer, CategorySerializer, SubCategorySerializer, \
    RegionSerializer, TownSerializer, ConditionSerializer, StatusSerializer


class PostViewSet(viewsets.ModelViewSet):

    queryset = Post.objects.order_by('-created_at')
    serializer_class = PostSerializer

    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filter_class = PostFilter
    ordering_fields = ('title', 'price', 'created_at')

    search_fields = ('title', 'description',  )

    def get_serializer_class(self):
        return  PostSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthorOfPost(),)

    def perform_create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(PostViewSet, self).perform_create(serializer)




class AccountPostsViewSet(viewsets.ViewSet):
    queryset = Post.objects.select_related('author').all().order_by('-created_at')
    serializer_class = PostSerializer

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(author__username=account_username)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(AccountPostsViewSet, self).perform_create(serializer)

class CategoryViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def list(self, request):
        subcategories = Subcategory.objects.order_by(
            'category__cname', 'sub_cat_name').values(
            'id', 'sub_cat_name', 'category__id', 'category__cname')
        categories = [
            {
                'cid': c[0],
                'cname': c[1],
                'subcategories': [{'id': vv['id'], 'name': vv['sub_cat_name']} for vv in v]
            } for c, v in groupby(subcategories, key=lambda s: (s['category__id'], s['category__cname']))
        ]
        return Response(categories)

    def create(self, serializer):
        #instance = serializer.save(author=self.request.user)
        return super(CategoryViewSet, self).perform_create(serializer)


class SubCategoryViewSet(viewsets.ViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubCategorySerializer

    def list(self, request):
        queryset = Subcategory.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(SubCategoryViewSet, self).perform_create(serializer)

class RegionViewSet(viewsets.ViewSet):
    queryset = Region.objects.all().order_by('name')
    serializer_class = RegionSerializer

    def list(self, request):
        towns = Town.objects.order_by(
            'region__name', 'name').values(
            'id', 'name', 'region__id', 'region__name')
        regions = [
            {
                'rid': c[0],
                'name': c[1],
                'towns': [{'id': vv['id'], 'name': vv['name']} for vv in v]
            } for c, v in groupby(towns, key=lambda s: (s['region__id'], s['region__name']))
        ]
        return Response(regions)

    def create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(RegionViewSet, self).perform_create(serializer)


class TownViewSet(viewsets.ViewSet):
    queryset = Town.objects.all().order_by('name')
    serializer_class = TownSerializer

    def list(self, request):
        queryset = Town.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(TownViewSet, self).perform_create(serializer)




class ConditionViewSet(viewsets.ViewSet):
    queryset = Condition.objects.all()
    serializer_class = ConditionSerializer

    def list(self, request):
        queryset = Condition.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(ConditionViewSet, self).perform_create(serializer)

class StatusViewSet(viewsets.ViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer

    def list(self, request):
        queryset = Status.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(StatusViewSet, self).perform_create(serializer)