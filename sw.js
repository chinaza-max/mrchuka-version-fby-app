
const staticCacheName="site-static10"
const dynamicCacheName="site-dynamic3"
const assets=[
    
]

self.addEventListener("install",(event)=>{
    //console.log("installed")
    event.waitUntil(
        caches.open(staticCacheName).then(cache=>{
            cache.addAll(assets)
        })
    )
})  

self.addEventListener("activate",(event)=>{
    console.log("activated")
    event.waitUntil(
        caches.keys().then(keys=>{
            return Promise.all(keys
                .filter(key=>key!==staticCacheName)
                .map(key=>caches.delete(key)))
        })
    )

})

self.addEventListener("fetch",(event)=>{

})











/**   caches.match(event.request).then(cachesRes=>{
        
              return cachesRes || fetch(event.request).then(fetchRes=>{
                return caches.open(dynamicCacheName).then(cache =>{

                    if(event.request.url.indexOf('.html')>-1){}
                    else{
                        cache.put(event.request.url,fetchRes.clone())
                    }
                    return fetchRes;
                })
            })
           // return cachesRes || caches.match("/fallBack.html")
        }) */



        /** '/assets/css/style.css',
    '/assets/css/bootstrap-select.min.css',
    '/assets/css/chatUI.css',
    '/assets/css/datatables.min.css',
    '/assets/css/icofont.css',
    '/assets/css/icofont.min.css',
    '/assets/css/jquery.typeahead.css',
    '/assets/css/simple-line-icons.css',
    '/assets/css/slider.css' */