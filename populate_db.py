import os, sys 
#from thingy
#print(settings.BASE_DIR)
script_path = '/home/alexandergroth/Desktop/Thingy-github'

project_dir = os.path.abspath(os.path.join(script_path,'thingyproject' ))
sys.path.insert(0, project_dir)
#os.environment.setdefault('DJANGO_SETTINGS_MODULE', 'thingyproject.settings')
os.environ['DJANGO_SETTINGS_MODULE'] = 'thingyproject.settings'

import django 
django.setup()

from posts.models import Region, Town

def populate():
	region_list = ["Uppsala", "STockholm"]
	town_list = [["Uppsala", "Tirep", "Rimbo"],["Taby", "Sollentuna", "Vasby"]]

	for i in range(len(region_list)):
		region = add_region(region_list[i])
		for elem in town_list[i]:
			add_town(reg=region, name=elem)

def add_region(region_name):
	r = Region.objects.get_or_create(name=region_name)[0]	
	r.save()
	#print (r)
	return r

def add_town(reg, name):
	t = Town.objects.get_or_create(region=reg, name=name)[0]
	
	t.save()
if __name__ == '__main__':
	populate()

	
		 

