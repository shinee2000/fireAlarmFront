import { DEVICE_MODE } from "@/constants/status.constant";
import { useState, useEffect } from "react";

function DeviceProg({device, changed}) {
    const [deviceProg, setDeviceProg] = useState();

    useEffect(()=>{
        setDeviceProg(device.data.data.slaveDevices);
    },[]);

    const changeMode = (slave, index) => {
        const mode = deviceProg;
        switch (slave.mode) {
            case DEVICE_MODE.secure:
                slave.mode = DEVICE_MODE.fire;
                break;
            case DEVICE_MODE.fire:
                slave.mode = DEVICE_MODE.disarmed;
                break;
            case DEVICE_MODE.disarmed:
                slave.mode = DEVICE_MODE.technology;
            break;
            case DEVICE_MODE.technology:
                slave.mode = DEVICE_MODE.secure;
            break;
        }

        mode[index] = slave;
        setDeviceProg([...mode]);
    }

    useEffect(()=>{
        changed(deviceProg);
    },[deviceProg])

    return (
        <div className="w-full">
            <div className="mr-14 text-xl text-center mb-2 text-slate-600 font-bold">- Програмчлах горим -</div>
            <div className="grid grid-cols-6 gap-3">
                {deviceProg && deviceProg.map((slave, index)=>{
                    return (
                        <div 
                            className='col-span-1 h-8 w-10 text-white font-bold hover:cursor-pointer hover:scale-105' 
                            key={index}
                            onClick={()=>changeMode(slave,index)}
                        >
                            <div className={`rounded h-full w-full flex justify-center items-center transition-all duration-75 ${
                                slave.mode === DEVICE_MODE.fire ? 'bg-red-500' :
                                slave.mode === DEVICE_MODE.disarmed ? 'bg-neutral-500' :
                                slave.mode === DEVICE_MODE.secure ? 'bg-green-500' :
                                slave.mode === DEVICE_MODE.technology ? 'bg-orange-500' :
                                'bg-white'
                            }`}>
                                <span>{index + 1}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DeviceProg;