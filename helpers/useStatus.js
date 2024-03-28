import { useQuery } from 'react-query'

export default function useStatus(mode) {
    const https = require("https")
    const agent = new https.Agent({
        rejectUnauthorized: false,
    })

    const status = useQuery(`Status${mode}`, async () => {
        const requestOption = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({mode: mode}),
            agent,
      }
    
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/const/get`,
        requestOption
      );
        
      if (!res.ok) {
        console.log('error occurred when getting status.');
      }
        
      const result = await res.clone().json();
      return result;
    });

    return {
        status,
    }
}
