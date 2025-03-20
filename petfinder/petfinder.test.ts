import { expect, test } from "vitest";
import { getPets } from "./petfinder";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// don't be silly and forget env vars
test("Environment variables should be set", async () => {
  expect(process.env.PET_FINDER_API_KEY).toBeDefined();
  expect(process.env.PET_FINDER_SECRET).toBeDefined();
});

// gots to get a token yo
test("Should successfully retrieve an access token from Petfinder", async () => {
  const token = await fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.PET_FINDER_API_KEY!,
      client_secret: process.env.PET_FINDER_SECRET!,
    }),
  }).then((res) => res.json());

  console.log("OAuth Token Response:", token); // Debugging output
  expect(token).toHaveProperty("access_token");
});

// simple response check to see the datas are coming in
test("Petfinder API should return an array of pets", async () => {
  const response = await getPets();
  expect(response).toHaveProperty("pets");
  expect(response.pets).toBeInstanceOf(Array);
  expect(response.pets.length).toBeGreaterThan(0);
});
