
//Photo Likes
var likesMap = {};
var likesPhotoIDs = new Set();
var likesArray = [];
var likesArraySize = 0;

//Shared Tagged Photos
var tagsMap = {};
var tagsPhotoIDs = new Set();
var tagsArray = [];
var tagsArraySize = 0;

function getFriendData() {

    //Photo Likes
    var page = '/me/photos';
    getFriendDataHelper(page);
    var page2 = 'me/photos/uploaded';
    getFriendDataHelper(page2);
    // console.log(likesMap);
    // console.log(likesPhotoIDs);
    // console.log(likesArray);
    // likesArray.sort(function(key1,key2) {
    //         if (likesMap[key1] > likesMap[key2]) {
    //             return 1;
    //         }
    //         if (likesMap[key1] < likesMap[key2]) {
    //             return -1;
    //         }
    //         return 0;
    //     });
    // for (var i = 0; i < likesArraySize; i++) {
    //     console.log(likesArray[i].concat(' : ').concat(likesMap[likesArray[i]]));
    // }

    //Shared Tags
    var page3 = 'me/photos';
    iterateSharedTags(page3);
    console.log(tagsMap);
}
function getFriendDataHelper(page) {
    if (page != null) {
        FB.api(page, function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var photo = response.data[i];
                if (!(likesPhotoIDs.has(photo.id))) {
                    getPhotoLikes(photo);
                    likesPhotoIDs.add(photo.id);
                }
            }
            getFriendDataHelper(response.paging.next);
        });

    } else {
        return;
    }

}
function getPhotoLikes(photo) {
    //console.log('Running getPhotoLikes');
    //console.log(photo.id);
    FB.api('/'.concat((photo.id).toString()).concat('/likes'), function(response) {
        //console.log('Running Likes');
        //console.log(response.data.length);
        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].name in likesMap) {
                likesMap[response.data[i].name] =  likesMap[response.data[i].name] + 1;
            } else {
                likesMap[response.data[i].name] = 1;
                likesArray[likesArraySize] = response.data[i].name;
                likesArraySize++;
            }
        }
    });
}

//Shared Tagged Photos
function iterateSharedTags(page) {
    if (page != null) {
        FB.api(page, function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var photo = response.data[i];
                if (!(tagsPhotoIDs.has(photo.id))) {
                    getSharedTags(photo);
                    tagsPhotoIDs.add(photo.id);
                }
            }
            iterateSharedTags(response.paging.next);
        });

    } else {
        return;
    }
}

function getSharedTags(photo) {
    FB.api('/'.concat((photo.id).toString()).concat('/tags'), function(response) {
        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].name == "Josiah Smith") {
                console.log(photo.id);
            }
            if (response.data[i].name in tagsMap) {
                tagsMap[response.data[i].name] =  tagsMap[response.data[i].name] + 1;
            } else {
                tagsMap[response.data[i].name] = 1;
                tagsArray[tagsArraySize] = response.data[i].name;
                tagsArraySize++;
            }
        }
    });
}