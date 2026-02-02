const http = require('http');
const url = require('url');
const strings = require('./lang/en/en');
const utils = require('./modules/utils');
const fs = require('fs');

class Server {
    constructor(port) {
        this.port = port;
    }

    start() {
        const server = http.createServer((req, res) => {
            // Parse the request URL
            const query = url.parse(req.url, true);
            // Made for a little more modular code, checks name of path
            const path = query.pathname;
            
            // 1st Path for getting the Date
            if (path.includes('getDate') && req.method === 'GET') {
                this.handleGetDate(req, res, query.query);
            } 
            
            // 2nd Path for writing to File
            else if (path.includes('writeFile') && req.method === 'GET') {
                this.handleWriteFile(req, res, query.query);
            }
            
            // 3rd Path for reading from File
            else if (path.includes('readFile') && req.method === 'GET') {
                // Extract filename from URL (/readFile/file.txt)
                // Only take the last part (file.txt)
                const filename = path.split('/').pop();
                this.handleReadFile(req, res, filename);
            }

            // Default path to ensure server is healthy (and take away any 404) 
            else if (path === '/' && req.method === 'GET') {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end("Server is running as intended!");
            }

            else {
                // 404 for any other path
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('404 Not Found');
            }
        });

        server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    // Handler for acquiring the date (and displaying in blue along with the time)
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

    // Handler for WRITING (or appending) to the file 
    handleWriteFile(req, res, query) {

        // Check if "text" parameter exists
        if (!query.text) {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end("400 Bad Request: Missing 'text' parameter (e.g., ?text=Hello)");
            return; // Won't write to the file
        }

        const text = query.text || "";
        
        // appendFile() automatically creates the file if it doesn't exist.
        // We add '\n' to ensure each new entry goes on a new line.
        fs.appendFile('file.txt', text + '\n', (err) => {
            if (err) {
                // 500 = Server Error
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("500 Internal Server Error: Could not write to file.");
            } else {
                // 200 = Success
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(`Successfully appended to file.txt: ${text}`);
            }
        });
    }

    // Handler for READING from the file 
    handleReadFile(req, res, filename) {
        // 1. Check if the file requested is actually 'file.txt' (security check)
        // For this lab, I'm only allowing the specific file requested to be read.

        // 2. Check if file exists BEFORE reading (Requirement: Return 404 with filename)
        if (!fs.existsSync(filename)) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end(`404 Error: The file '${filename}' was not found.`);
            return;
        }

        // 3. Read the file
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("500 Internal Server Error: Could not read file.");
            } else {
                res.writeHead(200, {'Content-Type': 'text/plain'}); // text/plain displays content without downloading
                res.end(data);
            }
        });
    }
}

const port = process.env.PORT || 8080;
const myServer = new Server(port);
myServer.start();


