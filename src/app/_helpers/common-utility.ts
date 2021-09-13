export function findPropertyIDFromUrl(urlLink) {
    let oIDFromURL;
    if (urlLink !== undefined) {
        if (urlLink.indexOf('pid') !== -1) {
            if (urlLink.indexOf('?oid=') !== -1) {
                oIDFromURL = urlLink.split("?oid=");
            } else {
                oIDFromURL = urlLink.split("&oid=");
            }
            return oIDFromURL[1].split("&pid=");
        }
    }
}
