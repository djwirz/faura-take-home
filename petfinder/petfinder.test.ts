import { expect, test, describe, it } from "vitest";
import { getPets, searchPets } from "./petfinder";
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

// stub out some tests to fail
// basic expects that admittedly don't do much
describe("Petfinder API - Search Pets", () => {
  it("should successfully retrieve a list of pets", async () => {
    const response = await searchPets({ location: "San Francisco, CA", type: "dog" });

    expect(response).toBeDefined();
    expect(response).toHaveProperty("animals");
    expect(Array.isArray(response.animals)).toBe(true);
    expect(response.animals.length).toBeGreaterThan(0);
  });

  it("should return an empty list when no pets match the query", async () => {
    const response = await searchPets({ location: "Nowhere, XX", type: "dragon" });

    expect(response).toBeDefined();
    expect(response).toHaveProperty("animals");
    expect(response.animals.length).toBe(0);
  });

  it("should handle missing parameters gracefully ish", async () => {
    await expect(searchPets({})).rejects.toThrow("Invalid search parameters");
  });
});