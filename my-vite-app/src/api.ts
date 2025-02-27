// ion know what tf im doing

export async function fetchWords(): Promise<string[]> {
    const response = await fetch("/api/words");
    if (!response.ok) throw new Error("Failed to fetch words");
    return response.json();
  }

export async function submitWords(selected: string[]): Promise<{ success: boolean, category: string }> {
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ words: selected.join(", ") }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit words');
  }
  return response.json();
}