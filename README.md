# Bird Journal
This is an application for tracking your observations in the wild.

[Live Project](https://nature-journal.onrender.com/)

NOTE: hosted on free tier of render.com, may take a minute to spin up.

Here is a Work In Progress Screenshot. I will be improving the design.

<img src ="./public/images/screenshot.png" alt="screenshot of nature Journal">

## How It's Made:
This is a node.js/Express API, using EJS templates and a MongoDB database. I built this for [#100devs](https://100devs.org/about).

I originally had all my application logic in server.js but I separated the logic based on MVC architecture.

### Tech Used:
- Javascript
- node.js
- Express
- EJS
- MongoDB
- [render.com](https://render.com/) free hosting

## Optimizations
It is in very early stage development. It needs a lot! 😁
- manage CRUD with mongoDB Ids
- Authentication

## Lessons Learned
### CRUD
I learned about implementing the CRUD operations in a full stack web application.

### .env
I also learned about environment variables.

### MongoDB & Mongoose
I learned about connecting to MongoDB.

I had issues because my database collection had a different name than what I was calling it in my app.

I learned how to use different names for your collections inside the application.

Along the way I somehow generated a "test" database with an "entries" collection. The string I copied from MongoDB Atlas did not have the database name in it. Apparently without a database name in the connection string Mongoose will default to "test".

Specifying the cluster in the connection string is not required but the string MongoDB Atlas gives you will have it in it at the end.

Also specifying the exact collection name in the model as a third parameter was required. If you don't specify one, the lowercase plural tense of the first parameter is supposed to be used.

```
module.exports = mongoose.model('Entry', EntrySchema, 'entries');
```

The line above exports the 'EntrySchema' defined in the model as 'Entry' from the 'entries' collection.

The userId on an entry should be the data type "ObjectId".

### Cloudinary
I learned how to utilize Cloudinary for image hosting.

## Related Projects
<table border="1">
  <tr>
    <td style="text-align: center;"><a href="https://heidi37.pythonanywhere.com/">Let's Do Brunch App</a></td>
  </tr>
  <tr>
    <td><a href="https://heidi37.pythonanywhere.com/"><img width="300" src="https://github.com/heidi37/cs50-final-project/raw/main/static/images/screenshot.png" alt="screenshot of random dog photos web application" /></a></td>
  </tr>
</table>

<table border="1">
  <tr>
    <td style="text-align: center;"><a href="https://heidifryzell.com">My Portfolio</a></td>
  </tr>
  <tr>
    <td><a href="https://heidifryzell.com"><img width="300" src="https://raw.githubusercontent.com/heidi37/my-python-portfolio/main/static/images/screenshot.png" alt="screenshot of web development portfolio built with Python" /></a></td>
  </tr>
</table>