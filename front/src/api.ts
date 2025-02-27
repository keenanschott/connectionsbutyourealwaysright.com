// ion know what tf im doing

const DEMO_WORDS = [
    "Pizza", "Guitar", "Sunset", "Dragon",
    "Coffee", "Camera", "Rainbow", "Penguin",
    "Rocket", "Cactus", "Wizard", "Dolphin",
    "Bicycle", "Pirate", "Volcano", "Unicorn"
]; // Keep as fallback

// We'll fetch the word list once and cache it
let commonWordsList: string[] = [];

async function fetchCommonWords(): Promise<string[]> {
    if (commonWordsList.length > 0) return commonWordsList;
    
    try {
        const response = await fetch('https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears.txt');
        const text = await response.text();
        commonWordsList = text
            .split('\n')
            .filter(word => 
                word.length >= 3 && 
                word.length <= 12 && 
                !/[^a-zA-Z]/.test(word)
            );
        console.log('Fetched common words list, length:', commonWordsList.length);
        return commonWordsList;
    } catch (error) {
        console.error('Error fetching common words:', error);
        return DEMO_WORDS;
    }
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

async function getCommonWords(count: number): Promise<string[]> {
    const words = await fetchCommonWords();
    const selectedWords: string[] = [];
    
    while (selectedWords.length < count) {
        // Generate random index within the array length
        const randomIndex = Math.floor(Math.random() * words.length);
        const word = words[randomIndex];
        
        // Only add the word if it's not already selected
        if (!selectedWords.includes(word)) {
            selectedWords.push(word);
        }
    }
    
    return selectedWords;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://v4gp52b86h.execute-api.us-east-1.amazonaws.com/prod';

async function getWikipediaWords(count: number): Promise<string[]> {
    // Request more words to account for stricter filtering
    const response = await fetch(
        'https://en.wikipedia.org/w/api.php?' + 
        'action=query&format=json&list=random&rnnamespace=0&rnlimit=25' +
        '&origin=*'
    );
    
    const data = await response.json();
    
    // Common words that might indicate a foreign place name
    const locationIndicators = ['city', 'municipality', 'prefecture', 'district', 'province'];
    
    return data.query.random
        .map((page: any) => page.title)
        .filter(title => 
            // Filter out titles that contain location indicators
            !locationIndicators.some(indicator => 
                title.toLowerCase().includes(indicator)
            )
        )
        .flatMap(title => title.split(/[\s-]/))
        .filter(word => {
            // Basic word validation
            const isValidWord = 
                word.length >= 3 && 
                word.length <= 12 && 
                !/[^a-zA-Z]/.test(word);
            
            // Additional checks
            if (!isValidWord) return false;
            
            // Ensure first character is uppercase (likely a proper noun) and rest are lowercase
            const isProperFormat = 
                word[0] === word[0].toUpperCase() && 
                word.slice(1) === word.slice(1).toLowerCase();
            
            // Skip words that look like abbreviations
            const isNotAbbreviation = 
                !word.split('').every(char => char === char.toUpperCase());
            
            return isProperFormat && isNotAbbreviation;
        })
        .slice(0, count);
}

async function shuffleAndCombineWords(arrays: string[][]): string[] {
    const combined = arrays.flat();
    const result: string[] = [];
    
    while (result.length < 16) {
        const randomIndex = Math.floor(Math.random() * combined.length);
        const word = combined[randomIndex];
        
        if (!result.includes(word)) {
            result.push(word);
        }
    }
    
    return result;
}

export async function fetchWords(): Promise<string[]> {
    try {
        // Random number between 4 and 10 for Wikipedia words
        const wikiWordCount = Math.floor(Math.random() * 3) + 4; // 4 to 10
        const commonWordCount = 16 - wikiWordCount; // Remainder for common words

        console.log(`Fetching ${wikiWordCount} Wikipedia words and ${commonWordCount} common words`);

        const [commonWords, wikiWords] = await Promise.all([
            getCommonWords(commonWordCount),
            getWikipediaWords(wikiWordCount)
        ]);

        console.log('Common words:', commonWords);
        console.log('Wikipedia words:', wikiWords);

        const combinedWords = await shuffleAndCombineWords([commonWords, wikiWords]);
        console.log('Combined words:', combinedWords);

        // If we don't have enough words, fill with demo words
        if (combinedWords.length < 16) {
            console.log('Not enough words, filling with demo words');
            const remaining = 16 - combinedWords.length;
            const fillerWords = DEMO_WORDS
                .filter(word => !combinedWords.includes(word))
                .slice(0, remaining);
            return shuffleAndCombineWords([combinedWords, fillerWords]);
        }

        return combinedWords;
    } catch (error) {
        console.error('Error fetching words:', error);
        return DEMO_WORDS; // Fallback to demo words if anything fails
    }
}

export async function submitWords(selected: string[]): Promise<{ success: boolean, category: string }> {
    // Ensure we're sending exactly 4 words
    if (selected.length !== 4) {
        throw new Error('Must select exactly 4 words');
    }

    const payload = {
        words: selected  // Direct array of 4 words
    };
    
    console.log('Submitting to URL:', `${API_URL}/generate`);
    console.log('Payload:', payload);
    
    const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify(payload)  // This will become {"words": ["word1", "word2", "word3", "word4"]}
    });
    
    if (!response.ok) {
        try {
            const errorData = await response.json();
            console.error('API Error Details:', errorData);
        } catch (e) {
            console.error('No error details available');
        }
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