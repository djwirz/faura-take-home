import { expect, test, describe, it } from "vitest";
import { getPets, searchPets } from "./petfinder";

// check env vars, no need to pretend I'm an encore expert yet and don't need sanity checks
test("Environment variables should be set", () => {
  expect(process.env.PET_FINDER_API_KEY).toBeDefined();
  expect(process.env.PET_FINDER_SECRET).toBeDefined();
});

// make sure I'm using that token right with the simplest endpoint
test("Petfinder API should return an array of pets", async () => {
  const response = await getPets();
  expect(response).toHaveProperty("pets");
  expect(response.pets).toBeInstanceOf(Array);
  expect(response.pets.length).toBeGreaterThan(0);
});

// use real params for the endpoint not a dragon...
describe("Petfinder API - Search Pets", () => {
  it("should successfully retrieve a list of pets", async () => {
    const response = await searchPets({ location: "San Francisco, CA", type: "dog" });

    expect(response).toBeDefined();
    expect(response).toHaveProperty("animals");
    expect(Array.isArray(response.animals)).toBe(true);
    expect(response.animals.length).toBeGreaterThan(0);
  });

  it("should return an empty list when no pets match the query", async () => {
    const response = await searchPets({ location: "Nunavut, Canada", type: "rabbit" });

    expect(response).toBeDefined();
    expect(response).toHaveProperty("animals");
    expect(response.animals.length).toBe(0);
  });

  it("should throw an error when required parameters are missing", async () => {
    await expect(searchPets({})).rejects.toThrow("Invalid search parameters");
  });
});