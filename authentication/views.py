import json

from django.contrib.auth import authenticate, login, logout

from django.db.models.query_utils import Q

from rest_framework.views import APIView

from rest_framework import permissions, viewsets, status, views
from rest_framework.response import Response

from authentication.models import Account, Review
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer, AuthorPostSerializer, ReviewSerializer

class AuthorPostsViewSet(viewsets.ViewSet):
    queryset = Account.objects.all()
    serializer_class = AuthorPostSerializer

    def list(self, request,account_username=None):
        queryset = Account.objects.all()

#        queryset = self.queryset.filter(author__username=account_username)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self):
        queryset = Account.objects.self()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class AuthorPostsViewSetDetail(viewsets.ViewSet):
    queryset = Account.objects.all()
    serializer_class = AuthorPostSerializer

    def list(self, request):
        queryset = Account.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)




class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        # By default, create_user does not save first_name and last_name in the model. We have to do it here.
        # There is no saving image here simply because the signup doesn't require one. default.png is used.
        if serializer.is_valid():
            account = Account.objects.create_user(**serializer.validated_data)
            account.first_name = serializer.validated_data.get('first_name')
            account.last_name = serializer.validated_data.get('last_name')
            account.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # The following can be deleted

        # if serializer.is_valid():
        #
        #     if 'image' in serializer.validated_data:
        #         account = Account.objects.create_user(**serializer.validated_data)
        #         account.image = serializer.validated_data['image']
        #         account.save()
        #         return Response(serializer.data, status=status.HTTP_201_CREATED)
        #
        #     else:
        #         Account.objects.create_user(**serializer.validated_data)
        #         return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        queryset = Account.objects.order_by('-created_at')
        return queryset

class LoginView(views.APIView):
    def post(self, request, format=None):
        data = json.loads(request.body)

        username = data.get('username', None)
        password = data.get('password', None)

        # We're trying to allow a user to login with email or username
        # One better way would be to modify the authenticate method instead

        # Retrieves a user to use its email
        try:
            user = Account.objects.get(Q(username=username)|Q(email=username))
        except Account.DoesNotExist:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)

        # The authentication tries to match the email field
        account = authenticate(email=user.email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)

                serialized = AccountSerializer(account)

                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)


class ReviewViewSet(viewsets.ViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def list(self, request):
        queryset = Review.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(ReviewViewSet, self).perform_create(serializer)


class PhotoList(views.APIView):
    #permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)

    def get(self, request, format=None):
        photo = UserImage.objects.all()
        serializer = UserImageSerializer(photo, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
       serializer = UserImageSerializer(data=request.DATA, files=request.FILES)
       if serializer.is_valid():
           serializer.save()
           return Response(serializer.data, status=status.HTTP_201_CREATED)
       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def pre_save(self, obj):
        obj.owner = self.request.user


class PhotoDetail(views.APIView):

   # permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)

    def get_object(self, pk):
        try:
            return UserImage.objects.get(pk=pk)
        except UserImage.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        photo = self.get_object(pk)
        serializer = UserImageSerializer(photo)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        photo = self.get_object(pk)
        serializer = UserImageSerializer(photo, data=request.DATA, files=request.FILES)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        photo = self.get_object(pk)
        photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def pre_save(self, obj):
        obj.owner = self.request.user
