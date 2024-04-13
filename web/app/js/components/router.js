document.addEventListener("DOMContentLoaded", function() {
    
    const pages = {
        homePage: createDashboard,
        gamePage: createGates,
        profilePage: openProfilePopup,
        tournamentpage: createtouranmentGate
    };

    function showPage(pageId) {
        document.querySelectorAll("div.page").forEach(Div => {
            document.body.removeChild(Div);
        })
        // console.log(pages[pageId], pageId);
        pages[pageId]();
    }
    
    function navigateTo(pathname) {
        const routes = {
            '/': 'homePage',
            '/home': 'homePage',
            '/game/1v1': 'gamePage',
            '/game/2v2': 'gamePage',
            '/tournament': 'tournamentpage',
            '/game/aiBot': 'gamePage',
            '/profile': 'profilePage',
        };
        const pageId = routes[pathname];
        if (pageId) {
            showPage(pageId);
            document.querySelector("background-component").style.display = "none";
        } else {
            showPage('homePage'); // Default to home page if route not found
            document.querySelector("background-component").style.display = "block";
            if (document.querySelector("popup-dashboard") !== null) {
                const shadowRoot = document.querySelector("popup-dashboard").shadowRoot;
                shadowRoot.querySelectorAll("a#pages").forEach(a => a.addEventListener("click", handleLinkClick));
            }
        }
        if (pageId === 'profilePage' || pageId === 'homePage')
            document.querySelector("background-component").style.display = "block";
    }
    
    function handleLinkClick(event) {
        event.preventDefault();
        const pathname = event.target.getAttribute("href");
        // alert(event.target);
        // console.log(event.target.getAttribute("href"));
        window.history.pushState({}, pathname, window.location.origin + pathname);
        navigateTo(pathname);
    }
    

    window.onpopstate = function(event) {
        navigateTo(window.location.pathname);
    };

    // Initial page load
    navigateTo(window.location.pathname);
});