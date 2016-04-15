from django.conf.urls import patterns, url, include

from thingyproject.views import IndexView
from thingyads import views as thingyads
from django.contrib import admin

urlpatterns = [
  
    url('^.*$', IndexView.as_view(), name='index'),
    #url(r'^$', thingyads.test),
    url(r'^authentication/', include('authentication.urls')),
    url(r'^thingyads/', include('thingyads.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls'), namespace='rest_framework'),
]
