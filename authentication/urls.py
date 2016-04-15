from django.conf.urls import url
from authentication.views import LoginView
from . import views

urlpatterns = [
    url(r'^api/login/$', LoginView.as_view(), name='login'),
    #url(r'^api/login/$', views.login , name='login'),
    url(r'^signup/?$', views.signup),
    #url(r'^$', views.index, name='index'),
    #url(, )
]
