import { getOrigin } from "../getOrigin";

const API_BASE_URL = process.env.API_BASE_URL;

export async function storeApi(endpoint, options = {}) {
  const origin = await getOrigin();

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        origin: origin,
        ...options.headers,
      },
    });

    return await response.json();
  } catch (error) {
    console.error(`Store API Error [${endpoint}]:`, error);
  }
}
