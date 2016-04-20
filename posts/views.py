from rest_framework import permissions, viewsets
from rest_framework.response import Response

from itertools import groupby
from django.http import JsonResponse

from posts.models import Post, Category, Subcategory, Region, Town, PostComment, PostReview, Condition
from posts.permissions import IsAuthorOfPost
from posts.serializers import PostSerializer, CategorySerializer, SubCategorySerializer, \
    RegionSerializer, TownSerializer,PostReviewSerializer, PostCommentSerializer, ConditionSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.order_by('-created_at')
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthorOfPost(),)

    def perform_create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(PostViewSet, self).perform_create(serializer)

class AccountPostsViewSet(viewsets.ViewSet):
    queryset = Post.objects.select_related('author').all()
    serializer_class = PostSerializer

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(author__username=account_username)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

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


class SubCategoryViewSet(viewsets.ViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubCategorySerializer

    def list(self, request):
        queryset = Subcategory.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

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


class TownViewSet(viewsets.ViewSet):
    queryset = Town.objects.all()
    serializer_class = TownSerializer

    def list(self, request):
        queryset = Town.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class PostReviewViewSet(viewsets.ViewSet):
    queryset = PostReview.objects.all()
    serializer_class = PostReviewSerializer

    def list(self, request):
        queryset = PostReview.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class PostCommentViewSet(viewsets.ViewSet):
    queryset = PostComment.objects.all()
    serializer_class = PostCommentSerializer

    def list(self, request, pk):
        queryset = PostComment.objects.all().filter(postID=pk)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class ConditionViewSet(viewsets.ViewSet):
    queryset = Condition.objects.all()
    serializer_class = ConditionSerializer

    def list(self, request):
        queryset = Condition.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)