# -*- coding: utf-8 -*-
import os, sys
#from django.utils.safestring import SafeUnicode 
#from thingy
#print(settings.BASE_DIR)
script_path = '/home/alexandergroth/Desktop/Thingy-github'

project_dir = os.path.abspath(os.path.join(script_path,'thingyproject' ))
sys.path.insert(0, project_dir)
#os.environment.setdefault('DJANGO_SETTINGS_MODULE', 'thingyproject.settings')
os.environ['DJANGO_SETTINGS_MODULE'] = 'thingyproject.settings'

import django 
django.setup()
#thingies
#create

from posts.models import Region, Town

#swedish letters is not working - need encoding

def populate_reg():
	region_list = ["Norrbotten", "Västerbotten", "Jämtland", "Västernorrland", "Gävleborg", "Dalarna", "Värmland", "Örebro", "Västmanland", "Uppsala", "Stockholm", "Södermanland", "Skaraborg", "Östergötland", "Göteborg", "Älvsborg", "Jönköping", "Kalmar", "Gotland", "Halland", "Kronoberg", "Blekinge", "Skåne"]
	town_list = [
["Kiruna", "Pajala", "Övertorneå", "Kalix", "Överkalix", "Haparanda", "Gällivare", "Jokkmokk", "Arjeplog", "Boden", "Älvsbyn", "Arvidsjaur", "Piteå", "Luleå"],
["Bjurholm", "Dorotea", "Lycksele", "Malå", "Nordmaling", "Norsjö", "Robertsfors", "Skellefteå", "Sorsele", "Storuman", "Umeå", "Vilhelmina", "Vindeln", "Vännäs", "Åsele"],
["Berg", "Bräcke", "Härjedalen", "Krokom", "Ragunda", "Strömsund", "Åre", "Östersund"],
["Härnösand", "Kramfors", "Sollefteå", "Sundsvall", "Timrå", "Ånge", "Örnsköldsvik"],
["Bollnäs", "Gävle", "Hofors", "Hudiksvall", "Ljusdal", "Nordanstig", "Ockelbo", "Ovanåker", "Sandviken", "Söderhamn"],
["Avesta", "Borlänge", "Falun", "Gagnef", "Hedemora", "Leksand", "Ludvika", "Malung-Sälen", "Mora", "Orsa", "Rättvik", "Smedjebacken", "Säter", "Vansbro", "Älvdalen"],
["Arvika", "Eda", "Filipstad", "Forshaga", "Grums", "Hagfors", "Hammarö", "Karlstad", "Kil", "Kristinehamn", "Munkfors", "Storfors", "Sunne", "Säffle", "Torsby", "Årjäng"],
["Askersund", "Degerfors", "Hallsberg", "Hällefors", "Karlskoga", "Kumla", "Laxå", "Lekeberg", "Lindesberg", "Ljusnarsberg", "Nora", "Örebro"],
["Arboga", "Fagersta", "Hallstahammar", "Kungsör", "Köping", "Norberg", "Sala", "Skinnskatteberg", "Surahammar", "Västerås"],
["Enköping", "Heby", "Håbo", "Knivsta", "Tierp", "Uppsala", "Älvkarleby", "Östhammar"],
["Botkyrka", "Danderyd", "Ekerö", "Haninge", "Huddinge", "Järfälla", "Lidingö", "Nacka", "Norrtälje", "Nykvarn", "Nynäshamn", "Salem", "Sigtuna", "Sollentuna", "Solna", "Stockholms Stad", "Sundbyberg", "Södertälje", "Tyresö", "Täby", "Upplands Väsby", "Upplands-Bro", "Vallentuna", "Vaxholm", "Värmdö", "Österråker"],
["Eskilstuna", "Flen", "Gnesta", "Katrineholm", "Nyköping", "Oxelösund", "Strängnäs", "Trosa", "Vingåker"],
["Essunga", "Falköping", "Grästorp", "Gullspång", "Götene", "Hjo", "Karlsborg", "Lidköping", "Mariestad", "Skara", "Skövde", "Tibro", "Tidaholm", "Töreboda", "Vara"],
["Boxholm", "Finspång", "Kinda", "Linköping", "Mjölby", "Motala", "Norrköping", "Söderköping", "Vadstena", "Valdemarsvik", "Ydre", "Åtvidaberg", "Ödeshög"],
["Göteborgs Stad", "Härryda", "Kungälv", "Lysekil", "Munkedal", "Mölndal", "Orust", "Partille", "Sotenäs", "Stenungsund", "Strömstad", "Tanum", "Tjörn", "Uddevalla", "Öcerkö"],
["Ale", "Alingsås", "Bengtsfors", "Bollebygd", "Borås", "Dals-Ed", "Färgelanda", "Herrljunga", "Lerum", "Lilla Edet", "Mark", "Mellerud", "Svenljunga", "Tranemo", "Trollhättan", "Ulricehamn", "Vårgårda", "Vänersborg", "Åmål"],
["Aneby", "Eksjö", "Gislaved", "Gnosjö", "Habo", "Jönköping", "Mullsjö", "Nässjö", "Sävsjö", "Tranås", "Vaggeryd", "Vetlanda", "Värnamo"],
["Borgholm", "Emmaboda", "Hultsfred", "Högsby", "Kalmar", "Mönsterås", "Mörbylånga", "Nybro", "Oskarshamn", "Torsås", "Vimmerby", "Västervik"],
["Gotland"],
["Falkenberg", "Halmstad", "Hylte", "Kungsbacka", "Laholm", "Varberg"],
["Alvesta", "Lessebo", "Ljungby", "Markaryd", "Tingsryd", "Uppvidinge", "Växjö", "Älmhult"],
["Karlshamn", "Karlskrona", "Olofström", "Ronneby", "Sölvesborg"],
["Båstad", "Osby", "Ängelholm", "Klippan", "Hässleholm", "Helsingborg", "Kristianstad", "Höör", "Hörby", "Landskrona", "Eslöv", "Lund", "Malmö", "Trelleborg", "Ystad", "Simrishamn"]
]

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
	populate_reg()
		 

from posts.models import Category, Subcategory

def populate_cat():
	category_list = ["MOTORS", "HOME & GARDEN", "BEAUTY, HEALTH & GROCERIES", "ELECTRONICS", "LEISURE & HOBBIES",
					 "BUSINESS", "OTHERS"]
	subcategory_list = [
		["Cars ", "Caravans", "Truck & Construction", "Auto Parts & Accessories", "Mopeds",
		 "Forest - & Agricultural Machinery", "Boats", "Motorcycles", "Snowmobiles", "Boat parts & Accessories",
		 "Motorcycle parts & Accessories "],
		["Building & garden", "Furniture & Home Furnishings", "Household & Appliances", "Tools"],
		["Clothes & Footwear", "Accessories & Watches", "Children 's Clothing & Shoes", "Toys"],
		["Computer & Video Games", "Sound & Vision", "Phones & Accessories"],
		["Tickets", "Pets", "Musical Equipment", "Travel", "Hobbies & Collectibles", "Sports & Leisure",
		 "Books & Student Literature", "Horses & Equestrian", "Bicycles", "Hunting & Fishing"],
		["Business Acquisitions ", "Equipment & Machines", "Commercial & Real Estate", "Services"],
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
	populate_cat()
