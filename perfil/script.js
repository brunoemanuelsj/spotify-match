const user = fetch('http://localhost:5000/getuser',{
        method: 'GET'
    }).then(res => res.text())
    
    user.then(res => {
        var data = JSON.parse(res)
        if(data.image){
            document.getElementById("foto-perfil").src=(data.image.url)
            document.getElementById("user-name").innerHTML = data.name
            document.getElementById("country").innerHTML = `From ${data.country}`
            data.topArtists.map(key => {
                const artista = document.createElement('li')
                artista.innerHTML = key.name
                document.getElementById("artistas-favoritos").appendChild(artista)
            })
            data.topTracks.map(key => {
                const musica = document.createElement('li')
                musica.innerHTML = key.name
                document.getElementById("musicas-favoritas").appendChild(musica)
            })
        }
    })