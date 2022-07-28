import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createHolidayInfo, createWorkInfo } from '../graphql/mutations'
import { listWorkInfos, getWorkInfo } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'
import { useParams } from "react-router-dom";
const WorkIndex = () => {

    const today = {
        year: new Date().getFullYear(), //오늘 연도
        //month: new Date().getMonth() + 1, //오늘 월
        date: new Date().getDate(), //오늘 날짜
        day: new Date().getDay(), //오늘 요일
    };
    const [selectedYear, setSelectedYear] = React.useState(today.year); //현재 선택된 연도
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); //현재 선택된 달
    const [formState, setFormState] = React.useState([])
    const { username } = useParams();
    //console.log(a);

    //現在月日数が入っているリスト
    const [workDates, setWorkDates] = useState([])
    const [workDays, setWorkDays] = useState([])
    const [workInfos, setWorkInfos] = useState([])

    useEffect(() => {
        calMonthDay()
        fetchHolidayInfos()
    }, [selectedMonth])


    const prevMonth = () => {
        //이전 달 보기 보튼
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(selectedYear - 1);

        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const nextMonth = () => {
        //다음 달 보기 버튼
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };
    const calMonthDay = () => {
        const week = ['日', '月', '火', '水', '木', '金', '土'];
        //現在月日数
        const days = new Date(selectedYear, selectedMonth, 0).getDate();
        for (let i = 1; i <= Number(days); i++) {
            if (i < 10 && selectedMonth < 10) {
                const today = new Date(selectedYear + "-0" + selectedMonth + "-0" + i).getDay();
                workDays[i - 1] = week[today];
                formState[i - 1] = { "date": selectedYear + "0" + selectedMonth + "0" + i, "day": week[today] }
            } else {
                const today = new Date(selectedYear + "-0" + selectedMonth + "-" + i).getDay();
                workDays[i - 1] = week[today];
                formState[i - 1] = { "date": selectedYear + "0" + selectedMonth + i, "day": week[today] }
            }
        }
        const doubled = formState.map((number) => number);
        setWorkDates(doubled)
    };



    async function fetchHolidayInfos() {
        try {
            const test = formState[0].date.substring(4, 6);
            const workInfoData = await API.graphql(graphqlOperation(listWorkInfos, {
                filter: { userName: { eq: username }, month: { eq: selectedMonth } }
            }))
            const workInfos = workInfoData.data.listWorkInfos.items
            console.log(workInfos);

            if (workInfos.length > 0) {
                for (let i = 0; i < workInfos.length; i++) {
                    if (workInfos[i].userName.includes(username)) {
                        const button = document.querySelector('#registButton')
                        button.disabled = true
                        setWorkInfos(workInfos)

                        const sorted = [...workInfos].sort((a, b) =>
                            a["date"].toLowerCase() > b["date"].toLowerCase() ? 1 : -1
                        );
                        setWorkInfos(sorted);
                    }

                }
            } else {
                setWorkInfos(workInfos)

                const button = document.querySelector('#registButton')
                button.disabled = false
            }
        } catch (err) { console.log('error fetching todos', err) }
    }
    return <>
        <h3>ID:{username} </h3>
        < h2 > DreamHanks勤怠</h2>
        <Link to="/"><button>休暇入力</button></Link>
        <Link to={`/lastMonth/${username}`}><button>前月</button></Link>


        <button onClick={prevMonth}>◀︎</button> {selectedMonth}
        <button onClick={nextMonth}>▶︎</button>
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

                    {workInfos.map((obj, index) =>
                        <TableRow key={index}>
                            {('土' == obj.day || '日' == obj.day) ? [
                                <TableCell style={{ textAlign: 'center' }}>{obj.date.substring(4, 6)}</TableCell>,
                                <TableCell style={{ textAlign: 'center', color: 'red' }}>{obj.day}</TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>{obj.workStartTime}</TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>{obj.workEndTime}</TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>{obj.workRestTime}</TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>{obj.contents}</TableCell>


                            ] : [<TableCell style={{ textAlign: 'center' }}>{obj.date.substring(4, 6)}</TableCell>,
                            <TableCell style={{ textAlign: 'center' }}>{obj.day}</TableCell>,
                            <TableCell style={{ textAlign: 'center' }}>{obj.workStartTime}</TableCell>,
                            <TableCell style={{ textAlign: 'center' }}>{obj.workEndTime}</TableCell>,
                            <TableCell style={{ textAlign: 'center' }}>{obj.workRestTime}</TableCell>,
                            <TableCell style={{ textAlign: 'center' }}>{obj.contents}</TableCell>]
                            }



                        </TableRow>

                    )}


                </TableBody>
            </Table>
        </TableContainer>


        <Link to={`/regist/${username}/${selectedYear}/${selectedMonth}`}><button id="registButton">入力</button></Link>

        <Link to={`/change/${username}/${selectedYear}/${selectedMonth}`}><Button>修正</Button></Link>

    </>
}
export default WorkIndex