function HttpRequest(method: 'GET' | 'POST', url: string, data = null) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open(method, url);

        xhr.onload = function () {
            if(this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };

        xhr.send(data);
    });
}

export function HttpGet(url: string) {
    return HttpRequest('GET', url);
}

export function HttpPost(url: string, data: any) {
    return HttpRequest('POST', url, data);
}