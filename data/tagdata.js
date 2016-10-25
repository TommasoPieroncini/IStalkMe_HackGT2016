/**
 * Created by Tommaso on 9/24/2016.
 */
var tagsByYear = {};
var urlsByTag = {};
var yearlyTags = {};
function getAllTags() {
    console.log('Fetching photo information.... ');
    getData('/me/photos?fields=images,created_time');
}

function getData(next) {
    if (next != null) {
        FB.api(next, function(response) {
            for (var i = 0; i < response.data.length; i++) {
                getTags(response.data[i].images[0].source, response.data[i].created_time);
            }
            if (response.paging != null) {
                getData(response.paging.next);
            }
        });
    }
}

function sortMaps() {
    for (var year in tagsByYear) {
        yearlyTags[year] = sortMap(tagsByYear[year]);
    }
}

function sortMap(myMap) {
    var sortable = [];
    myMap.forEach(function(v, k) {
        sortable.push([k, v]);
    });
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    return sortable;
}

function getTags(picUrl, created_time) {
    var year = created_time.substring(0, 4);
    var clarifaiAccessToken = 'AZzXXBkzGSocf2PLif90xk9T3lZVII';
    var encodedUrl = encodeURIComponent(picUrl);
    if (!tagsByYear.hasOwnProperty(year)) {
        tagsByYear[year] = new Map();
        urlsByTag[year] = new Map();
    }
    $.get('https://api.clarifai.com/v1/tag/?access_token=' + clarifaiAccessToken + '&url=' + encodedUrl, function(response) {
        response.results[0].result.tag.classes.forEach(function (tag){
            if (tagsByYear[year].has(tag)) {
                tagsByYear[year].set(tag, tagsByYear[year].get(tag) + 1);
                if (urlsByTag[year].get(tag).length < 100) {
                    urlsByTag[year].get(tag).push(picUrl);
                }
            } else {
                tagsByYear[year].set(tag, 1);
                urlsByTag[year].set(tag, [picUrl]);
            }
        });
    }).done(function() {
        sortMaps();
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}