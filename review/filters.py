import django_filters
from review.models import Review

class ReviewFilter(django_filters.FilterSet):
    class Meta:
        model = Review
        fields = ['reviewed_user', 'review_author']





