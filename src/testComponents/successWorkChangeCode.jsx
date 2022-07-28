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
import { updateWorkInfo} from '../graphql/mutations'
import { listWorkInfos } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'
import { useParams } from "react-router-dom";

const WorkChange = () => {
    const [formState, setFormState] = useState([])
    const { username } = useParams();
    const { year } = useParams();
    const { month } = useParams();

    //現在月日数が入っているリスト
    const [workDates, setWorkDates] = useState([])
    const [workDays, setWorkDays] = useState([])
    //const [workInfos, setWorkInfos] = useState([])

    //const date = new Date();
    //const year = date.getFullYear();
    // const month = date.getMonth() + 1;
    //const month2 = month < 10 ? "0" + month : month;

    useEffect(() => {
        calMonthDay()
        fetchHolidayInfos()
    }, [])

    //현재달의 일수 구해서 리스트에 추가하는 함수
    const calMonthDay = () => {
        const week = ['日', '月', '火', '水', '木', '金', '土'];

        //現在月日数
        const days = new Date(year, month, 0).getDate();
        for (let i = 1; i <= Number(days); i++) {
            if (i < 10) {
                const today = new Date(year + "-0" + month + "-0" + i).getDay();
                workDays[i - 1] = week[today];
                formState[i - 1] = { "date": year + "0"+ month + "0" + i, "day": week[today] }
            } else {
                const today = new Date(year + "-" + month + "-" + i).getDay();
                workDays[i - 1] = week[today];
                formState[i - 1] = { "date": year + month + i, "day": week[today] }
            }
        }
        const doubled = formState.map((number) => number);
        setWorkDates(doubled)
    };
    async function fetchHolidayInfos() {
        try {
            const workInfoData = await API.graphql(graphqlOperation(listWorkInfos, {
                filter: { userName: { eq: username }, year: { eq: year }, month: { eq: month } }
            }))
           // const workInfos = workInfoData.data.listWorkInfos.items
            //setWorkInfos(workInfos)
            //const sorted = [...workInfos].sort((a, b) =>
            //    a["date"].toLowerCase() > b["date"].toLowerCase() ? 1 : -1
           // );
           // setWorkInfos(sorted);


            const formState = workInfoData.data.listWorkInfos.items
            setFormState(formState)
            const sorted = [...formState].sort((a, b) =>
                a["date"].toLowerCase() > b["date"].toLowerCase() ? 1 : -1
            );
            setFormState(sorted);
        } catch (err) { console.log('error fetching todos') }
    }
    /*勤怠データ追加昨日 */
    async function updateHolidayInfo() {
        try {
            for (let i = 0; i < formState.length; i++) {
                await API.graphql(
                    graphqlOperation(updateWorkInfo, {
                        input: {
                            id: formState[i].id,
                            workStartTime: formState[i].workStartTime,
                            workEndTime: formState[i].workEndTime,
                            workRestTime: formState[i].workRestTime,
                            contents: formState[i].contents
                        }
                    })
                )
            }

        } catch (err) {
            console.log('error deleting todo:', err)
        }
        window.location.reload();
    }

    function setInput(key, value) {
        formState[key].workStartTime = value;
        setValue(value);
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
                            {('土' == obj.day || '日' == obj.day) ? [
                                <TableCell style={{ textAlign: 'center' }}>{obj.date}</TableCell>,
                                <TableCell style={{ textAlign: 'center', color: 'red' }}>{obj.day}</TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>
                                    <input type="time" value={obj.workStartTime} onChange={ev => setInput(index, ev.target.value)}
                                        min="00:00" max="23:59" />
                                </TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>
                                    <input type="time" value={obj.workEndTime} onChange={ev => setInputEndTime(index, ev.target.value)}
                                        min="00:00" max="23:59" />
                                </TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>
                                    <input type="time" value={obj.workRestTime} onChange={ev => setInputRestTime(index, ev.target.value)}
                                        min="00:00" max="23:59" />
                                </TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>
                                    <input type="text" value={obj.contents} onChange={ev => setInputContents(index, ev.target.value)} />
                                </TableCell>

                            ] :  [
                                <TableCell style={{ textAlign: 'center' }}>{obj.date}</TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>{obj.day}</TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>
                                    <input type="time" value={obj.workStartTime} onChange={ev => setInput(index, ev.target.value)}
                                        min="00:00" max="23:59" />
                                </TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>
                                    <input type="time" value={obj.workEndTime} onChange={ev => setInputEndTime(index, ev.target.value)}
                                        min="00:00" max="23:59" />
                                </TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>
                                    <input type="time" value={obj.workRestTime} onChange={ev => setInputRestTime(index, ev.target.value)}
                                        min="00:00" max="23:59" />
                                </TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>
                                    <input type="text" value={obj.contents} onChange={ev => setInputContents(index, ev.target.value)} />
                                </TableCell>

                            ]}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        <Link to={`/about/${username}`}><Button onClick={updateHolidayInfo}>修正</Button></Link>
    </>
};
export default WorkChange