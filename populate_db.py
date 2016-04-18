import os
os.environment.setdefault('DJANGO_SETTINGS_MODULE', 'thingyproject.settings')

from posts.models import Region, Town

def populate():
	region_list = []
	town_list = []

	for i in range(len(region_list)):
		add_region(region_list[i])
		for elem in town_list[i]:
			add_town(reg=region_list[i], town=elem)

if __name __ == '__main__'
	populate()

	
		 

