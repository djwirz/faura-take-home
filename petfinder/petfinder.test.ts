import { describe, expect, test } from "vitest";
import { getPets } from "./petfinder";

describe("Petfinder API", () => {
  test("Should return an array of pets", async () => {
    const response = await getPets();
    expect(response).toHaveProperty("pets");
    expect(response.pets).toBeInstanceOf(Array);
    expect(response.pets.length).toBeGreaterThan(0);
  });
});
