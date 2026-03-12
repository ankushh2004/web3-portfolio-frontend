const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

//* Service to handle all authentication related API calls
const authService = {
  // fetch nonce from backend for given address
  fetchNonce: async (address: string): Promise<string> => {
    const res = await fetch(`${BASE_URL}/auth/nonce?address=${address}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch nonce");
    }

    const data = await res.json();
    return data.nonce;
  },

  // verify signature for given address
  verifySignature: async (
    address: string,
    signature: string,
    message: string,
  ) => {
    const res = await fetch(`${BASE_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        address,
        signature,
        message,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to verify signature");
    }

    const data = await res.json();
    return data;
  },

  // fetch user data from backend using auth cookie
  fetchMe: async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error fetching user :", error);
      return null;
    }
  },

  // remove auth cookie on backend
  logout: async () => {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to logout");
    }
  },
};

export default authService;
