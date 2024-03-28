import { DEVICE_STATUS, DEVICE_MODE } from "@/constants/status.constant";
import { useState, useEffect } from "react";

function DeviceMonitor({device, changed}) {
    const [deviceEnable, setDeviceEnable] = useState();

    useEffect(()=>{
        setDeviceEnable(device.data.data.slaveDevices);
    },[]);

    const changeEnable = (slave, index) => {
        const mode = deviceEnable;
        switch (slave.enable) {
            case DEVICE_MODE.armed:
                slave.enable = DEVICE_MODE.disarmed;
                if (slave.mode === DEVICE_MODE.fire) slave.status = DEVICE_STATUS.fdisarmed;
                break;
            case DEVICE_MODE.disarmed:
                slave.enable = DEVICE_MODE.armed;
                if (slave.mode === DEVICE_MODE.fire) slave.status = DEVICE_STATUS.armed;
                break;
        }

        mode[index] = slave;
        setDeviceEnable([...mode]);
    }

    useEffect(()=>{
        changed(deviceEnable);
    },[deviceEnable])

    return (
        <div className="w-full">
            <div className="mr-14 text-xl text-center mb-2 text-slate-600 font-bold">- Хянах горим -</div>
            <div className="grid grid-cols-6 gap-3">
                {deviceEnable && deviceEnable.map((slave, index)=>{
                                        return (
                        <div 
                            className='col-span-1 h-8 w-10 text-white font-bold hover:cursor-pointer hover:scale-105' 
                            key={index}
                            onClick={()=>changeEnable(slave,index)}
                        >
                            <div className={`rounded h-full w-full flex justify-center items-center transition-all duration-75 ${
                                slave.enable === DEVICE_MODE.disarmed && slave.mode !== DEVICE_MODE.fire ? 'bg-neutral-500' :
                                slave.enable === DEVICE_MODE.disarmed && slave.mode === DEVICE_MODE.fire ? 'bg-amber-500' :
                                slave.status === DEVICE_STATUS.technology ? 'bg-orange-500 animate-pulse' :
                                slave.status === DEVICE_STATUS.armed ? 'bg-green-500 animate-pulse' :
                                slave.status === DEVICE_STATUS.secure ? 'bg-pink-500 animate-pulse' :
                                slave.status === DEVICE_STATUS.failure ? 'bg-blue-500 animate-pulse' :
                                slave.status === DEVICE_STATUS.fire ? 'bg-red-500 animate-pulse' :
                                slave.status === DEVICE_STATUS.warning ? 'bg-purple-500 animate-pulse' :
                                slave.status === DEVICE_STATUS.fdisarmed ? 'bg-amber-500' :
                                //slave.status === DEVICE_STATUS.disarmed ? 'bg-neutral-500' :
                                'bg-neutral-500'
                                //'bg-white'
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

export default DeviceMonitor;