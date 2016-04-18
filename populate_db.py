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

from posts.models import Region, Town, Category, Subcategory

def populate():
	region_list = ['Norrbotten', "Vasterbotten", "Jamtland", " Vasternorrland", " Gavleborg", "Dalarna", "Varmland", " orebro", "Vastmanland", "Uppsala", "Stockholm", "Sodermanland", "Skaraborg", "ostergotland", "Goteborg", "alvsborg", "Jonkoping", "Kalmar", "Gotland", "Halland", "Kronoberg", "Blekinge", "Skane"]
	town_list = [["Kiruna", "Pajala", "overtornea", "Kalix", "overkalix", "Haparanda", "Gallivare", "Jokkmokk", "Arjeplog", "Boden", "alvsbyn", "Arvidsjaur", "Pitea", "Lulea"],
["Bjurholm", "Dorotea", "Lycksele", "Mala", "Nordmaling", "Norsjo", "Robertsfors", "Skelleftea", "Sorsele", "Storuman", "Umea", "Vilhelmina", "Vindeln", "Vannas", "asele"],
["Berg", "Bracke", "Harjedalen", "Krokom", "Ragunda", "Stromsund", "are", "ostersund"],
["Harnosand", "Kramfors", "Solleftea", "Sundsvall", "Timra", "ange", "ornskoldsvik"],
["Bollnas", "Gavle", "Hofors", "Hudiksvall", "Ljusdal", "Nordanstig", "Ockelbo", "Ovanaker", "Sandviken", "Soderhamn"],
["Avesta", "Borlange", "Falun", "Gagnef", "Hedemora", "Leksand", "Ludvika", "Malung-Salen", "Mora", "Orsa", "Rattvik", "Smedjebacken", "Sater", "Vansbro", "alvdalen"],
["Arvika", "Eda", "Filipstad", "Forshaga", "Grums", "Hagfors", "Hammaro", "Karlstad", "Kil", "Kristinehamn", "Munkfors", "Storfors", "Sunne", "Saffle", "Torsby", "arjang"],
["Askersund", "Degerfors", "Hallsberg", "Hallefors", "Karlskoga", "Kumla", "Laxa", "Lekeberg", "Lindesberg", "Ljusnarsberg", "Nora", "orebro"],
["Arboga", "Fagersta", "Hallstahammar", "Kungsor", "Koping", "Norberg", "Sala", "Skinnskatteberg", "Surahammar", "Vasteras"],
["Enkoping", "Heby", "Habo", "Knivsta", "Tierp", "Uppsala", "alvkarleby", "osthammar"],
["Botkyrka", "Danderyd", "Ekero", "Haninge", "Huddinge", "Jarfalla", "Lidingo", "Nacka", "Norrtalje", "Nykvarn", "Nynashamn", "Salem", "Sigtuna", "Sollentuna", "Solna", "Stockholms Stad", "Sundbyberg", "Sodertalje", "Tyreso", "Taby", "Upplands Vasby", "Upplands-Bro", "Vallentuna", "Vaxholm", "Varmdo", "osterraker"],
["Eskilstuna", "Flen", "Gnesta", "Katrineholm", "Nykoping", "Oxelosund", "Strangnas", "Trosa", "Vingaker"],
["Essunga", "Falkoping", "Grastorp", "Gullspang", "Gotene", "Hjo", "Karlsborg", "Lidkoping", "Mariestad", "Skara", "Skovde", "Tibro", "Tidaholm", "Toreboda", "Vara"],
["Boxholm", "Finspang", "Kinda", "Linkoping", "Mjolby", "Motala", "Norrkoping", "Soderkoping", "Vadstena", "Valdemarsvik", "Ydre", "atvidaberg", "odeshog"],
["Goteborgs Stad", "Harryda", "Kungalv", "Lysekil", "Munkedal", "Molndal", "Orust", "Partille", "Sotenas", "Stenungsund", "Stromstad", "Tanum", "Tjorn", "Uddevalla", "ocerko"],
["Ale", "Alingsas", "Bengtsfors", "Bollebygd", "Boras", "Dals-Ed", "Fargelanda", "Herrljunga", "Lerum", "Lilla Edet", "Mark", "Mellerud", "Svenljunga", "Tranemo", "Trollhattan", "Ulricehamn", "Vargarda", "Vanersborg", "amal"],
["Aneby", "Eksjo", "Gislaved", "Gnosjo", "Habo", "Jonkoping", "Mullsjo", "Nassjo", "Savsjo", "Tranas", "Vaggeryd", "Vetlanda", "Varnamo"],
["Borgholm", "Emmaboda", "Hultsfred", "Hogsby", "Kalmar", "Monsteras", "Morbylanga", "Nybro", "Oskarshamn", "Torsas", "Vimmerby", "Vastervik"],
["Gotland"],
["Falkenberg", "Halmstad", "Hylte", "Kungsbacka", "Laholm", "Varberg"],
["Alvesta", "Lessebo", "Ljungby", "Markaryd", "Tingsryd", "Uppvidinge", "Vaxjo", "almhult"],
["Karlshamn", "Karlskrona", "Olofstrom", "Ronneby", "Solvesborg"],
["Bastad", "Osby", "angelholm", "Klippan", "Hassleholm", "Helsingborg", "Kristianstad", "Hoor", "Horby", "Landskrona", "Eslov", "Lund", "Malmo", "Trelleborg", "Ystad", "Simrishamn"]
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
	populate()
		 

