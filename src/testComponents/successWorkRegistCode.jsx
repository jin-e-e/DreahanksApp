import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify'
import { createHolidayInfo, createWorkInfo } from '../graphql/mutations'
import TextField from '@mui/material/TextField';
import { useParams } from "react-router-dom";
const WorkRegist = () => {
    const [formState, setFormState] = useState([])
    const { username } = useParams();
    const { month } = useParams();
    const { year } = useParams();
    console.log({ month });

    //現在月日数が入っているリスト
    const [workDates, setWorkDates] = useState([])
    const [workDays, setWorkDays] = useState([])

    const date = new Date();
    //const year = date.getFullYear();
    //const month = date.getMonth() + 1;
    const month2 = month < 10 ? "0" + month : month;
    const initialState = { userName: 'jini', date: '', workStartTime: '', workEndTime: '0', workRestTime: '0', contents: 'その他', }
    const [data, setData] = useState(initialState)


    useEffect(() => {
        calMonthDay()
    }, [])

    //현재달의 일수 구해서 리스트에 추가하는 함수
    const calMonthDay = () => {
        const week = ['日', '月', '火', '水', '木', '金', '土'];

        //現在月日数
        const days = new Date(year, month, 0).getDate();
        for (let i = 1; i <= Number(days); i++) {
            if (i < 10) {
                const today = new Date(year + "-" + month2 + "-0" + i).getDay();
                workDays[i - 1] = week[today];
                //土日の場合出退勤を「00：00」にする。
                if ("土" == workDays[i - 1] || "日" == workDays[i - 1]) {
                    formState[i - 1] = { "date": year + month2 + "0" + i, "day": week[today], "userName": username, "workStartTime": "00:00", "workEndTime": "00:00", "workRestTime": "00:00", "contents": "", "month": month, "year": year }
                } else {
                    formState[i - 1] = { "date": year + month2 + "0" + i, "day": week[today], "userName": username, "workStartTime": "09:30", "workEndTime": "18:30", "workRestTime": "01:00", "contents": "", "month": month, "year": year }
                }

            } else {
                const today = new Date(year + "-" + month2 + "-" + i).getDay();
                workDays[i - 1] = week[today];
                if ("土" == workDays[i - 1] || "日" == workDays[i - 1]) {
                    formState[i - 1] = {
                        "date": year + month2 + i, "day": week[today]
                        , "userName": username, "workStartTime": "00:00", "workEndTime": "00:00", "workRestTime": "00:00", "contents": "", "month": month
                        , "year": year
                    }
                } else {
                    formState[i - 1] = {
                        "date": year + month2 + i, "day": week[today]
                        , "userName": username, "workStartTime": "09:30", "workEndTime": "18:30", "workRestTime": "01:00", "contents": "", "month": month
                        , "year": year
                    }
                }

            }
            const doubled = formState.map((number) => number);
            setWorkDates(doubled)
            console.log(workDates)
        };
    }
    function setInput(key, value) {
        // for (let i = 1; i <= formState.length; i++) {

        formState[key].workStartTime = value;
        setValue(value);

        // const doubled = formState.map((number) => number);
        //setWorkDates(doubled)
        //  console.log(formState)
        //};
        //setFormState({ ...formState, [key]: value })
    }
    function setInputEndTime(key, value) {
        formState[key].workEndTime = value;
        setWorkEndTime(value);

    }
    function setInputRestTime(key, value) {
        formState[key].workRestTime = value;
        setWorkRestTime(value);

    }
    function setInputContents(key, value) {
        formState[key].contents = value;
        setContents(value);

    }
    /*勤怠データ追加昨日 */
    async function addHolidayInfo() {
        try {

            //const holidayInfo = {
            //    ...formState, "userName": "jini", "date": "", "workStartTime": "",
            //   "workEndTime": "", "workRestTime": "", "contents": ""
            //}

            //const holidayInfo = {
            //   ...data, "userName": "jini", "date": "", "workStartTime": "",
            //   "workEndTime": "", "workRestTime": "", "contents": ""
            //}

            //setHolidayInfos([...holidayInfos, holidayInfo])
            for (let i = 0; i < formState.length; i++) {
                API.graphql(graphqlOperation(createWorkInfo, { input: formState[i] }))

            }

        } catch (err) {
            console.log('error creating todo:', err)

        }
        //window.location.reload();

    }


    const [value, setValue] = useState('09:30');
    const [workEndTime, setWorkEndTime] = useState('18:30');
    const [workRestTime, setWorkRestTime] = useState('01:00');
    const [contents, setContents] = useState('');

    return <>

        < h2 > DreamHanks勤怠</h2>

        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ textAlign: 'center' }} >日付</TableCell>
                        <TableCell style={{ textAlign: 'center' }} >曜日</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>出勤</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>退勤</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>休み時間</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>備考</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {formState.map((obj, index) =>
                        <TableRow key={index}>
                            <TableCell style={{ textAlign: 'center' }}>{obj.date}</TableCell>
                            {/*土日の場合赤文字にする */}
                            {'土' == obj.day || '日' == obj.day ? <TableCell style={{ textAlign: 'center', color: 'red' }}>{obj.day}</TableCell> : <TableCell style={{ textAlign: 'center' }}>{obj.day}</TableCell>
                            }
                            <TableCell style={{ textAlign: 'center' }}>
                                <input type="time" value={obj.workStartTime} onChange={ev => setInput(index, ev.target.value)}
                                    min="00:00" max="23:59" />
                            </TableCell>

                            <TableCell style={{ textAlign: 'center' }}>
                                <input type="time" value={obj.workEndTime} onChange={ev => setInputEndTime(index, ev.target.value)}
                                    min="00:00" max="23:59" />
                            </TableCell>

                            <TableCell style={{ textAlign: 'center' }}>
                                <input type="time" value={obj.workRestTime} onChange={ev => setInputRestTime(index, ev.target.value)}
                                    min="00:00" max="23:59" />
                            </TableCell>

                            <TableCell style={{ textAlign: 'center' }}>
                                <input type="text" value={obj.contents} onChange={ev => setInputContents(index, ev.target.value)} />
                            </TableCell>

                        </TableRow>
                    )}


                </TableBody>
            </Table>
        </TableContainer>
        <Link to={`/about/${username}`}><Button onClick={() => addHolidayInfo()}>登録</Button></Link>

    </>
};
export default WorkRegist