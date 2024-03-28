import styles from '@/styles/Home.module.css';
import dynamic from 'next/dynamic';
import useMap from '@/helpers/useMap';

const Map = dynamic(() => import('@/components/map/Map'), {
  ssr: false,
});

export default function Home() {
  const { map } = useMap();
  const mapData = map?.data?.data?.values;
  
  setInterval(()=>{
    map.refetch();
  }, 60000);

  return (
    <div className='h-screen w-full overflow-hidden'>
      {map.isLoading && 
        <div className='h-full w-full flex justify-center items-center'>
          <span className='font-bold text-slate-800 animate-pulse text-3xl'>Ачааллаж байна...</span>
        </div>
      }
      {!map.isLoading && 
        <Map mapData = {mapData} />
      }
    </div>
  );
}
