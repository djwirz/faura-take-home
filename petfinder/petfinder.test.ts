import { describe, expect, test } from "vitest";
import { getPets } from "./petfinder";

test("Petfinder API should return an array of pets", async () => {
  const response = await getPets();
  expect(response.pets).toBeInstanceOf(Array);
});