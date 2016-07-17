# Thingy - STS Independent project  
Thingy is a web app that allows users to rent tools or common goods (We call them Thingies) from anyone. You have a set of speakers you don't use often? Write a little description, add some pictures, set a price and you're good to go! You need a drill to help your dad fix the stairs? Get on Thingy, search for a drill an apply for a rent! And you'd better behave, because people will check your reviews.

Thingy was created as part of our semester project. We had a few requirements for this app, but the most important were:  
1. Build a web app  
2. Your app must create social interactions  
3. Do your best, you have **2 months**  

So we pretty much had carte blanche for our project. As a team of 10 people with different skillsets, we assigned roles which suited everyone best.

# The team  
Fredrik Johnson - Project manager  
Astrid Heed - Communication manager  
Andre Lerdell - Usability team  
Emil Sundman - Usability team  
Cornelia Wallander - Front-end dev  
Felicia Hökars - Front-end dev  
Guillaume Docquier (me) - Javascript dev  
Laura D'Angelo - Backend dev  
Alexander Groth - Backend dev  
Filip Enblom - Backend dev  

# System design  
Our system is divided in two obvious parts: Front-end and Back-end. We used the Django-Rest framework to set up our backend. It was designed as a RESTful API which the client queried only to load dynamic information on the pages. Our client side was in fact an Angular app. AngularJS1 takes care of all the routing and all the requests to our API. As for the actual web pages, we used the Less css version of Bootstrap v3.  

# Implemented features  
In the current state of Thingy, you can do the following:  
1. Create an account.  
2. Modify your account settings, such as your profile picture or your private information  
3. Post a Thingy. You could add pictures and your area so that users see where they can pick it up.  
4. Search for Thingies by different tags such as price range, location, category, etc.  
5. Send rent requests which must then be accepted by the Thingy's owner.  
6. Send messages to other users.  
7. Review other users.  
8. See your history of accepted/refused rents.  

Our application does not handle payments and we did not plan it to do it.

# Other ideas we didn't implement  
