const http = require('http');
const https = require('https');
const fs = require('fs');

const endlessStream = res => {
  let count = 0;

  res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  let interval = setInterval(() => {
    count++;
    res.write(`${count}\r\n`);
    if (count >= 100) {
      clearInterval(interval);
      res.end();
    }
  }, 500);
};

const frontend = res => {
  res.write(fs.readFileSync('index.html'));
  res.end();
};

const server = prefix => (req, res) => {
  console.log(`[${prefix}] Connection opened: `, req.url);
  res.on('close', () => {
    console.log(`[${prefix}] Connection closed`);
  });

  if (req.url === '/stream') {
    endlessStream(res);
  } else {
    frontend(res);
  }
};

// keys aren't in source control
const options = {
  key: fs.readFileSync('.keys/privkey.pem'),
  cert: fs.readFileSync('.keys/fullchain.pem'),
};

https.createServer(options, server('https')).listen(3005);
http.createServer(server('http')).listen(3006);
