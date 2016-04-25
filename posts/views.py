from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.filters import SearchFilter

import django_filters
from rest_framework import filters

from itertools import groupby
from django.http import JsonResponse

from posts.models import Post, Category, Subcategory, Region, Town, PostReview, Condition
from posts.permissions import IsAuthorOfPost
from posts.serializers import PostSerializer, PostWithReviews, CategorySerializer, SubCategorySerializer, \
    RegionSerializer, TownSerializer,PostReviewSerializer, ConditionSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.order_by('-created_at')
    serializer_class = PostSerializer
    #filter_backends = (SearchFilter,)
    search_fields = ('title', 'description', 'author__username', 'location__region__name', 'location__name', 'subcategory__category__cname', 'subcategory__sub_cat_name')

    #filter_backends = (filters.OrderingFilter)
    #ordering_fields = '__all__'

    # def get_query_set(self):
    #     search_field = 'title'
    #     model = Post
    #
    #     queryset = model.objects.all()
    #     search_results = self.rewquest.query_params.get(search_field, None)
    #
    #     if search_results is not None:
    #         queryset = queryset.filter(search_results_id=search_results)
    #
    #     author = self.request.query_params.get('author', None)
    #     if author is not None:
    #         queryset = queryset.filter(author=author)
    #     return queryset

    # def get_queryset(self):
    #     queryset = Post.objects.order_by('-created_at')
    #     if 'category' in self.request.query_params:
    #         queryset = queryset.filter(subcategory__category=self.request.query_params['category'])
    #
    #     if 'subcategory' in self.request.query_params:
    #         queryset = queryset.filter(subcategory__id=self.request.query_params['subcategory'])
    #
    #     if 'region' in self.request.query_params:
    #         queryset = queryset.filter(location__region=self.request.query_params['region'])
    #
    #     if 'location' in self.request.query_params:
    #         queryset = queryset.filter(location__id=self.request.query_params['location'])
    #
    #     if 'condition' in self.request.query_params:
    #         queryset = queryset.filter(condition__id=self.request.query_params['condition'])
    #
    #     author = self.request.query_params.get('author', None)
    #     if author is not None:
    #         queryset = queryset.filter(author=author)
    #     return queryset

    def get_serializer_class(self):
        return PostWithReviews if self.action == 'retrieve' else PostSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthorOfPost(),)

    def perform_create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(PostViewSet, self).perform_create(serializer)

    # def list(self, request):
    #     postreviews = PostReview.objects.order_by(
    #         'post__created_at', 'id').values(
    #         'id', 'rating', 'post__id', 'post__title')
    #     posts = [
    #         {
    #             'sid': c[0],
    #             'title': c[1],
    #             'postreviews': [{'id': vv['id'], 'title': vv['id']} for vv in v]
    #         } for c, v in groupby(postreviews, key=lambda s: (s['post__id'], s['post__title']))
    #     ]
    #     return Response(postreviews)


class AccountPostsViewSet(viewsets.ViewSet):
    queryset = Post.objects.select_related('author').all()
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
    queryset = Region.objects.all()
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
    queryset = Town.objects.all()
    serializer_class = TownSerializer

    def list(self, request):
        queryset = Town.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(TownViewSet, self).perform_create(serializer)


class PostReviewViewSet(viewsets.ViewSet):
    queryset = PostReview.objects.all()
    serializer_class = PostReviewSerializer

    def list(self, request):
        queryset = PostReview.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(PostReviewViewSet, self).perform_create(serializer)



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

