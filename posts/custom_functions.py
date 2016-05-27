import urllib
import json

def coordinates(area_code):
    a = urllib.urlopen("http://yourmoneyisnowmymoney.com/api/zipcodes/?zipcode=%s" % area_code)
    http_str = a.read().decode('UTF-8')
    dictionary = json.loads(http_str)
    sub_dict = dictionary['results'][0]

    lng_lat_dict = {k: sub_dict[k] for k in ('lng', 'lat')}

    return lng_lat_dict