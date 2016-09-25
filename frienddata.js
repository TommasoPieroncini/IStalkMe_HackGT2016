var photoIDs = new Set();

//Photo Likes
var photoLikesMap = {};
var photoLikesArray = [];
var photoLikesArraySize = 0;

//Photo Comments
var photoCommentsMap = {};
var photoCommentsArray = [];
var photoCommentsArraySize = 0;

//Shared Tagged Photos
var tagsMap = {};
var tagsArray = [];
var tagsArraySize = 0;

//Post Likes
var postLikesMap = {};
var postLikesArray = [];
var postLikesArraySize = 0;

//Post Comments
var postCommentsMap = {};
var postCommentsArray = [];
var postCommentsArraySize = [];

function getFriendData() {
    //Photo Likes and Comments
    var page = '/me/photos';
    iteratePhotos(page);
    var page2 = 'me/photos/uploaded';
    iteratePhotos(page2);
    console.log(photoLikesMap);
    console.log(photoCommentsMap);
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
    //Post Likes and Comments

    //Post Likes and Comments
    var page3 = 'me/posts';
    iteratePosts(page3);
    console.log(postLikesMap);
    console.log(postCommentsMap);

    //Shared Tags
    var page4 = 'me/photos';
    iterateSharedTagsPhotos(page4);
    console.log(tagsMap);

}
function iteratePhotos(page) {
    if (page != null) {
        FB.api(page, function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var photo = response.data[i];
                if (!(photoIDs.has(photo.id))) {
                    iteratePhotoLikes(photo);
                    iteratePhotoComments(photo);
                    photoIDs.add(photo.id);
                }
            }
            iteratePhotos(response.paging.next);
        });

    } else {
        return;
    }

}

function iteratePhotoLikes(photo) {
    if (photo != null) {
        FB.api(photo.id.concat('/likes'), function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var like = response.data[i];
                getPhotoLikes(like);
            }
            iteratePhotoLikes(response.paging.next);
        });
    } else {
        return;
    }
}

function getPhotoLikes(like) {
    if (like.name in photoLikesMap) {
        photoLikesMap[like.name] = photoLikesMap[like.name] + 1;
    } else {
        photoLikesMap[like.name] = 1;
        photoLikesArray[photoLikesArraySize] = like.name;
        photoLikesArray++;
    }
}

function iteratePhotoComments(photo) {
    if (photo != null) {
        FB.api(photo.id.concat('/comments'), function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var comment = response.data[i];
                getPhotoComments(comment);
            }
            iteratePhotoLikes(response.paging.next);
        });
    } else {
        return;
    }
}

function getPhotoComments(comment) {
    if (comment.from.name in photoCommentsMap) {
        photoCommentsMap[comment.from.name] = photoCommentsMap[comment.from.name] + 1;
    } else {
        photoCommentsMap[comment.from.name] = 1;
        photoCommentsArray[photoCommentsArraySize] = comment.from.name;
        photoCommentsArray++;
    }
}
// function getPhotoLikes(photo) {
//     //console.log('Running getPhotoLikes');
//     //console.log(photo.id);
//     FB.api('/'.concat((photo.id).toString()).concat('/likes'), function(response) {
//         //console.log('Running Likes');
//         //console.log(response.data.length);
//         for (var i = 0; i < response.data.length; i++) {
//             if (response.data[i].name in photoLikesMap) {
//                 photoLikesMap[response.data[i].name] =  photoLikesMap[response.data[i].name] + 1;
//             } else {
//                 photoLikesMap[response.data[i].name] = 1;
//                 photoLikesArray[photoLikesArraySize] = response.data[i].name;
//                 photoLikesArraySize++;
//             }
//         }
//     });
// }

//Shared Tagged Photos
function iterateSharedTagsPhotos(page) {
    if (page != null) {
        FB.api(page, function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var photo = response.data[i];
                iterateSharedTags(photo);
            }
            iterateSharedTagsPhotos(response.paging.next);
        });

    } else {
        return;
    }
}

function iterateSharedTags(photo) {
    if (photo != null) {
        FB.api(photo.id.concat('/tags'), function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var tag = response.data[i];
                getSharedTag(tag);
            }
            iterateSharedTags(response.paging.next);
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

// function getSharedTags(photo) {
//     FB.api('/'.concat((photo.id).toString()).concat('/tags'), function(response) {
//         for (var i = 0; i < response.data.length; i++) {
//             if (response.data[i].name in tagsMap) {
//                 tagsMap[response.data[i].name] =  tagsMap[response.data[i].name] + 1;
//             } else {
//                 tagsMap[response.data[i].name] = 1;
//                 tagsArray[tagsArraySize] = response.data[i].name;
//                 tagsArraySize++;
//             }
//         }
//     });
// }

function iteratePosts(page) {
    if (page != null) {
        FB.api(page, function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var post = response.data[i];
                iteratePostLikes(post);
                iteratePostComments(post);
            }
            iteratePosts(response.paging.next);
        });
    } else {
        return;
    }
}

function iteratePostLikes(post) {
    if (post != null) {
        FB.api(post.id.concat('/likes'), function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var like = response.data[i];
                getPostLikes(like);
            }
            iteratePostLikes(response.paging.next);
        });
    } else {
        return;
    }
}

function getPostLikes(like) {
    if (like.name in postLikesMap) {
        postLikesMap[like.name] = postLikesMap[like.name] + 1;
    } else {
        postLikesMap[like.name] = 1;
        postLikesArray[postLikesArraySize] = like.name;
        postLikesArraySize++;
    }
}

// function getPostLikes(post) {
//     FB.api('/'.concat((post.id).toString()).concat('/likes'), function(response) {
//         for (var i = 0; i < response.data.length; i++) {
//             if (response.data[i].name in tagsMap) {
//                 tagsMap[response.data[i].name] =  tagsMap[response.data[i].name] + 1;
//             } else {
//                 tagsMap[response.data[i].name] = 1;
//                 tagsArray[tagsArraySize] = response.data[i].name;
//                 tagsArraySize++;
//             }
//         }
//     });
// }

function iteratePostComments(post) {
    if (post != null) {
        FB.api(post.id.concat('/comments'), function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var comment = response.data[i];
                getPostComments(comment);
            }
            iteratePostComments(response.paging.next);
        });
    } else {
        return;
    }
}

function getPostComments(comment) {
    if (comment.from.name in postCommentsMap) {
        postCommentsMap[comment.from.name] = postCommentsMap[comment.from.name] + 1;
    } else {
        postCommentsMap[comment.from.name] = 1;
        postCommentsArray[postCommentsArraySize] = comment.from.name;
        postCommentsArraySize++;
    }
}

