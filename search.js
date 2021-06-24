
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

    const publicationsFeed = document.getElementById('publications-feed-list');

    console.log(publicationsFeed);
    console.log(data);

    data.items.forEach(item => {
        var content = '<div class="publication-card" id="publication-card">'
        content += '<img src="assets/retorno.jpeg" alt="">'
        content += '<div class="publication-card-text"><a href="#"><h4>Retorno amigável de exceções no Spring com ExceptionHandler</h4></a>'
        content += '<p>Eliminando retornos de erro gigantes em requisições Spring com ExceptionHandler e ControllerAdvice</p>'
        content += '<p class="date">17/03/2021</p>'
        content += '</div></div>'
        
        publicationsFeed.insertAdjacentHTML('afterend', content);
    })
}