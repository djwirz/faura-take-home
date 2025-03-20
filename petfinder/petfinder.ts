import { api } from "encore.dev/api";

interface PetResponse {
  pets: any[];
}

// placeholder response for testing, like to start with green
export const getPets = api(
  { method: "GET", path: "/pets", expose: true },
  async (): Promise<PetResponse> => {
    // valid fake response
    return { pets: [{ id: 1, name: "Stub Pet" }] };
  }
);