/**
 * Created by Tommaso on 9/24/2016.
 */
function getPhotos(accessToken) {
    console.log('Fetching photo information.... ');
    FB.api('/me/photos', function(response) {
        console.log(response);
        console.log(response.data[0]);
        console.log(response.data.length);
        for (var i = 0; i < response.data.length; i++) {
            console.log(response.data[i].id);
        }
    });
}