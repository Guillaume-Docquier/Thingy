from django.conf.urls import patterns, url
from thingyads import views

from thingyproject.views import IndexView

urlpatterns = [
   
    #url('^.*$', IndexView.as_view(), name='index'),
    url(r'^Tests/$', views.test, name = 'test'),
]
