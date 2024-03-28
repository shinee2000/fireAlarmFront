import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { STATUS_CONSTANTS } from '@/constants/status.constant';
import Link from 'next/link';

function Map({ mapData }) {
    const [geoData, setGeoData] = useState(mapData); 
    
    useEffect(()=>{
        setGeoData(mapData)
    },[mapData])

    const center = [47.91855256177987, 106.91765243807724 ];      

    return (
        <MapContainer
            center = {center}
            zoom = {14}
            minZoom={5}
            scrollWheelZoom = {true}
            style={{ height: '100vh' }}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geoData && geoData.map((data, index) => {
                return (
                    <div key = {index}>
                        <Marker 
                            position={[data.lat, data.lng]}
                            icon={L.divIcon({
                                iconSize: [30, 30],
                                iconAnchor: [10, 0],
                                className: `mymarker animate-pulse absolute h-5 w-5 rounded-full ${ 
                                    data.status === STATUS_CONSTANTS.normal ? 'bg-green-500' : 
                                    data.status === STATUS_CONSTANTS.fire ? 'bg-red-600' : 
                                    data.status === STATUS_CONSTANTS.warning ? 'bg-yellow-400' : 
                                    'bg-slate-300'
                                }`
                            })}
                        >
                            <Popup>
                                <div className='w-48 font-sans'>
                                    <div className='flex flex-col gap-1 mb-3'>
                                        <span className='text-slate-800'>{data.name}</span>
                                        <span className='font-bold text-slate-800'>{data.phone}</span>
                                    </div>
                                    {data.masterDevices && data.masterDevices.map((device, index) => {
                                        return (
                                            <div key = {index} className={`mb-1 rounded shadow hover:shadow-md hover:cursor-pointer hover:scale-105 ${ 
                                                device.status === 'fire' ? 'bg-red-600' : 
                                                device.status === 'warning' ? 'bg-yellow-400' : 
                                                'bg-slate-50'
                                            }`}>
                                                    <Link href={`/device/${device.id}?mode=monitor`}>
                                                        <div className='flex flex-row justify-start items-center gap-2 p-2 text-neutral-800'>
                                                            <img className='h-10 w-10' src='/media/devices/device.png'/>
                                                            <span>{device.name}</span>
                                                        </div>
                                                    </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Popup>
                        </Marker>
                    </div>
                );
            })}
        </MapContainer>
    );
}

export default Map;