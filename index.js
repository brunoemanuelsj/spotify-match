const express = require('express')
const app = express()
const SpotifyWebAPI = require('spotify-web-api-node')
const path = require('path')
const fetch = require('node-fetch')
const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];

const spotifyApi = new SpotifyWebAPI({
  clientId: '5a71ec43c1fe400eb1c0b4ec1dc44bb4',
  clientSecret: '0e6d71814f17413183ab6fd84f71ab80',
  redirectUri: 'http://localhost:5000/callback'
})

app.use(express.static(__dirname))

let user = {}

app.get('/getuser', (req, response) => {
  response.send(user)
})
app.get('/perfil', (req, res) => {
  setTimeout(() => res.sendFile(path.join(__dirname,'/perfil/index.html')), 1000)
})
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'/home/index.html'))
})

app.get('/vincularconta', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes))
})


let isLoggedIn = false

app.get('/islogged', (req, res) => {
  res.send(isLoggedIn)
})

app.get('/redirect', (req, res) => {
  res.redirect('/perfil')
})

app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
  
    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
  
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        let a=false, b=false, c=false

        spotifyApi.getMe().then(res => {
          isLoggedIn=true
          user = {
            name: res.body.display_name,
            image: res.body.images[0],
            country:res.body.country
          }
          a=true
        })

        spotifyApi.getMyTopArtists().then(res => {
          user = {
            ...user, 
            topArtists: res.body.items.slice(0, 5),
          }
          b=true
        })

        spotifyApi.getMyTopTracks().then(res => {
          user = {
            ...user,
            topTracks: res.body.items.slice(0,5)
          }
          c=true
        })

  
        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);
      })
      .catch(error => {
        res.send(`Error getting Tokens: ${error}`);
      });

      setTimeout(() => res.redirect('/'), 1000)
  });



app.listen(5000)