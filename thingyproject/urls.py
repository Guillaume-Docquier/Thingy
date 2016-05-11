from django.conf.urls import patterns, include, url
from authentication import views
from rest_framework_nested import routers
#from rest_framework import routers

from django.contrib import admin
#from rest_framework.routers import DefaultRouter
from django.conf.urls.static import static
from django.conf import settings

from thingyproject.views import IndexView
from authentication.views import AccountViewSet, LoginView, LogoutView , AuthorPostsViewSet, PhotoList, PhotoDetail
from posts.views import AccountPostsViewSet, PostViewSet, CategoryViewSet, SubCategoryViewSet, \
    RegionViewSet, ConditionViewSet, StatusViewSet
from review.views import ReviewViewSet, ReviewedUserViewSet



admin.autodiscover()

router = routers.SimpleRouter()
#router = DefaultRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'reviewedusers', ReviewedUserViewSet)

router.register(r'reviews', ReviewViewSet)
router.register(r'authorposts',AuthorPostsViewSet)
router.register(r'posts', PostViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubCategoryViewSet)
router.register(r'regions', RegionViewSet)
router.register(r'conditions', ConditionViewSet)
router.register(r'statuses', StatusViewSet)

#router.register(r'userphotos', PhotoList)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account')
accounts_router.register(r'posts', AccountPostsViewSet)

urlpatterns = [
    #url(r'^review/$', views.ReviewList.as_view()),
    url(r'', include(router.urls)),
    url(r'^authorposts/(?P<pk>[0-9]+)/$', AuthorPostsViewSet.as_view({'get': 'retrieve'}), name='index'),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + [
    url(r'^.*$', IndexView.as_view(), name='index'),

]

    # [url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # url(r'^api/v1/', include(router.urls)),
    # url(r'^api/v1/', include(accounts_router.urls)),
    #
    #
    # url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    # url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),
    # url(r'^.*$', IndexView.as_view(), name='index'),]
