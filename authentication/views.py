# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.http import require_POST
#from models import User,Item,Owner
from forms import UserForm
from django.contrib.auth import authenticate, login

from rest_framework import permissions
from rest_framework import status, views
from rest_framework import permissions, viewsets
from rest_framework.response import Response

from authentication.serializers import AccountSerializer

class LoginView(views.APIView):
    def post(self, request, format=None):
        data = json.loads(request.body)

        username = data.get('username', None)
        password = data.get('password', None)

        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)

                #serialized = AccountSerializer(account)

                #return Response(serialized.data)
                return JsonResponse({'success': True})
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

@require_POST
def login(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'message': u'Your account is disabled.'})
    return JsonResponse({'success': False, 'message': u'Login incorrect.'})


#Signup view
@require_POST
def signup(request):
    form = UserForm(request.POST)
    if form.is_valid():
        user = form.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'errors': form.errors})

def index(request):
    pass


class loginView():
	def post

#def addpage(request):
#    add_dict = {}
#    try:
#	adds =

#AddItem view - in progress

#def additem(request)
	#if request.method == 'POST':
		#form = ItemForm(request.POST)
		#if form.is_valid():
		#	item = form.save()
		#	return HttpResponseRedirect("/thingy/youritems")
	#else:
	#	form = ItemForm(request.POST)
	#return render(request, "thingy/additem.html", locals())
