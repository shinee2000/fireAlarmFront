import { useQuery } from 'react-query'

export default function useProgOptions() {
    const https = require("https")
    const agent = new https.Agent({
        rejectUnauthorized: false,
    })

    const options = useQuery('ProgOptions', async () => {
        const requestOption = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            agent,
      }
    
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/const/progOptions`,
        requestOption
      );
        
      if (!res.ok) {
        console.log('error occurred when getting options.');
      }
        
      const result = await res.clone().json();
      return result;
    });

    return {
        options,
    }
}
