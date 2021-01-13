const status = fetch('http://localhost:5000/islogged').then(res => res.text())

status.then(res => {
    data = JSON.parse(res)
    if(data){
        document.getElementById('login').remove()
    }
    else{
        document.getElementById('profile').remove()
    }
})