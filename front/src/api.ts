// ion know what tf im doing

const DEMO_WORDS = [
    "Pizza", "Guitar", "Sunset", "Dragon",
    "Coffee", "Camera", "Rainbow", "Penguin",
    "Rocket", "Cactus", "Wizard", "Dolphin",
    "Bicycle", "Pirate", "Volcano", "Unicorn"
];

const API_URL = import.meta.env.VITE_API_URL || 'https://v4gp52b86h.execute-api.us-east-1.amazonaws.com/prod';

export async function fetchWords(): Promise<string[]> {
    // Use hardcoded words instead of API call
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(DEMO_WORDS);
        }, 100);
    });
}

export async function submitWords(selected: string[]): Promise<{ success: boolean, category: string }> {
    console.log('Submitting to URL:', `${API_URL}/generate`);
    console.log('Sending words:', selected);
    
    const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify({ words: selected }),
    });
    
    if (!response.ok) {
        console.error('Failed to submit words:', response.status, response.statusText);
        throw new Error('Failed to submit words');
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    return {
        success: true,
        category: data.idea || 'Unknown Category'
    };
}