# Instant Apps

## How to Customize
Each of the Instant Apps in this repository are available for customization to use in your own project. 
To make use, simply download the json file of the Instant App you wish to use, then import into your organization.
Once it is there, you are free to add and delte elements to fit your use case. There is a description of 
each Instant App below detailing how the example is put together and what the important elements to note are. 


### Masked Password Entry 
The Password Instant App makes use of two embeddable site elements. Within the embedded site element, the url calls the 
website hosted by chatbox that displays a password entry field. When the user either presses 'Enter' or clicks out of
the text entry field, the password is sent back to the Instant App. The value is then placed into a hidden Single Line 
Input field in the Instant App using the 'Value Changed' event handler for the embeddable site element. 
This is just one way to save the value that is entered, and it is not the only way to do this.

This Instant App then makes use of a second Password Embeddable Site element to do entry validation. The second element
behaves the exact same way as the first, and saves the entered value into another hidden Single Line Input element.
When the user presses the Register button, the two values are compared and only if they are the same, then the user 
will advance to the next pane.


### Photo Gallery
The photo gallery gives an example implementation of how to show a gallery of photos from within an Instant App. The
photo upload element is used with an HTML element and an event handler to allow users to upload and display multiple
photos. This implementation appends an \<img> tag to existing html in the following manner:

``` javascript

var url = "<img style='max-width: 90px; max-height:90px;margin: 5px;' src=";
url = url + app.elements.photo.value.url;
url = url + " />";

var prev = app.elements.gallery.label || "";

app.setElementLabel("gallery", prev + url);

app.setElementValue("photo", "");

```

The final line clears the picture upload element, which allows the user to quickly upload another photo


### FAQ Instant App
The FAQ Example shows a simple way to implement an FAQ search feature from within an Instant App. The only element
used is a Single Line Input to gather the search query. The interesting part is in the action handler
for the Value Changed event for the Single Line Input. The following is an example of what the handler should look like:

``` javascript
if (newValue == "") {
   app.setElementLabel("results", "");
   return;
}

var corpus = [
   {
    "t": "Location",
    "a": "We are located in Seattle, WA."
   },

   ...

   {
      "t": "Tell me about Seattle",
      "a": "2815 <span style='color: red'>Eastlake</span> Ave E."
   }
];

var answers = "<div style='font-size: 14px; line-height: 16px'>";

for (var i = 0; i < corpus.length; i++) {
   print(corpus[i].t);
   var tIndex = corpus[i].t.toLowerCase().indexOf(newValue.toLowerCase());
   var aIndex = corpus[i].a.toLowerCase().indexOf(newValue.toLowerCase());
   if (tIndex != -1 || aIndex != -1) {
      answers = answers + "<div style='padding-bottom: 10px;'>";
      if (tIndex != -1) {
         var t =  corpus[i].t.slice(0, tIndex);
         t = t + "<span style='background: yellow'>" + newValue + "</span>";
         t = t + corpus[i].t.slice(tIndex + newValue.length);

         answers = answers + "<b>" + t + "</b>";
      } else {
         answers = answers + "<b>" + corpus[i].t + "</b>";
      }

      if (aIndex != -1) {
         var a =  corpus[i].a.slice(0, aIndex);
         a = a + "<span style='background: yellow'>" + newValue + "</span>";
         a = a + corpus[i].t.slice(aIndex + newValue.length);
         answers = answers + "<br>" + a;
      } else {
         answers = answers + "<br>" + corpus[i].a;
      }

      answers = answers + "</div>";
   }
}

answers = answers + "</div>";
app.setElementLabel("results", answers);
```

This snippet will select the answers from the corpus where the search text is contained in either the question or the answer.
After an answer has been selected, HTML is constructed and set to an element in the Instant App.
