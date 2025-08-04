// netlify/functions/auth-login.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./utils/database');

exports.handler = async (event, context) 
=> {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 
'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 
'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, 
body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 
'Method not allowed' })
    };
  }

  try {
    const { email, password } = 
JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 
'Email and password required' })
      };
    }

    // Get user from database
    const user = await 
db('users').where({ email }).first();
    
    if (!user || !await 
bcrypt.compare(password, user.password)) 
{
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 
'Invalid credentials' })
      };
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: 
user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: 
process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password from response
    const { password: _, ...userResponse 
} = user;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token,
        user: userResponse
      })
    };
  } catch (error) {
    console.error('Login error:', 
error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 
'Internal server error' })
    };
  }
};
