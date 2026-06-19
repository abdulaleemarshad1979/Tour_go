import placesHandler from './places.js';

export default async function handler(req, res) {
  req.query = req.query || {};
  req.query.provider = 'groq';
  return placesHandler(req, res);
}
