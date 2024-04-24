// getting the buttons from the dom
const googleBtn = document.getElementById('google-btn');

// the fetch request to the backend for redirection to the 42 intra auth page
googleBtn.addEventListener('click', () => {

    // google, intra => http://localhost/auth?
    // client -> backend -> google
    // google -> client http://localhost/auth/google?code=123455
    // intra -> client http://localhost/auth/intra?code=123455
    fetch("http://localhost/api/oauth2/google/consent/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        window.location.href = data.url
    })
    .catch(err => console.log(err))
});