# Thingy - STS Independent project  
Thingy is a web app that allows users to rent tools or common goods (We call them Thingies) from anyone. You have a set of speakers you don't use often? Write a little description, add some pictures, set a price and you're good to go! You need a drill to help your dad fix the stairs? Get on Thingy, search for a drill an apply for a rent! And you'd better behave, because people will check your reviews.

Thingy was created as part of our semester project. We had a few requirements for this app, but the most important were:  
- Build a web app  
- Your app must create social interactions  
- Do your best, you have **2 months**  

So we pretty much had carte blanche for our project. As a team of 10 people with different skillsets, we assigned roles which suited everyone best.

# The team  
|Name                   | Role                |
|-----------------------|---------------------|
|Astrid Heed            |Communication manager|
|Andre Lerdell          |Usability team       |
|Emil Sundman           |Usability team       |
|Cornelia Wallander     |Front-end dev        |
|Felicia Hökars         |Front-end dev        |
|Guillaume Docquier (me)|Javascript dev       |
|Laura D'Angelo         |Backend dev          |  
|Alexander Groth        |Backend dev          |
|Filip Enblom           |Backend dev          |  

# System design  
Our system is divided in two obvious parts: Front-end and Back-end. We used the Django-Rest framework to set up our backend. It was designed as a RESTful API which the client queried only to load dynamic information on the pages. Our client side uses AngularJS1 to take care of all the routing and all the http requests to our API. As for the actual web pages, we used the Less CSS version of Bootstrap v3.  

<p align="center">
<img src="https://github.com/Guillaume-Docquier/Thingy/blob/master/screens/systemDesign.png"/>
</p>

# Implemented features  
In the current state of Thingy, you can do the following:  
- Create an account.  
- Modify your account settings, such as your profile picture or your private information  
- Post a Thingy. You could add pictures and your area so that users see where they can pick it up.  
- Search for Thingies by different tags such as price range, location, category, etc.  
- Send rent requests which must then be accepted by the Thingy's owner.  
- Send messages to other users.  
- Review other users.  
- See your history of accepted/refused rents to other users.  

Our application does not handle payments and we did not plan to do it.

# Other ideas we didn't implement  
These are features we did not implement because of time or complexity constraints
- Rent a Thingy in a future time
- Calendar view to rent Thingies at a future time
- A view for the Thingies you are currently renting from/to someone else
- An history of the Thingies you have rented from someone else
- Adding geolocation to suggest Thingies in your area
- Suggest Thingies based on your preferences, rencent searches or past rents
- Recover lost password
- Email activation of your account/Thingies to prevent spam
