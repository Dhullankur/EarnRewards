export async function fetchTransactions() {
  const response = await fetch(`${import.meta.env.BASE_URL}transactions.json`);

  if (!response.ok) {
    throw new Error("Unable to load transactions data.");
  }

  const payload = await response.json();

  return payload.transactions;
}
