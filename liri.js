//jquery
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

//npm for API calls: axios
var axios = require('axios');

require("dotenv").config();
// require('dotenv/config')

/**get a given spotify's id and secret */
var keys = require('./keys');
var spotify = keys.spotify;

/**new a given object: nodeSpotify */
var nodeSpotifyApi = require('node-spotify-api');
var nodeSpotify = new nodeSpotifyApi({
    id: spotify.id,
    secret: spotify.secret
});
//npm for API calls: omdb
var omdb = require('omdb');
var fs = require('fs');

var commandsArray = ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"];

// console.log(process.argv);
// console.log(artist);

if (commandsArray.indexOf(process.argv[2]) > -1) {
    // console.log("This command is: " + process.argv[2]);
    /**concert-this
     * test: node liri concert-this David 
    */
    if (process.argv[2] == commandsArray[0]) {
        fs.appendFile('./log.txt', 'User Command: node liri concert-this ' + process.argv[3] + '\n\n', (err) => {
            if (err) throw err;
        });
       concertThis(process.argv[3]);
        
    }
    /** spotify-this-song
     * test: node liri spotify-this-song ghost
    */
    else if (process.argv[2] == commandsArray[1]) {
        var songName =process.argv[3];
       
        if (songName == null) {
            // console.log("Mr. Nobody");
            songName = "The Sign";
        }
        fs.appendFile('./log.txt', 'User Command: node liri spotify-this-song ' +songName + '\n\n', (err) => {
            if (err) throw err;
        });
        // console.log(songName);
        spotifyThisSong(songName);
        
    }
    /** movie-this
     * test: node liri movie-this spider-man
    */
    else if (process.argv[2] == commandsArray[2]) {
        
        var movieName= process.argv[3];
       
        if (movieName == null) {
            // console.log("Mr. Nobody");
            movieName = "Mr. Nobody";
        }
        fs.appendFile('./log.txt', 'User Command: node liri movie-this ' +movieName + '\n\n', (err) => {
            if (err) throw err;
        });
        movieThis(movieName);
        
    }
    /** do-what-it-says*/
    else if (process.argv[2] == commandsArray[3]) {
        fs.appendFile('./log.txt', 'User Command: node liri do-what-it-says \n\n', (err) => {
            if (err) throw err;
        });
        fs.readFile("random.txt",'utf8',function(error,data){
            if(error){
                return console.log(error);
            }
            var cmdArray=data.split(',');
            // console.log(cmdArray);
            var cmd=cmdArray[0].trim();
            var para=cmdArray[1].trim();
            switch(cmd){
                case 'concert-this':
                concertThis(para);
                break;
                case 'spotify-this-song':
                spotifyThisSong(para);
                break;
                case 'movie-this':
                movieThis(para);
                break;
            }
        });

    }
}
function movieThis(movieName){
    var omdbUrl = "http://www.omdbapi.com/?t=" + movieName + "&apikey=64d00155";
        axios.get(omdbUrl)
            .then(function (response) {
                //    console.log(response.data);
                console.log("Title of the movie: ", response.data.Title);
                console.log("Year the movie came out: ", response.data.Year);
                console.log("IMDB Rating of the movie: ", response.data.Ratings[0].Value);
                console.log("Rotten Tomatoes Rating of the movie: ", response.data.Ratings[1].Value);
                console.log("Country where the movie was produced: ", response.data.Country);
                console.log("Language of the movie: ", response.data.Language);
                console.log("Plot of the movie: ", response.data.Plot);
                console.log("Actors in the movie: ", response.data.Actors);
            })
            .catch(function (error) {
                console.log(error);
            });
}
function spotifyThisSong(songName){
// console.log(nodeSpotify.credentials.id);
        // console.log(nodeSpotify.credentials.secret);
        // nodeSpotify.search({ type: 'track', query: process.argv[3] })
        // nodeSpotify.request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
        nodeSpotify.request('https://api.spotify.com/v1/search?query=' + process.argv[3] + '&type=track&offset=0&limit=2')
            .then(function (response) {
                // console.log("response:",response.tracks.items);
                // for (var i = 0; i < response.tracks.items[0].artists.length; i++) {
                //     console.log(response.tracks.items[0].artists[i].name);
                //     console.log(response.tracks.items[0].name);
                // }
                for (var i = 0; i < response.tracks.items.length; i++) {
                    // console.log("******"+i+"******",response.tracks.items[i]);
                    var artistsArray = response.tracks.items[i].artists;
                    for (let j = 0; j < artistsArray.length; j++) {
                        console.log("Artist(s): ", artistsArray[j].name);
                    }
                    console.log("The song's name: ", response.tracks.items[i].name);
                    console.log("A preview link of the song from Spotify: ", response.tracks.items[i].external_urls.spotify);
                    console.log("The album that the song is from: ", response.tracks.items[i].album.name);
                }

            }).catch(function (error) {
                console.log(error);
            });
}
function concertThis(concert){
    var url = "https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp";
    // console.log(url);
    // $.ajax({
    //     url: url,
    //     method: "GET"
    // })
    axios.get(url)
        .then(function (response) {
            // for (var i = 0; i < response.length; i++) {
            //     console.log(response[i].venue.name);
            //     console.log("latitude: " + response[i].venue.latitude + " longitude: " + response[i].venue.longitude + response[i].venue.city + " " + response[i].venue.region + " " + response[i].venue.country);
            //     var date = new Date(response[i].datetime);
            //     console.log((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
            // }
            // console.log(response.data.length);
            for (var i = 0; i < response.data.length; i++) {
                console.log(response.data[i].venue.name);
                console.log("latitude: " + response.data[i].venue.latitude + " longitude: " + response.data[i].venue.longitude + response.data[i].venue.city + " " + response.data[i].venue.region + " " + response.data[i].venue.country);
                var date = new Date(response.data[i].datetime);
                console.log((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}