// getting the buttons from the dom
const googleBtn = document.getElementById('google-btn');

// the fetch request to the backend for redirection to the 42 intra auth page
googleBtn.addEventListener('click', () => {

    // google, intra => https://localhost/auth?
    // client -> backend -> google
    // google -> client https://localhost/auth/google?code=123455
    // intra -> client https://localhost/auth/intra?code=123455
    fetch("https://localhost/api/oauth2/google/consent/", {
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