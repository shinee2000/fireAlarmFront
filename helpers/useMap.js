import { useQuery } from 'react-query'

export default function useMap() {
    const https = require("https")
    const agent = new https.Agent({
        rejectUnauthorized: false,
    })

    const map = useQuery('Map', async () => {
        const requestOption = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            agent,
      }
    
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/map/get`,
        requestOption
      );
        
      if (!res.ok) {
        console.log('error occurred when fetching map.');
      }
        
      const result = await res.clone().json();
      return result;
    });

    return {
        map,
    }
}
