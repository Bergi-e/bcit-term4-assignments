const http = require('http');
const url = require('url');
const strings = require('./lang/en/en');
const utils = require('./modules/utils');

class Server {
    constructor(port) {
        this.port = port;
    }

    start() {
        const server = http.createServer((req, res) => {
            // Parse the request URL
            const query = url.parse(req.url, true);
            
            // Check if request matches Part B endpoint6
            // We look for 'getDate' in the path
            if (query.pathname.includes('getDate') && req.method === 'GET') {
                this.handleGetDate(req, res, query.query);
            } else {
                // 404 for any other path
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('404 Not Found');
            }
        });

        server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    handleGetDate(req, res, query) {
        // Get the 'name' from query string, default to 'Guest' if missing
        const name = query.name || "Guest";
        
        // Get current server time
        const serverTime = utils.getDate();
        
        // Construct the message (Replacing %1 with the name)
        const message = strings.greeting.replace("%1", name) + serverTime;
        
        // Send Response with Inline CSS for Blue Color
        const htmlResponse = `<div style="color: blue;">${message}</div>`;
        
        // 200 is essentially the HTTP Status for "Success" 
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(htmlResponse);
    }
}

const port = process.env.PORT || 8080;
const myServer = new Server(port);
myServer.start();


