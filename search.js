
getPublications()

function getPublications() {

    var myHeaders = new Headers();

    var myInit = { method: 'GET',
                headers: myHeaders};

    const URL_TO_FETCH = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@vanderloureiro';
    fetch(URL_TO_FETCH, myInit)
        .then(function(response) {
            if (response.status == 200) {
                response.json().then(function(data) {
                    feelFeed(data);
                });
            }
        })
        .catch(function(err) { 
            console.error(err);
        });
}

function feelFeed(data) {
    console.log(data);
}