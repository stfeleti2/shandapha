export async function createClient<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as Promise<T>;
}

export const studioClient = (baseUrl: string) => ({
  workspaces: () => createClient(`${baseUrl}/api/workspaces/summary`),
});

export const registryClient = (baseUrl: string) => ({
  catalog: () => createClient(`${baseUrl}/api/registry/catalog`),
});

export const billingClient = (baseUrl: string) => ({
  plans: () => createClient(`${baseUrl}/api/billing/summary`),
});
