from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def test(request):
	#template_name = 'test.html'
	return HttpResponse("Hello world!")
