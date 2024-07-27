import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const openaiApi = axios.create({
    baseURL: 'https://api.openai.com/v1/chat',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
});

export const fetchOpenAIResponse = async (prompt: string) => {
    try {
        const response = await openaiApi.post('completions', {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: [
                        {
                            type: 'text',
                            text: `You are the ultimate taskmaster and deliver the harshest roasts to those who fail to complete their tasks. Come up with epic roasts for people who don't get ${prompt} done. Your roasts should be under 60 characters.`,
                        },
                    ],
                },
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching OpenAI response:', error);
        throw error;
    }
};
