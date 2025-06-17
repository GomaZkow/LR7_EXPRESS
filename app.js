require('dotenv').config();
const http = require('http');
const url = require('url');
const db = require('./src/DataBase/db');
const controllers = require('./src/controllers');

const PORT = process.env.PORT || 3000; 

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');

  try {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      if (body) {
        try {
          req.body = JSON.parse(body);
        } catch {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      }

      if (path === '/pools' && method === 'GET') {
        await controllers.poolController.getAll(req, res);
      } else if (path.match(/^\/pools\/\d+$/) && method === 'GET') {
        req.params = { id: path.split('/')[2] };
        await controllers.poolController.getById(req, res);
      } else if (path === '/pools' && method === 'POST') {
        await controllers.poolController.create(req, res);
      } else if (path.match(/^\/pools\/\d+$/) && method === 'PUT') {
        req.params = { id: path.split('/')[2] };
        await controllers.poolController.update(req, res);
      } else if (path.match(/^\/pools\/\d+$/) && method === 'DELETE') {
        req.params = { id: path.split('/')[2] };
        await controllers.poolController.delete(req, res);
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
    });
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
