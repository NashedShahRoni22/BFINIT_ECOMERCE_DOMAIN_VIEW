const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getApi = async (endpoint, token, clientId) => {
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(clientId && { clientid: clientId }),
  };

  const res = await fetch(baseUrl + endpoint, { headers });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await res.json();

  return data;
};
