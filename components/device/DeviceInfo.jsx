import Link from "next/link";
import { useState, useEffect } from "react";
import useStatus from "@/helpers/useStatus";
import useProgOptions from "@/helpers/useProgOptions";
import DeviceProg from "./DeviceProg";
import DeviceMonitor from "./DeviceMonitor";
import DeviceTime from "./DeviceTime";
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DEVICE_STATUS, DEVICE_ENABLE } from "@/constants/status.constant";

function DeviceInfo({device, updateMode}) {
    const router = useRouter();
    const [mode, setMode] = useState(router.query.mode);
    const [chosenProg, setChosenProg] = useState('Шлейфы сигналзаций');
    const [failure, setFailure] = useState(false);
    const [warning, setWarning] = useState(false);
    const [fire, setFire] = useState(false);
    const [secure, setSecure] = useState(false);
    const [technology, setTechnology] = useState(false);
    const [fdisarmed, setfDisarmed] = useState(false);
    const [changedMode, setChangedMode] = useState([]);
    const [changedDate, setChangedDate] = useState(undefined);

    const {status} = useStatus(mode);
    const {options} = useProgOptions();

    const toggleMode = () => {
        if (mode === 'monitor') {
            router.push(`/device/${router.query.id}?mode=prog`);
            setMode('prog');
        }
        else if (mode === 'prog') {
            if(changedMode !== device.data.data.slaveDevices) {
                toast.warning("Өөрчлөлт хадгалагдаагүй.");
            }
            router.push(`/device/${router.query.id}?mode=monitor`);
            setMode('monitor');
        }
    }

    const changeOption = (option) => {
        setChosenProg(option.name);
    }

    useEffect(()=>{
        device.data && device?.data?.data?.slaveDevices && device?.data?.data?.slaveDevices.map((slave)=>{
            if(slave.status === DEVICE_STATUS.failure && slave.enable === DEVICE_ENABLE.armed){
                setFailure(true);
            }
            else if(slave.status === DEVICE_STATUS.warning && slave.enable === DEVICE_ENABLE.armed){
                setWarning(true);
            }
            else if (slave.status === DEVICE_STATUS.fire && slave.enable === DEVICE_ENABLE.armed) {
                setFire(true);
            } 
            else if (slave.status === DEVICE_STATUS.secure && slave.enable === DEVICE_ENABLE.armed) {
                setSecure(true);
            }
            else if (slave.status === DEVICE_STATUS.technology && slave.enable === DEVICE_ENABLE.armed) {
                setTechnology(true);
            }
            else if (slave.status === DEVICE_STATUS.fdisarmed && slave.enable === DEVICE_ENABLE.armed) {
                setfDisarmed(true);
            }
        })

        device?.data?.data && setFailure(
            device.data.data.batteryDisconnected ||
            device.data.data.V200Disconnected ||
            device.data.data.batteryVoltageDrop
        )
    },[device])

    const changeMode = (slaves) => {
        setChangedMode(slaves);
    }

    const changeDate = (date) => {
        setChangedDate(date);
    }

    const save = () => {
        if(changedMode.length === 0 && changedDate === undefined) {
            toast.warning("Өөрчлөлт хийгээгүй байна.");
        }
        else {
            const body = {
                slaves: changedMode,
                date: changedDate
            }
    
            updateMode.mutate(body, {
                onSuccess: (data) => {
                    console.log('data::',data);
                },
                onError: (error) => {
                    console.log('error::',error);
                },
                onSettled: (data) => {
                    console.log('settled:::',data);
                }
            })
            toast.success("Амжилттай хадгалагдлаа.");
            // router.reload(window.location.pathname)
            setChangedMode([]);
            setChangedDate(undefined);
        }
    }
    
    return (
        <div className="h-screen w-full overflow-hidden">
            {(device.isLoading ||
                status.isLoading ||
                options.isLoading) &&
                <div className='h-full w-full flex justify-center items-center'>
                    <span className='font-bold text-slate-800 animate-pulse text-3xl'>Ачааллаж байна...</span>
                </div>
            }
            {!device.isLoading &&    
                !status.isLoading &&
                !options.isLoading &&
                <div className="flex justify-center">
                    <div className="flex flex-col py-8 w-3/4 h-screen overflow-hidden">
                        <div className="grid grid-cols-2 h-1/4">
                            {device.data && <div className="col-span-1 flex flex-col text-xl text-slate-800 justify-center pr-2">
                                <span>
                                    <strong>Төхөөрөмжийн нэр:</strong> {device.data.data.name}
                                </span>
                                <span>
                                    <strong>Суурилуулсан газар:</strong>  {device.data.data.map.name}
                                </span>
                                <span>
                                    <strong>Холбогдох утас:</strong>  {device.data.data.map.phone}
                                </span>
                            </div>}
                            <div className="flex items-center justify-end">
                                <div className={`col-span-1 h-full gap-3 grid h-1/2 ${
                                    mode === 'monitor' ? 'grid-cols-3 w-full' :
                                    'grid-cols-2 w-3/4'
                                }`}>
                                    {status.data && status?.data?.data?.values.map((element, index)=>{
                                        return(
                                            <div className="col-span-1 flex flex-row gap-2 items-center" key={index}>
                                                <div className={`h-5 w-5 rounded ${
                                                    element.color === 'neutral' ? 'bg-neutral-500' :
                                                    element.color === 'orange' ? 'bg-orange-500' :
                                                    element.color === 'green' ? 'bg-green-500' :
                                                    element.color === 'pink' ? 'bg-pink-500' :
                                                    element.color === 'blue' ? 'bg-blue-500' :
                                                    element.color === 'red' ? 'bg-red-500' :
                                                    element.color === 'purple' ? 'bg-purple-500' :
                                                    element.color === 'amber' ? 'bg-amber-500' :
                                                    'bg-slate-50'
                                                }`}></div>
                                                <span>{element.description}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 bg-slate-50 rounded-lg p-4 mt-5 h-3/4">
                            <div className="col-span-1 flex flex-col justify-between h-5/6">
                                {mode === 'monitor' && <div className="flex flex-col h-4/5">
                                    <div className="pl-3 text-xl border-b border-b-slate-800 mb-3 text-slate-900">Мэдэгдэл</div>
                                    <div className="flex flex-col overflow-y-scroll h-96">
                                        {device.data && device?.data?.data?.events && device?.data?.data?.events.map((event, index)=>{
                                            return (
                                                <div className="flex flex-col mb-3 bg-white rounded-lg p-3" key={index}>
                                                    <span>{event.description}</span>
                                                    <div className="flex flex-row gap-2">
                                                        <span>{event.time}</span>
                                                        <span>{event.day}</span>
                                                        <span>{event.date}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>}
                                {mode === 'prog' && <div className="flex flex-col h-4/5">
                                    <div className="pl-3 text-xl border-b border-b-slate-800 mb-3">Тохиргоо</div>
                                    <div className="flex flex-col overflow-y-scroll h-5/6">
                                        {options.data && options?.data?.data?.values.map((option, index)=>{
                                            return (
                                                <div 
                                                    onClick={()=>changeOption(option)} 
                                                    className={`mb-3 rounded-lg p-3 hover:cursor-pointer ${
                                                        option.name === chosenProg ? 'bg-slate-500 text-white hover:bg-slate-600' :
                                                        'bg-white text-slate-800 hover:bg-slate-100'
                                                    }`} 
                                                    key={index}
                                                >
                                                    <span>{option.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>}
                                <div className="flex flex-row justify-around items-end text-white font-bold h-1/5">
                                    <Link href='/'>
                                        <div className="flex justify-center items-center h-3/4 p-3 bg-green-400 rounded-lg w-36 hover:bg-green-500">
                                            <span>Газрын зураг</span>
                                        </div>
                                    </Link>
                                    <a className="hover:cursor-pointer">
                                        <div 
                                            onClick={()=>toggleMode()} 
                                            className="flex justify-center items-center h-1/4 p-3 bg-green-400 rounded-lg w-36 hover:bg-green-500"
                                        >
                                            {mode === 'monitor' && <span>Програмчлах</span>}
                                            {mode === 'prog' && <span>Монитор</span>}
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="col-span-2 flex flex-col justify-between items-between h-5/6">
                                {mode === 'monitor' && device && device.data && <div className="pl-14 mb-3">
                                    <DeviceMonitor device={device} changed={changeMode}/>
                                </div>}
                                {mode === 'prog' && chosenProg === 'Шлейфы сигналзаций' && device &&<div className="pl-14 mb-3">
                                    <DeviceProg device={device} changed={changeMode}/>
                                </div>}
                                {mode === 'prog' && chosenProg === 'Системные' && device && <div className="pl-14 mb-3">
                                    <DeviceTime device={device} changed={changeDate}/>
                                </div>}
                                <div className="col-span-2 flex flex-row justify-between pt-6 px-14">
                                    <div className="flex flex-col text-white font-bold gap-3 text-center">
                                        <div className={`h-14 w-24 rounded flex justify-center items-center p-4 ${
                                            fdisarmed ? 'bg-yellow-400 animate-pulse' :
                                            'bg-slate-400'
                                        }`}>
                                            <span>Гал идэвхгүй</span>
                                        </div>
                                        <div className="h-14 w-24 bg-slate-600 rounded-2xl flex justify-center items-center p-4 hover:cursor-pointer hover:bg-slate-800">
                                            <span>Дуу хаах</span>
                                        </div>
                                        <div 
                                            className="h-14 w-24 bg-slate-600 rounded-2xl flex justify-center items-center p-4 hover:cursor-pointer hover:bg-slate-800"
                                            onClick={()=>save()}
                                        >
                                            <span>Хадгалах</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-white font-bold gap-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className={`h-14 col-span-2 rounded flex justify-center items-center p-4 ${
                                                failure ? 'bg-yellow-400 animate-pulse' :
                                                'bg-slate-400'
                                            }`}>
                                                <span>ШС гэмтэл</span>
                                            </div>
                                            <div className={`h-14 w-24 rounded flex justify-center items-center p-4 ${
                                                warning ? 'bg-purple-500 animate-pulse' :
                                                'bg-slate-400'
                                            }`}>
                                                <span>Анхаар</span>
                                            </div>
                                            <div className={`h-14 w-24 rounded flex justify-center items-center p-4 ${
                                                fire ? 'bg-red-500 animate-pulse' :
                                                'bg-slate-400'
                                            }`}>
                                                <span>Гал</span>
                                            </div>
                                            <div className={`h-14 w-24 rounded flex justify-center items-center p-4 ${
                                                secure ? 'bg-pink-500 animate-pulse' :
                                                'bg-slate-400'
                                            }`}>
                                                <span>Хулгай</span>
                                            </div>
                                            <div className={`h-14 w-24 rounded flex justify-center items-center p-4 ${
                                                technology ? 'bg-orange-500 animate-pulse' :
                                                'bg-slate-400'
                                            }`}>
                                                <span>Технологи</span>
                                            </div>
                                        </div>
                                    </div>
                                    {device.data && <div className="flex flex-col text-white font-bold gap-3 text-center">
                                        <div className={`h-14 w-24 rounded flex justify-center items-center p-4 ${
                                            device.data.data.batteryDisconnected ? 'bg-yellow-400 animate-pulse' :
                                            'bg-slate-400'
                                        }`}>
                                            <span>Батарей салсан</span>
                                        </div>
                                        <div className={`h-14 w-24 rounded flex justify-center items-center p-4 ${
                                            device.data.data.V200Disconnected ? 'bg-yellow-400 animate-pulse' :
                                            'bg-slate-400'
                                        }`}>
                                            <span>220V салсан</span>
                                        </div>
                                        <div className={`h-14 w-24 rounded flex justify-center items-center p-4 ${
                                            device.data.data.batteryVoltageDrop ? 'bg-yellow-400 animate-pulse' :
                                            'bg-slate-400'
                                        }`}>
                                            <span>{'Батарей <10.8V'}</span>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <ToastContainer />
        </div>
    );
}

export default DeviceInfo;