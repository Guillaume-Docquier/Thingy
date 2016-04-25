from django.contrib.auth.models import User
from posts.models import Post
from posts.serializers import PostSerializer
from rest_framework import filters
from rest_framework import generics

class UserListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer = PostSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('title')