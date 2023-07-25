// paginas con las que lo prove
let prueba1="https://css-tricks.com",
prueba2="https://www.totalwar.com",
prueba3="https://devir.com.ar",
prueba5="https://www.fauxhammer.com"



// definimos algunos elementos del dom y las url con las que vamos a trabajar y buscar la info
const d=document,
W=window,
$site=d.getElementById("site"),
$loader=d.querySelector(".loader"),
$posts=d.getElementById("posts"),
$template=d.getElementById("post-template").content,
$fragment=d.createDocumentFragment(),
DOMAIN=`${prueba5}`,
SITE=`${DOMAIN}/wp-json`,
API_WP=`${SITE}/wp/v2`,
POSTS =  `${API_WP}/posts?_embed`,
PAGES= `${API_WP}/pages`
CATEGORIES=`${API_WP}/categories`

// esto sirve para poder hacer el scroll infinito
let page=1,
perPage=5


// esta funcion obtiene la info del sitio
function getSiteData() {
    fetch(SITE)
    .then(res=> res.ok ? res.json() : Promise.reject())
    .then(json=>{
        console.log(json)
        $site.innerHTML=`
        <h3>Sitio Web</h3>
        <h2>
            <a href="${json.url}" target="_blank">${json.name}</a>
        </h2>
        <p>${json.description}</p>
        <p>${json.timezone_string}</p>
        `
    })
    .catch(err=>{
        console.log(err);
        let message= err.statusText||"Ocurrio un error"
        $site.innerHTML=`<p>Error ${err.status}: ${message}</p>` 
    })
}

// esta funcion obtiene la informacion de los posteos en el sitio
function getPost() {
    $loader.style.display="block"
    fetch(`${POSTS}&page=${page}&per_page=${perPage}`)
    .then(res=> res.ok ? res.json() : Promise.reject())
    .then(json=>{
        console.log(json)
        
        
        json.forEach(el => {
            let categories="",
            tags="";

            el._embedded["wp:term"][0].forEach(uni=>{categories+=`<li>${uni.name}</li>`})
            el._embedded["wp:term"][1].forEach(uni=>{tags+=`<li>${uni.name}</li>`})


            $template.querySelector(".post-image").src=el._embedded["wp:featuredmedia"][0].source_url;
            $template.querySelector(".post-image").alt=el.title.rendered
            $template.querySelector(".post-title").innerHTML=el.title.rendered
            $template.querySelector(".post-author").innerHTML= el._embedded.author[0].name ? `<img src="${el._embedded.author[0].avatar_urls["48"]}" alt="${el._embedded.author[0].name }">
            <figcaption>${el._embedded.author[0].name}</figcaption>`: ""
            
            $template.querySelector(".post-date").innerHTML= new Date(el.date).toLocaleDateString();
            $template.querySelector(".post-link").href=el.link;
            $template.querySelector(".post-excerpt").innerHTML=el.excerpt.rendered.replace(" [&hellip;]","...");

            $template.querySelector(".post-categories").innerHTML=`
            <p>Categorias:</p>
            <ul>${categories}</ul>
            `
            $template.querySelector(".post-tags").innerHTML=`
            <p>Categorias:</p>
            <ul>${tags}</ul>
            `
            $template.querySelector(".post-content > article").innerHTML=el.content.rendered
           

            
            let $clone=d.importNode($template,true);
            $fragment.appendChild($clone)
        });

        $posts.appendChild($fragment)
        $loader.style.display="block"

    })
    .catch(err=>{
        console.log(err);
        let message= err.statusText||"Ocurrio un error"
        $posts.innerHTML=`<p>Error ${err.status}: ${message}</p>` 
        $loader.style.display="none"
    })
}


d.addEventListener("DOMContentLoaded",()=>{
    getSiteData()
    getPost()
})


//scroll infonito
W.addEventListener("scroll",e=>{
    const {scrollTop,clientHeight,scrollHeight}=d.documentElement;


    // console.log(scrollTop,clientHeight,scrollHeight);
    // console.log(d.documentElement);

    if (scrollTop + clientHeight >= scrollHeight) {
        page++
        // console.log("llegaste");
        getPost()
    }
})



