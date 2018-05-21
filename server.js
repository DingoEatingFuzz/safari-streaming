const http = require('http');
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

http
  .createServer((req, res) => {
    console.log('Connection opened: ', req.url);
    res.on('close', () => {
      console.log('Connection closed');
    });

    if (req.url === '/stream') {
      endlessStream(res);
    } else {
      frontend(res);
    }
  })
  .listen(3000);
