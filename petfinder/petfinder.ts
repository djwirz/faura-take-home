import { api } from "encore.dev/api";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const PETFINDER_API_URL = "https://api.petfinder.com/v2/animals";
const PETFINDER_AUTH_URL = "https://api.petfinder.com/v2/oauth2/token";

const API_KEY = process.env.PET_FINDER_API_KEY;
const API_SECRET = process.env.PET_FINDER_SECRET;

if (!API_KEY || !API_SECRET) {
  throw new Error("Missing API credentials");
}

interface PetfinderAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PetfinderAnimal {
  id: number;
  name: string;
  species: string;
  breeds: { primary: string; secondary?: string; mixed: boolean; unknown: boolean };
  age: string;
  gender: string;
  size: string;
  description?: string;
  photos: { small: string; medium: string; large: string; full: string }[];
  contact: { email?: string; phone?: string; address?: { city?: string; state?: string; postcode?: string } };
}

interface PetfinderSearchResponse {
  animals: PetfinderAnimal[];
  pagination?: { count_per_page: number; total_count: number; current_page: number };
}

async function getAccessToken(): Promise<string> {
  const response = await fetch(PETFINDER_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: API_KEY!,
      client_secret: API_SECRET!,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed: ${errorText}`);
  }

  const data = await response.json() as PetfinderAuthResponse;
  return data.access_token;
}

async function fetchFromPetfinder(endpoint: string, queryParams?: Record<string, string>): Promise<any> {
  const token = await getAccessToken();
  const url = new URL(`${PETFINDER_API_URL}${endpoint}`);
  
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Petfinder API request failed: ${errorText}`);
  }

  return response.json();
}

export const getPets = api(
  { method: "GET", path: "/pets", expose: true },
  async (): Promise<{ pets: PetfinderAnimal[] }> => {
    const data: PetfinderSearchResponse = await fetchFromPetfinder("");
    return { pets: data.animals || [] };
  }
);

export async function searchPets(params: { location?: string; type?: string }): Promise<{ animals: PetfinderAnimal[] }> {
  if (!params.location || !params.type) {
    throw new Error("Invalid search parameters: 'location' and 'type' are required.");
  }

  try {
    const data: PetfinderSearchResponse = await fetchFromPetfinder("", {
      location: params.location,
      type: params.type,
    });

    return { animals: data.animals || [] };
  } catch (error) {
    if (error instanceof Response) {
      const errorData = await error.json() as { detail?: string };
      console.error("Petfinder API Error Details:", JSON.stringify(errorData, null, 2));
      throw new Error(`Petfinder API Error: ${errorData.detail || "Unknown error"}`);
    }
    console.error("Unhandled API Error:", error);
    throw new Error("Failed to fetch pet search results.");
  }
}