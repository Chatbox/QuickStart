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