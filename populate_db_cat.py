# -*- coding: utf-8 -*-

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

from posts.models import Category, Subcategory

def populate():
	category_list = ["MOTORS", "HOME & GARDEN" , "BEAUTY, HEALTH & GROCERIES" , "ELECTRONICS" , "LEISURE & HOBBIES" , "BUSINESS", "OTHERS" ]
	subcategory_list = [
["Cars ", "Caravans" , "Truck & Construction" , "Auto Parts & Accessories", "Mopeds" , "Forest - & Agricultural Machinery" , "Boats" , "Motorcycles" , "Snowmobiles","Boat parts & Accessories","Motorcycle parts & Accessories "],
["Building & garden" , "Furniture & Home Furnishings" , "Household & Appliances", "Tools"],
["Clothes & Footwear" , "Accessories & Watches" , "Children 's Clothing & Shoes" ,"Toys"],
["Computer & Video Games" , "Sound & Vision" , "Phones & Accessories"],
["Tickets" , "Pets", "Musical Equipment" , "Travel" , "Hobbies & Collectibles" , "Sports & Leisure" , "Books & Student Literature" , "Horses & Equestrian" , "Bicycles" , "Hunting & Fishing"],
["Business Acquisitions " , "Equipment & Machines" , "Commercial & Real Estate" , "Services" ],
["Others"]
]

	for i in range(len(category_list)):
		category = add_category(category_list[i])
		for elem in subcategory_list[i]:
			add_subcategory(cat=category, name=elem)


def add_category(category_name):
	c = Category.objects.get_or_create(cname=category_name)[0]	
	c.save()
	#print (c)
	return c

def add_subcategory(cat, name):
	s = Subcategory.objects.get_or_create(category=cat, sub_cat_name=name)[0]
	
	s.save()
if __name__ == '__main__':
	populate()
	
		 

