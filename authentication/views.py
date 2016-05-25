import json
import M2Crypto
import string

from django.contrib.auth import authenticate, login, logout

from django.db.models import Count, Avg
from django.db.models.query_utils import Q

from rest_framework.views import APIView

from rest_framework import permissions, viewsets, status, views, generics, filters
from rest_framework.response import Response
from rest_framework.decorators import list_route, detail_route

from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer, AuthorPostSerializer
from authentication.filters import *

from review.models import *

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

    filter_backends = (filters.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)
    filter_class = AccountFilter

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



    @detail_route()
    def unread(self, request, username=None):
        result = self.get_queryset().filter(id=username).filter(posts__basemessage__rentmessage__unread=True).annotate(
            count=Count('posts__basemessage__rentmessage__unread')).values('id', 'count')
        return Response(result)

    # @detail_route()
    # def avg_review(self, request, username=None):
    #
    #     average = Review.objects.filter(reviewed_user=username).aggregate(rating=Avg('rating__rating_grade')).values()
    #     #result = self.get_queryset().filter(id=username).annotate(
    #     #    average_rating=int(average['rating'])).values()
    #     # result = Review.objects.filter(reviewed_user=1).annotate(rating=Avg('rating__rating_grade')).values()
    #     return Response(average)


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

    def random_password(length):
        chars = string.ascii_uppercase + string.digits + string.ascii_lowercase
        password = ''
        for i in range(length):
            password += chars[ord(M2Crypto.m2.rand_bytes(1)) % len(chars)]
        return password

    # print random_password(12) + " new pass"  this works!!

    def update(self, request, format=None):
        data = json.loads(request.body)

        username = data.get('username', None)

        newpassword = random_password(12)
        print newpassword

        try:
            user = Account.objects.get(Q(username=username) | Q(email=username))
            user.set_password(newpassword)

            email_res = user.email



        except Account.DoesNotExist:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/email does not exist.'
            }, status=status.HTTP_401_UNAUTHORIZED)

    #print random_password(12) + " new pass"  this works!!

class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)