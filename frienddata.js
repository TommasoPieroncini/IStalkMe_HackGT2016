var photoIDs = new Set();

// Likes
var likesMap = new Map();

//Comments
var commentsMap =  new Map();
var commentsArray = [];
var commentsArraySize = 0;

//Shared Tagged Photos
var tagsMap =  new Map();
var tagsArray = [];
var tagsArraySize = 0;


function getFriendData() {
    //Photo Likes and Comments
    var page = '/me/photos';
    iteratePhotos(page);
    var page2 = '/me/photos/uploaded';
    iteratePhotos(page2);

    //Post Likes and Comments
    var page3 = '/me/posts';
    iteratePosts(page3);
    console.log(likesMap);
    console.log(commentsMap);

    //Shared Tags
    var page4 = '/me/photos';
    iterateSharedTagsPhotos(page4);
    console.log(tagsMap);

}
function iteratePhotos(page) {
    console.log('iteratePhotos running');
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
    console.log('iteratePhotoLikes running');
    if (photo != null) {
        FB.api((photo.id) + '/likes', function(response) {
            if (response.data != null && response.data.length != 0) {
                console.log("iteratePhotoLikes has valid data")
                for (var i = 0; i < response.data.length; i++) {
                    var like = response.data[i];
                    getPhotoLikes(like);
                }
                iteratePhotoLikes(response.paging.next);
            }
        });
    } else {
        return;
    }
}

function getPhotoLikes(like) {
    console.log('getPhotoLikes running');
    if (likesMap.has(like.name)) {
        likesMap.set(like.name, likesMap.get(like.name) + 1);
    } else {
        console.log("Added like to map");
        likesMap.set(like.name,1);
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
    if (comment.from.name in commentsMap) {
        commentsMap[comment.from.name] = commentsMap[comment.from.name] + 1;
    } else {
        commentsMap[comment.from.name] = 1;
        commentsArray[commentsArraySize] = comment.from.name;
        commentsArraySize++;
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
                    getSharedTag(tag);
                }
                iterateSharedTags(response.paging.next);
            }
        });
    } else {
        return;
    }
}

function getSharedTag(tag) {
    if (tag.name in tagsMap) {
        tagsMap[tag.name] = tagsMap[tag.name] + 1;
    } else {
        tagsMap[tag.name] = 1;
        tagsArray[tagsArraySize] = tag.name;
        tagsArraySize++;
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
                    getPostLikes(like);
                }
                iteratePostLikes(response.paging.next);
            }
        });
    } else {
        return;
    }
}

function getPostLikes(like) {
    if (like.name in likesMap) {
        likesMap[like.name] = likesMap[like.name] + 1;
    } else {
        likesMap[like.name] = 1;
        likesArray[likesArraySize] = like.name;
        likesArraySize++;
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
    if (comment.from.name in commentsMap) {
        commentsMap[comment.from.name] = commentsMap[comment.from.name] + 1;
    } else {
        commentsMap[comment.from.name] = 1;
        commentsArray[commentsArraySize] = comment.from.name;
        commentsArraySize++;
    }
}

