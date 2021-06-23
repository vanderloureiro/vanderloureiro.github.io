
console.log(getPublications());

function getPublications() {

    var myHeaders = new Headers();

    var myInit = { method: 'GET',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default' };

    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@vanderloureiro', myInit)
        .then(function(response) {
            return response.blob();
        })
        .then(function(myBlob) {
            //var objectURL = URL.createObjectURL(myBlob);
            //myImage.src = objectURL;
        });
}