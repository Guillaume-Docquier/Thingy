from message.models import *
from posts.models import Post, Status
from datetime import date

def update_requests():

    all_requests = Request.objects.all()
    today = date.today()

    for elem in all_requests:
        if elem.end_date < today:
            if elem.status == 'Accepted':
                # Update the Thingy status
                post = Post.objects.get(Q(id=elem.thingy.id))
                post.status = Status.objects.get(Q(id=1))
                post.save()
                # Update the Request status
                elem.status = 'Ended'
                elem.save()

update_requests()
