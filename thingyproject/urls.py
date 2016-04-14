from django.conf.urls import patterns, url, include

from thingyproject.views import IndexView

urlpatterns = [
  
    url('^.*$', IndexView.as_view(), name='index'),
    url(r'^authentication/', include('authentication.urls')),
    url(r'^thingyads/', include('thingyads.urls')),

]
