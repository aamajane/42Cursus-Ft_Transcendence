// getting the buttons from the dom
const intraBtn = document.getElementById('intra-btn');

// the fetch request to the backend for redirection to the 42 intra auth page
intraBtn.addEventListener('click', () => {

    fetch("http://localhost/api/oauth2/intra42/consent/", {
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