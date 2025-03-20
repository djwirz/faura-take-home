import { api } from "encore.dev/api";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const PETFINDER_API_URL = "https://api.petfinder.com/v2/animals";
const PETFINDER_AUTH_URL = "https://api.petfinder.com/v2/oauth2/token";
const PETFINDER_API_KEY = process.env.PET_FINDER_API_KEY;
const PETFINDER_API_SECRET = process.env.PET_FINDER_SECRET;

// get a token from petfinder using the request from the working test
async function getAccessToken(): Promise<string> {
  const response = await fetch(PETFINDER_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: PETFINDER_API_KEY!,
      client_secret: PETFINDER_API_SECRET!,
    }),
  });
  const data = await response.json() as { access_token: string };
  return data.access_token;
}

// use the token, get the pets
export const getPets = api(
  { method: "GET", path: "/pets", expose: true },
  async (): Promise<{ pets: any[] }> => {
    const token = await getAccessToken();
    const response = await fetch(PETFINDER_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json() as { animals?: any[] };
    return { pets: data.animals || [] };
  }
);