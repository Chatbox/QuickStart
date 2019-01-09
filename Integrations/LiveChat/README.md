# How to Set up Live Chat with Chatbox

This guide will go over how to embed a live chat widget into 
your web page for both authenticated and unauthenticated users.

### Add the Smooch Integration
In the Integrations tile, click the Add Integration button. Next, 
click the Smooch icon (Note: If you do not see the Smooch icon, 
Smooch may not be enabled for your organization. If this is the case, 
please contact your Chatbox administrator for help). On the next 
screen, click "Integrate Now". Name your Live Chat channel on the 
following screen, then click "Save". 


### Unauthenticated Live Chat
Now that you have a Smooch Integration, you are able to add a Live Chat channel.
To do this, from the home screen, click Channels. In Channels, click "Add Channel",
then click "Live Chat". Give your channel a name and press Save.
<br>
<br>
Once you have a Live Chat channel, you are given snippets of code to embed onto your web page. 
For unauthenticated Live Chat, you can simply include the 
\<head\> and \<body\> embed code snippets and you are ready to go. 


### Authenticated Live Chat
To authenticate your users in Live Chat, you will need to edit the given code snippets. 
The \<head\> code has an event listener that looks similar to this:
```javascript
u.addEventListener("load", o), u.open("GET", "https://cdn.chatbox.com/smooch/loader.json", !0), u.responseType = "json", u.send()
    }(window, document, "Chatbox");</script>
```
<br>
You will need to edit this to use Smooch instead of Chatbox and to include your app id. 
Replace the "Chatbox" string with "Smooch", and add another parameter for your app id.
Once you do this, the end of your embed code should look like this:


```javascript
u.addEventListener("load", o), u.open("GET", "https://" + r + ".webloader.smooch.io/", !0), u.responseType = "json", u.send()
    }(window, document, "Smooch", "5bc537g96dc6a1113359600f");</script>
```


You can find your app id in the given \<body\> embed code.
<br>
<br>
The given body code uses Chatbox.init and takes in an object with just one field, appId. 
Change this to look like the following:
```javascript
<script>
    Smooch.init({
        appId: "5bc537g96dc6a1113359600f",
        userId: "UserName",
        jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFwcF81YmE1MjZmOThkYmY0YzAwMjJjY2YwMzQifQ.eyJzY29wZSI6ImFwcFVzZXIiLCJ1c2VySWQiOiJUaGVVc2VySXNKb2UiLCJpYXQiOjE1Mzc1NTE0NDB9.sLNKtDy7EIYMx1XPzzaCAOMC3XjmOm_74RkWt9kAGcc"
    });
</script>
```
The userId is a string that can have any value you like, but must be 
unique within a given Smooch app. The jwt is a token that is used to sign a user in to the Live Chat session. 
To generate this token, you can use the code given in the file signJwt.js in this repository.
This file uses a `KEY_ID` and `SECRET`. Contact Chatbox to get these values for your Smooch App. We do not expose 
these values for security purposes. 

Include the generated jwt in the Smooch.init function and embed 
the \<head\> and \<body\> code snippets in the same manner you 
embed for unauthenticated use, and your users will now be authenticated 
in Live Chat.


### More Resources
Smooch docs on authenticating users: https://docs.smooch.io/guide/authenticating-users/
