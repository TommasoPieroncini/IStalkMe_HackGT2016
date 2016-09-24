var likesMap = {};
function getFriendData() {
    // var page = '/me/photos';
    // getFriendDataHelper(page);
    page = 'me/photos/uploaded';
    getFriendDataHelper(page);
    console.log(likesMap);
}
function getFriendDataHelper(page) {
    //console.log(page);
    //console.log('ran getFriendData');
    if (page != null) {
        FB.api(page, function(response) {
            //console.log('got response');
            //console.log(response);
            //console.log(response.data.length);
            for (var i = 0; i < response.data.length; i++) {
                var photo = response.data[i];
                getPhotoLikes(photo);
                //console.log('inside for loop');
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
            }
        }
    });
}