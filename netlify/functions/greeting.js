const fs = require('fs').promises;
const path = require('path');

const STORAGE_FILE = path.join(process.cwd(), 'greetings.json');
const ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

async function readStorage() {
  try {
    const file = await fs.readFile(STORAGE_FILE, 'utf8');
    return JSON.parse(file || '{}');
  } catch (error) {
    return {};
  }
}

async function writeStorage(data) {
  await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function generateId(length = 7) {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += ID_CHARS.charAt(Math.floor(Math.random() * ID_CHARS.length));
  }
  return id;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod === 'POST') {
    let payload;
    try {
      payload = JSON.parse(event.body || '{}');
    } catch (error) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const { to, from, msg } = payload;
    if (!to || !from || !msg) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Missing greeting data' }) };
    }

    const greetings = await readStorage();
    let id;
    do {
      id = generateId();
    } while (greetings[id]);

    greetings[id] = {
      to: String(to).trim(),
      from: String(from).trim(),
      msg: String(msg).trim(),
      createdAt: new Date().toISOString()
    };
    await writeStorage(greetings);

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({ id })
    };
  }

  if (event.httpMethod === 'GET') {
    const id = event.queryStringParameters && event.queryStringParameters.id;
    if (!id) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Missing id' }) };
    }

    const greetings = await readStorage();
    const greeting = greetings[id];
    if (!greeting) {
      return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Greeting not found' }) };
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(greeting)
    };
  }

  return {
    statusCode: 405,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
