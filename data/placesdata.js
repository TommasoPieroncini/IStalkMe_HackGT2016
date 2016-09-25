/**
 * Created by David on 9/24/16.
 */
var taggedPlaces = new Array()
function showplacesdata() {
    FB.api("/me?fields=location,hometown,tagged_places", function(response) {
        if (response.location) {
            console.log("Current Location: " + response.location.name)
        }
        if (response.hometown) {
            console.log("Current Location: " + response.location.name)
        }
        storeTaggedPlaces(response.tagged_places);
    });
}

function storeTaggedPlaces(response) {
    taggedPlaces = new Array()
    for (var i = 0; i < response.data.length; i++) {
        taggedPlaces[i] = response.data[i]
    }
    if (response.paging && response.paging.next) {
        taggedPlaces.concat(getTaggedExtraPlaces(response.paging.next));
    }
    storeCities(response);
}

function getTaggedExtraPlaces(next) {
    var tagged = new Array()
    FB.api(next, function(response) {
        for (var i = 0; i < response.data.length; i++) {
            tagged[i] = (response.data[i]);
        }
        if (response.paging && response.paging.next) {
            tagged.concat(getTaggedExtraPlaces(response.paging.next));
        }
        return tagged
    });
}

function storeCities(response) {
    var years = new Set();
    var citieslist = response.data
    var yearToCityMap = {}
    if (response.paging && response.paging.next) {
        citieslist.concat(getIds(response.paging.next));
    }
    for (var i = 0; i < citieslist.length; i++) {
        years.add(citieslist[i].created_time.substring(0,4))
    }
    var myArr = Array.from(years);
    for (var j in myArr) {
        var array = []
        for (var k = 0; k < citieslist.length; k++) {
            if (myArr[j].localeCompare(citieslist[k].created_time.substring(0,4)) == 0) {
                array.push(citieslist[k])
            }
        }
        yearToCityMap[myArr[j]] = array
    }
    predominantCity(citieslist, "all Time");
    predominantCityPerYear(yearToCityMap, years)
    openMapsWindows()
}

function openMapsWindows() {
    initMap();
    //window.open('http://localhost:8000/WebstormProjects/IStalkMe_HackGT2016/show.html?placeskey=' + taggedPlaces)
}

function getIds(next) {
    var cities = new Array()
    FB.api(next, function(response) {
        for (var i = 0; i < response.data.length; i++) {
            cities[i] = (response.data[i]);
        }
        if (response.paging && response.paging.next) {
            cities.concat(getIds(response.paging.next));
        }
    });
}

function predominantCityPerYear(yearToCityMap, years) {
    var myArr = Array.from(years);
    for (var y in myArr) {
        predominantCity(yearToCityMap[myArr[y]], myArr[y])
    }
}

function predominantCity(citieslist, year) {
    var cities = {}
    for (var i = 0; i < citieslist.length; i++) {
        var city = citieslist[i].place.location.city
        if (city in cities) {
            cities[city] = cities[city] + 1
        } else {
            cities[city] = 1
        }
    }
    if (Object.keys(cities).length > 0) {
        var max = cities[Object.keys(cities)[0]];
        var predominantCity = Object.keys(cities)[0]
    }
    for (var key in Object.keys(cities)) {
        if (cities[Object.keys(cities)[key]] > max) {
            max = cities[Object.keys(cities)[key]];
            predominantCity = Object.keys(cities)[key]
        } else if (cities[Object.keys(cities)[key]] == max) {
            if (predominantCity.localeCompare(Object.keys(cities)[key]) != 0) {
                predominantCity = predominantCity.concat(", ")
                predominantCity = predominantCity.concat(Object.keys(cities)[key])
            }
        }
    }
    if (Object.keys(cities).length > 0) {
        console.log("Predominant city " + year + " = " + predominantCity + ", with " + max + " occurrences.")
    }
}