

export const data = async () => {
  try {
    // In server-side rendering, we need to use the full URL to the Go backend
    const goBackendUrl = process.env.GO_BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(`${goBackendUrl}/api/test`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error fetching test API data:', error);
    // Return fallback data instead of throwing
    return { status: 'error', message: 'Failed to fetch data' };
  }
};
