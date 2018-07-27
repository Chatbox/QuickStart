/**
 *      Sample script actually written in .gs
 *
 *      Script grabs list of contacts from a sheet and puts them into the correct format to upload to a Chatbox List.
 */

function uploadContacts() {
    var spreadsheetId = {SpreadsheetID};
    var rangeName = {SheetRange};
    var values = Sheets.Spreadsheets.Values.get(spreadsheetId, rangeName).values;
    var contacts = [];

    var confirm = Browser.msgBox('Are you sure you want to send?', Browser.Buttons.OK_CANCEL);
    if(confirm=='ok') {

        for (var i = 4; i < values.length; i++) {
            contacts.push({
                identityKey:values[i][0],
                displayName:values[i][1]
            });
        }
        var lists = values[1][1];
        lists = lists.split(",");
        for (var i = 0; i < lists.length; i++) {

            var payload =
                {
                    identityType:"SMS",
                    contacts:contacts
                };
            var headers = {
                accept:'application/json',
                orgAuthToken:values[0][1],
            };
            headers['Content-Type']='application/json';
            var url = "https://bustle.chatbox.com/rest/1.0/contactList/"+lists[i]+"/contacts";
            var options =
                {
                    "method"  : "POST",
                    "contentType":"application/json",
                    "payload" : JSON.stringify(payload),
                    "followRedirects" : true,
                    "headers":headers,
                    "muteHttpExceptions": true
                };

            var result = UrlFetchApp.fetch(url, options);
        }
        Browser.msgBox("Sent request");
    } else {
        Browser.msgBox("NOT SENT");
    }
}
