from message.models import *
from datetime import date

def update_requests():

    all_requests = Request.objects.all()
    today = date.today()

    for elem in all_requests:
        if elem.end_date < today:
            if elem.status == 'Accepted':
                elem.status = 'Ended'
                elem.save()

update_requests()





