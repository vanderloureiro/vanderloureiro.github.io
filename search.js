
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

    publications.sort(function(pub1, pub2) {
        if (pub1.pubDate > pub2.pubDate) return 1;
        return -1;
    });
    return publications;
}

function feelFeed(data) {

    const publicationsFeed = document.getElementById('publications-feed-list');

    const publications = orderPublicationsListByDate(data.items);

    console.log(data);
    publications.forEach(item => {
        var content = '<div class="publication-card" id="publication-card">'
        if (item.thumbnail) {
            content += '<img src="'+item.thumbnail+'" alt="">'
        }
        content += '<div class="publication-card-text"><a href="'+item.link+'" target="_blank"><h4>'+item.title+'</h4></a>'
        content += '<p>'+shortenText(toText(item.content),0, 130)+ '...</p>'
        content += '<p class="date">'+customizeDate(item.pubDate)+'</p>'
        content += '</div></div>'
        
        publicationsFeed.insertAdjacentHTML('afterend', content);
    })
}

function toText(node) {
    node = removeImageCredit(node);
    let tag = document.createElement('div')
    tag.innerHTML = node
    node = tag.innerText
    return node
}

function removeImageCredit(content) {
    const UNSPLASH_SIZE = 8;
    var indexSearchUnplash = content.indexOf('Unsplash');
    if (indexSearchUnplash != -1) {
        return content.slice(indexSearchUnplash + UNSPLASH_SIZE, -1);
    }
    return content;
}

function shortenText(text,startingPoint ,maxLength) {
    return text.length > maxLength? text.slice(startingPoint, maxLength) : text
}
 
function customizeDate(date) {
    date = shortenText(date,0,10);
    const formatedDate = date.slice(8, 10) +'/'+ date.slice(5, 7) +'/'+ date.slice(0, 4);
    return formatedDate;
}