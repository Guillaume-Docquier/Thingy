from rest_framework import permissions, viewsets
from rest_framework.response import Response

from posts.models import Post, Category, Subcategory
from posts.permissions import IsAuthorOfPost
from posts.serializers import PostSerializer, CategorySerializer, SubCategorySerializer


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
        queryset = Category.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class SubCategoryViewSet(viewsets.ViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubCategorySerializer

    def list(self, request):
        queryset = Subcategory.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
