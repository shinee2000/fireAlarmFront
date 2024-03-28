import { useQuery, useMutation, useQueryClient } from 'react-query'

export default function useDevice(id) {
    const queryClient = useQueryClient();

    const https = require("https")
    const agent = new https.Agent({
        rejectUnauthorized: false,
    })

    const device = useQuery(`device${id}`, async () => {
      if (!id) {
        return undefined;
      }
      
      const requestOption = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        agent,
      } 
    
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/device/get?id=${id}`,
        requestOption
      );
        
      if (!res.ok) {
        console.log('error occurred when fetching device.');
      }
        
      const result = await res.clone().json();
      return result;
    });

    const updateMode = useMutation(async (body)=>{
      const requestOption = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      } 
    
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/device/update`,
        requestOption
      );
        
      if (!res.ok) {
        console.log('error occurred when saving mode.');
      }
        
      const result = await res.clone().json();
      return result;
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(`device${id}`);
        },
      },
    )

    return {
        device,
        updateMode,
    }
}
