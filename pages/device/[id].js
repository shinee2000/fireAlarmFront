import { useRouter } from "next/router";
import DeviceInfo from "@/components/device/DeviceInfo";
import useDevice from "@/helpers/useDevice";
import { useState } from "react";

function Device() {
    const router = useRouter();
    const id = router.query.id;
    const {device, updateMode} = useDevice(id);
    const [deviceData, setDeviceData] = useState();

    setInterval(()=>{
        device.refetch();
        setDeviceData({...device});
      }, 5000);

    return (
        <>
        <div className="h-screen w-full overflow-hidden">
            {(device.isLoading || !deviceData) &&
                <div className='h-full w-full flex justify-center items-center'>
                    <span className='font-bold text-slate-800 animate-pulse text-3xl'>Ачааллаж байна...</span>
                </div>
            }
            {device.isSuccess && deviceData && <DeviceInfo device={deviceData} updateMode={updateMode}/>}
        </div>
        </>
    );
}

export default Device;