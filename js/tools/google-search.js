export class GoogleSearchTool {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://google.serper.dev/search';
    }
    
    getDeclaration() {
        return { 
            name: 'googleSearch',
            description: 'Search the internet using Google Search API',
            parameters: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'The search query'
                    },
                    limit: {
                        type: 'number',
                        description: 'Number of results to return (max 10)',
                        default: 5
                    }
                },
                required: ['query']
            }
        };
    }

    async execute(args) {
        try {
            const { query, limit = 5 } = args;
            
            const headers = new Headers({
                'X-API-KEY': this.apiKey,
                'Content-Type': 'application/json'
            });

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ q: query })
            });

            if (!response.ok) {
                throw new Error(`Search failed with status: ${response.status}`);
            }

            const data = await response.json();
            
            // Extract organic search results
            const results = data.organic || [];
            
            // Return limited number of formatted results
            return results.slice(0, limit).map(item => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet
            }));

        } catch (error) {
            throw new Error(`Search failed: ${error.message}`);
        }
    }
}