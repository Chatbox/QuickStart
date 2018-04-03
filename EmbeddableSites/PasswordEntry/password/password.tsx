import * as React from "react";
import * as ReactDOM from "react-dom";
import  Application  from './Application';

let params = getParamsFromUrl(window.location.href);
console.log(params);

let rootElement = document.getElementById('password')
if (rootElement) {
    ReactDOM.render(
        <Application
            label={params['label']}
            mask={params['mask']}
            password={params['password']}
            width={params['width']}
        />,
        rootElement
    );
}


function getParamsFromUrl(hashBased: string) {
    var query;
    if (hashBased) {
        var pos = location.href.indexOf("?");
        if (pos == -1) return [];
        query = location.href.substr(pos + 1);
    } else {
        query = location.search.substr(1);
    }
    var result = {};
    result['mask'] = '*';
    result['label'] = 'Enter Password';
    result['password'] = '';
    result['width'] = '100%';
    console.log(query);

    var i1 = query.indexOf("label=");
    var i2 = query.indexOf("password=");
    var i3 = query.indexOf("mask=");
    var i4 = query.indexOf("width=");
    var i5 = query.indexOf("callback=");

    if (i1 != -1) {
        if (i2 != -1) result['label'] = decodeURI(query.substring(i1 + 6, i2 - 1));
        else if (i3 != -1) result['label'] = decodeURI(query.substring(i1 + 6, i3 - 1));
        else if (i4 != -1) result['label'] = decodeURI(query.substring(i1 + 6, i4 - 1));
        else if (i5 != -1) result['label'] = decodeURI(query.substring(i1 + 6, i5 - 1));
    }

    if (i2 != -1) {
        if (i3 != -1) result['password'] = decodeURI(query.substring(i2 + 9, i3 - 1));
        else if (i4 != -1) result['password'] = decodeURI(query.substring(i2 + 9, i4 - 1));
        else if (i5 != -1) result['password'] = decodeURI(query.substring(i2 + 9, i5 - 1));
    }

    if (i3 != -1) {
        if (i4 != -1) result['mask'] = decodeURI(query.substring(i3 + 5, i4 - 1));
        else if (i5 != -1) result['mask'] = decodeURI(query.substring(i3 + 5, i5 - 1));
    }

    if (i4 != -1) {
        if (i5 != -1) result['width'] = decodeURI(query.substring(i4 + 6, i5 - 1));
    }

    return result;
}
/*


*/