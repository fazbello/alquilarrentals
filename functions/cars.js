// netlify/functions/cars.js
const db = require('./utils/database');
const jwt = require('jsonwebtoken');

const verifyToken = (authHeader) => {
  if (!authHeader || 
!authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  try {
    const token = authHeader.split(' 
')[1];
    return jwt.verify(token, 
process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

exports.handler = async (event, context) 
=> {
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

  try {
    const { httpMethod, path, 
queryStringParameters } = event;
    const carId = path.split('/').pop();

    switch (httpMethod) {
      case 'GET':
        if (carId && carId !== 'cars') {
          // Get single car
          const car = await 
db('cars').where({ id: carId }).first();
          if (!car) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ 
error: 'Car not found' })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(car)
          };
        } else {
          // Get all cars with filters
          let query = db('cars');
          
          if (queryStringParameters) {
            const { status, category, 
orderBy, limit } = 
queryStringParameters;
            
            if (status) query = 
query.where({ status });
            if (category) query = 
query.where({ category });
            if (orderBy) {
              const [field, direction] = 
orderBy.startsWith('-') 
                ? [orderBy.slice(1), 
'desc'] 
                : [orderBy, 'asc'];
              query = 
query.orderBy(field, direction);
            }
            if (limit) query = 
query.limit(parseInt(limit));
          }
          
          const cars = await query;
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(cars)
          };
        }

      case 'POST':
        // Create new car (admin only)
        const user = 
verifyToken(event.headers.authorization);
        if (!user || user.role !== 
'admin') {
          return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ 
error: 'Admin access required' })
          };
        }

        const carData = 
JSON.parse(event.body);
        const newCar = await 
db('cars').insert({
          ...carData,
          created_by: user.userId,
          created_date: new 
Date().toISOString(),
          updated_date: new 
Date().toISOString()
        }).returning('*');

        return {
          statusCode: 201,
          headers,
          body: 
JSON.stringify(newCar[0])
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 
'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Cars API error:', 
error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 
'Internal server error' })
    };
  }
};
