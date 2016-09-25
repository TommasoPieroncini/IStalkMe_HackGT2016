var photoIDs = new Set();

//Master Year Maps
var likesYearMap = new Map();
var commentsYearMap = new Map();
var tagsYearMap = new Map();

console.log(likesYearMap);
console.log(commentsYearMap);
console.log(tagsYearMap);

function getFriendData() {
    //Photo Likes and Comments
    var page = '/me/photos';
    iteratePhotos(page);
    var page2 = '/me/photos/uploaded';
    iteratePhotos(page2);

    //Post Likes and Comments
    var page3 = '/me/posts';
    iteratePosts(page3);

    //Shared Tags
    var page4 = '/me/photos';
    iterateSharedTagsPhotos(page4);
<<<<<<< HEAD

    sortMaps();
=======
>>>>>>> c88dd490f27fa5871b77b24814ddd8c6936582b3

}
function iteratePhotos(page) {
    if (page != null) {
        FB.api(page, function(response) {
            if (response.data != null && response.data.length != 0) {
                for (var i = 0; i < response.data.length; i++) {
                    var photo = response.data[i];
                    if (!(photoIDs.has(photo.id))) {
                        iteratePhotoLikes(photo);
                        iteratePhotoComments(photo);
                        photoIDs.add(photo.id);
                    }
                }
                iteratePhotos(response.paging.next);
            }
        });

    } else {
        return;
    }

}

function iteratePhotoLikes(photo) {
    if (photo != null) {
        FB.api((photo.id) + '/likes', function(response) {
            if (response.data != null && response.data.length != 0) {
                for (var i = 0; i < response.data.length; i++) {
                    var like = response.data[i];
                    var year = photo.created_time.substring(0,4);
                    getPhotoLikes(like,year);
                }
                iteratePhotoLikes(response.paging.next);
            }
        });
    } else {
        return;
    }
}

function getPhotoLikes(like,year) {
<<<<<<< HEAD
    if (!likesYearMap.has(year)) {
        likesYearMap.set(year, new Map());
    }
    if (likesYearMap.get(year).has(like.name)) {
        likesYearMap.get(year).set(like.name, (likesYearMap.get(year).get(like.name) + 1));
    } else {
        likesYearMap.get(year).set(like.name,1);
=======
    console.log(year);
    console.log(likesYearMap.has(year));
    if (!likesYearMap.has(year)) {
        likesYearMap.set(year, new Map());
        console.log("added year to likesYearMap");
    }
    if (likesYearMap.get(year).has(like.name)) {
        likesYearMap.get(year).set(like.name, (likesYearMap.get(year).get(like.name) + 1));
        console.log("increased existing name to likesYearMap");
    } else {
        likesYearMap.get(year).set(like.name,1);
        console.log("added new name to likesYearMap");
>>>>>>> c88dd490f27fa5871b77b24814ddd8c6936582b3
    }
}

function iteratePhotoComments(photo) {
    if (photo != null) {
        FB.api(photo.id + '/comments', function(response) {
            if (response.data != null && response.data.length != 0) {
                for (var i = 0; i < response.data.length; i++) {
                    var comment = response.data[i];
                    getPhotoComments(comment);
                }
                iteratePhotoComments(response.paging.next);
            }
        });
    } else {
        return;
    }
}

function getPhotoComments(comment) {
    var year = comment.created_time.substring(0,4);
    if (!commentsYearMap.has(year)) {
        commentsYearMap.set(year, new Map());
    }
    if (commentsYearMap.get(year).has(comment.from.name)) {
        commentsYearMap.get(year).set(comment.from.name, (commentsYearMap.get(year).get(comment.from.name)) + 1);
    } else {
        commentsYearMap.get(year).set(comment.from.name,1);
    }
}

//Shared Tagged Photos
function iterateSharedTagsPhotos(page) {
    if (page != null) {
        FB.api(page, function(response) {
            if (response.data != null && response.data.length != 0) {
                for (var i = 0; i < response.data.length; i++) {
                    var photo = response.data[i];
                    iterateSharedTags(photo);
                }
                iterateSharedTagsPhotos(response.paging.next);
            }
        });

    } else {
        return;
    }
}

function iterateSharedTags(photo) {
    if (photo != null) {
        FB.api(photo.id + '/tags', function(response) {
            if (response.data != null && response.data.length != 0) {
                for (var i = 0; i < response.data.length; i++) {
                    var tag = response.data[i];
                    var year = photo.created_time.substring(0,4);
                    getSharedTag(tag,year);
                }
                iterateSharedTags(response.paging.next);
            }
        });
    } else {
        return;
    }
}

function getSharedTag(tag,year) {
    if (!tagsYearMap.has(year)) {
        tagsYearMap.set(year, new Map());
    }
    if (tagsYearMap.get(year).has(tag.name)) {
        tagsYearMap.get(year).set(tag.name, (tagsYearMap.get(year).get(tag.name)) + 1);
    } else {
        tagsYearMap.get(year).set(tag.name,1);
    }
}

function iteratePosts(page) {
    if (page != null) {
        FB.api(page, function(response) {
            if (response.data != null && response.data.length != 0) {
                for (var i = 0; i < response.data.length; i++) {
                    var post = response.data[i];
                    iteratePostLikes(post);
                    iteratePostComments(post);
                }
                iteratePosts(response.paging.next);
            }
        });
    } else {
        return;
    }
}

function iteratePostLikes(post) {
    if (post != null) {
        FB.api(post.id + '/likes', function(response) {
            if (response.data != null && response.data.length != 0) {
                for (var i = 0; i < response.data.length; i++) {
                    var like = response.data[i];
                    var year = post.created_time.substring(0,4);
                    getPostLikes(like,year);
                }
                iteratePostLikes(response.paging.next);
            }
        });
    } else {
        return;
    }
}

function getPostLikes(like,year) {
<<<<<<< HEAD
    if (!likesYearMap.has(year)) {
        likesYearMap.set(year, new Map());
=======
    console.log("Ran getPostLikes");
    console.log(likesYearMap.has(year));
    if (!likesYearMap.has(year)) {
        likesYearMap.set(year, new Map());
        console.log("added year to likesYearMap from posts");
>>>>>>> c88dd490f27fa5871b77b24814ddd8c6936582b3
    }
    if (likesYearMap.get(year).has(like.name)) {
        likesYearMap.get(year).set(like.name, likesYearMap.get(year).get(like.name) + 1);
    } else {
        likesYearMap.get(year).set(like.name, 1);
    }
}

function iteratePostComments(post) {
    if (post != null) {
        FB.api(post.id + '/comments', function(response) {
            if (response.data != null && response.data.length != 0) {
                for (var i = 0; i < response.data.length; i++) {
                    var comment = response.data[i];
                    getPostComments(comment);
                }
                iteratePostComments(response.paging.next);
            }
        });
    } else {
        return;
    }
}

function getPostComments(comment) {
    var year = comment.created_time.substring(0,4);
    if (!commentsYearMap.has(year)) {
        commentsYearMap.set(year, new Map());
    }
    if (commentsYearMap.get(year).has(comment.from.name)) {
        commentsYearMap.get(year).set(comment.from.name, (commentsYearMap.get(year).get(comment.from.name)) + 1);
    } else {
        commentsYearMap.get(year).set(comment.from.name, 1);
    }
}

function sortMaps() {
    console.log("ran sortMaps");
    likesYearMap.forEach(function(v,k) {
        console.log("sortMap(likesYearMap)");
        sortMap(v);
    });
    commentsYearMap.forEach(function(v,k) {
        console.log("sortMap(commentsYearMap)");
        sortMap(v);
    });
    tagsYearMap.forEach(function(v,k) {
        console.log("sortMap(tagsYearMap)");
        sortMap(v);
    });


}

function sortMap(map) {
    console.log("ran sortMap");
    var sortable = [];
    map.forEach(function(v,k) {
        sortable.push([k,v]);
    });
    sortable.sort(function(a,b) {
        return b[1] - a[1];
    });
    console.log(sortable);
}

