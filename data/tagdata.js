/**
 * Created by Tommaso on 9/24/2016.
 */
var counter = 0;
var tagsByYear = new Map();
var urlsByTag = new Map();
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
            getData(response.paging.next);
        });
    }
}

function sortMaps() {
    //console.log("TESTING");
    for (var year in tagsByYear) {
        //console.log(year);
        yearlyTags[year] = sortMap(tagsByYear[year], urlsByTag[year]);
    }
}

function sortMap(myMap, myUrlsMap) {
    var sortable = [];
    myMap.forEach(function(v, k) {
        sortable.push([k, v]);
    });
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    console.log(sortable);
    return sortable;
    //console.log(myUrlsMap);
}

function getTags(picUrl, created_time) {
    var year = created_time.substring(0, 4);
    var clarifaiAccessToken = 'LLTZSOSXuGBPgeNPPYqWeVIH0SF5KS';
    var encodedUrl = encodeURIComponent(picUrl);
    if (!tagsByYear.hasOwnProperty(year)) {
        tagsByYear[year] = new Map();
        urlsByTag[year] = new Map();
    }
    $.get('https://api.clarifai.com/v1/tag/?access_token=' + clarifaiAccessToken + '&url=' + encodedUrl, function(response) {
        response.results[0].result.tag.classes.forEach(function (arg){
            //console.log(year);
            if (tagsByYear[year].has(arg)) {
                tagsByYear[year].set(arg, tagsByYear[year].get(arg) + 1);
                if (urlsByTag[year].get(arg).length < 6) {
                    urlsByTag[year].get(arg).push(picUrl);
                }
            } else {
                tagsByYear[year].set(arg, 1);
                urlsByTag[year].set(arg, [picUrl]);
            }
        });
    }).done(function() {
        counter++;
        console.log(counter);
        sortMaps();
    });
}