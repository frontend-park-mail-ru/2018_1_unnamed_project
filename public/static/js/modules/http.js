(function(){

    const noop = () => null;

    class HttpModule{
        request({method = 'GET', url = '/', data={}, callback = noop} = {}){
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) {
                    return;
                }
    
                if (Math.round(xhr.status / 10) == 20) {
                    const responseText = xhr.responseText;
                    try {
                        const response = JSON.parse(responseText);
                        callback(null, response);
                    } catch (err) {
                        console.error(`${method} error: `, err);
                        callback(err);
                    }
                } else {
                    callback(xhr);
                }
            }

            xhr.withCredentials = true;

            if (method == 'GET'){
                xhr.send();
            }else{
                xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                xhr.send(JSON.stringify(data));
            }
        }
    }

    window.HttpModule = HttpModule;
})();