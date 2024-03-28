import { useState, useEffect } from 'react';
import { StaticDateTimePicker } from '@mui/x-date-pickers';

import 'react-calendar/dist/Calendar.css';

function DeviceTime({device, changed}) {
    const [show, setShow] = useState(false);

    const deviceDate = device.data.data.date && JSON.parse(device.data.data.dateTime);

    const dateFormat = deviceDate && {
        $D: deviceDate.day,
        $H: deviceDate.hour,
        $L: "en",
        $M: deviceDate.month,
        $W: 1,
        $d: 'Su Jan 1 2023 00:00:00 GMT+0800',
        $m: deviceDate.minute,
        $ms: 0,
        $s: 0,
        $u: undefined,
        $x: {},
        $y: deviceDate.year,
    }

    const [date, setDate] = useState(dateFormat);

    const saveDate = (date) => {
        setDate(date);
        setShow(false);
    }

    useEffect(()=>{
        if (date !== defaultDateTime && date !== dateFormat) {
            changed({
                year: date["$y"],
                month: date["$M"],
                day: date["$D"],
                hour: date["$H"],
                minute: date["$m"]
            });
        }
    },[date]);

    return (
        <div className="flex flex-col w-full py-3 items-center">
            <div className="mr-14 text-xl text-center mb-2 text-slate-600 font-bold">- Цаг тохируулах -</div>
            {date && <div className='w-full p-3 bg-white rounded-lg font-bold text-slate-800 flex flex-row justify-between'
                onClick={()=>setShow(!show)}
            >
                <div className='flex flex-row gap-8'>
                    <div className='flex flex-row'>
                        {date["$y"]}/
                        {date["$M"]+1}/
                        {date["$D"]}
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24"
                            className='ml-3'
                            fill='#475569'>
                                <path d="M17 1c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 
                                1-1v-2zm-12 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 
                                1 1v2zm13 5v10h-16v-10h16zm2-6h-2v1c0 1.103-.897 2-2 2s-2-.897-2-2v-1h-8v1c0 
                                1.103-.897 2-2 2s-2-.897-2-2v-1h-2v18h20v-18zm4 3v19h-22v-2h20v-17h2zm-17 
                                7h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4h-2v-2h2v2zm4 0h-2v-2h2v2zm4 
                                0h-2v-2h2v2z"/>
                        </svg>
                    </div>
                    <div className='flex flex-row'>
                        {("0" + date["$H"]).slice(-2)}:
                        {("0" + date["$m"]).slice(-2)}
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24"
                            className='ml-3'
                            fill='#1e293b'>
                                <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 
                                10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 
                                12v-6h-2v8h7v-2h-5z"/>
                        </svg>
                    </div>
                </div>
                <div className='w-6'>
                    {!show && <svg clipRule="evenodd" 
                        fillRule="evenodd" 
                        strokeLinejoin="round" 
                        strokeMiterlimit="2" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg">
                            <path d="m11.998 2c5.517 0 9.997 4.48 9.997 9.998 0 5.517-4.48 9.997-9.997 
                            9.997-5.518 0-9.998-4.48-9.998-9.997 0-5.518 4.48-9.998 9.998-9.998zm4.843 
                            8.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 
                            0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 
                            5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291z" 
                            fillRule="nonzero"/>
                    </svg>}
                    {show && <svg clipRule="evenodd" 
                        fillRule="evenodd" 
                        strokeLinejoin="round" 
                        strokeMiterlimit="2" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg">
                            <path d="m11.998 21.995c5.517 0 9.997-4.48 9.997-9.997 0-5.518-4.48-9.998-9.997-9.998-5.518 
                            0-9.998 4.48-9.998 9.998 0 5.517 4.48 9.997 9.998 9.997zm4.843-8.211c.108.141.157.3.157.456 
                            0 .389-.306.755-.749.755h-8.501c-.445 0-.75-.367-.75-.755 0-.157.05-.316.159-.457 1.203-1.554 
                            3.252-4.199 4.258-5.498.142-.184.36-.29.592-.29.23 0 .449.107.591.291z" 
                            fillRule="nonzero"/>
                    </svg>}
                </div>
            </div>}
            {show && <div className='relative w-full'>
                <StaticDateTimePicker 
                    orientation="landscape" 
                    className='z-50 absolute border-0 text-slate-800 text-sm font-bold rounded-lg w-full'
                    onAccept={(date)=>saveDate(date)}
                    onClose={()=>setShow(false)}
                    value = {date}
                    onChange={(date)=>setDate(date)}
                />
            </div>}
        </div>
    )
}

export default DeviceTime;

const defaultDateTime = {
    $D: 1,
    $H: 0,
    $L: "en",
    $M: 1,
    $W: 1,
    $d: 'Su Jan 1 2023 00:00:00 GMT+0800',
    $m: 0,
    $ms: 0,
    $s: 0,
    $u: undefined,
    $x: {},
    $y: 2023,
}