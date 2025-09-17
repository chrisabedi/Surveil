import https from 'https'
import fetch from 'node-fetch'
import { URLSearchParams } from 'url';

export class ScryfallClient {


    private agent: https.Agent;

    constructor() {
        this.agent = new https.Agent({
            maxSockets: 10, 
            keepAlive: true, 
            maxFreeSockets: 1,
            keepAliveMsecs: 6000
        });
    }

    private async makeRequestWithPool(url: string){
        try {
             const response = await fetch(url, {
                agent: this.agent,
            });
            const data = await response.text()
            return data
        } catch (error) {
            console.error('Request failed:', error);
        }
    }

    async getCards(data: Record<string,string>) {
        
        const searchParams = new URLSearchParams(data)

        let url = 'https://api.scryfall.com/cards/named?'+ searchParams.toString()
        console.log(url)
        return await this.makeRequestWithPool(url)
    }

}
