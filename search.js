
getPublications()

function getPublications() {

    const URL_TO_FETCH = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@vanderloureiro';
    fetch(URL_TO_FETCH, { method: 'GET'})
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

function orderPublicationsListByDate(publications) {
    return publications;
}

function feelFeed(data) {

    const publicationsFeed = document.getElementById('publications-feed-list');

    const publications = orderPublicationsListByDate(data.items);

    publications.forEach(item => {
        var content = '<div class="publication-card" id="publication-card">'
        if (item.thumbnail) {
            content += '<img src="'+item.thumbnail+'" alt="">'
        }
        content += '<div class="publication-card-text"><a href="'+item.link+'" target="_blank"><h4>'+item.title+'</h4></a>'
        content += '<p>Eliminando retornos de erro gigantes em requisições Spring com ExceptionHandler e ControllerAdvice</p>'
        content += '<p class="date">'+customizeDate(item.pubDate)+'</p>'
        content += '</div></div>'
        
        publicationsFeed.insertAdjacentHTML('afterend', content);
    })
}

function customizeDate(date) {
    console.log(date);
    return date;
}