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
import {createWorkInfo } from '../graphql/mutations'
import { useParams } from "react-router-dom";
const WorkRegist = () => {

    //勤怠情報リスト
    const [workInfos, setWorkInfos] = useState([])
    //ユーザー名
    const { username } = useParams();
    //年度
    const { year } = useParams();
    //月
    const { month } = useParams();

    //現在月日数が入っているリスト
    const [workDates, setWorkDates] = useState([])
    const [workDays, setWorkDays] = useState([])

    //出勤時間
    const [workStartTime, setWorkStartTime] = useState('09:30');
    //退勤時間
    const [workEndTime, setWorkEndTime] = useState('18:30');
    //休み時間
    const [workRestTime, setWorkRestTime] = useState('01:00');
    //内容
    const [contents, setContents] = useState('');

    useEffect(() => {
        calMonthDay()
    }, [])

    //現在月の日数を取得し、WorkDatesリストに追加。
    const calMonthDay = () => {
        const week = ['日', '月', '火', '水', '木', '金', '土'];

        //現在月日数
        const days = new Date(year, month, 0).getDate();
        for (let i = 1; i <= Number(days); i++) {
            if (i < 10) {
                const today = new Date(year + "-0" + month + "-0" + i).getDay();
                workDays[i - 1] = week[today];
                //土日の場合出退勤を「00：00」にする。
                if ("土" === workDays[i - 1] || "日" === workDays[i - 1] ) {
                    workInfos[i - 1] = { "date": year+ "0"+ month + "0" + i, "day": week[today], "userName": username, "workStartTime": "00:00", "workEndTime": "00:00", "workRestTime": "00:00", "contents": "", "month": month, "year": year }
                } else {
                    workInfos[i - 1] = { "date": year + "0" + month  + "0" + i, "day": week[today], "userName": username, "workStartTime": "09:30", "workEndTime": "18:30", "workRestTime": "01:00", "contents": "", "month": month, "year": year }
                }
                
            } else {
                const today = new Date(year + "-" + month + "-" + i).getDay();
                workDays[i - 1] = week[today];
                if ("土" === workDays[i - 1] || "日" === workDays[i - 1]) {
                    workInfos[i - 1] = {
                        "date": year + month + i, "day": week[today]
                        , "userName": username, "workStartTime": "00:00", "workEndTime": "00:00", "workRestTime": "00:00", "contents": "", "month": month
                        , "year": year}
                } else {
                    workInfos[i - 1] = {
                        "date": year + month + i, "day": week[today]
                        , "userName": username, "workStartTime": "09:30", "workEndTime": "18:30", "workRestTime": "01:00", "contents": "", "month": month
                        , "year": year}
                }
                
            }
            const doubled = workInfos.map((number) => number);
            setWorkDates(doubled)
        };
    }
    function setInputStartTime(key, value) {
        workInfos[key].workStartTime = value;
        setWorkStartTime(value); 
    }
    function setInputEndTime(key, value) {
        workInfos[key].workEndTime = value;
        setWorkEndTime(value); 
    }
    function setInputRestTime(key, value) {
        workInfos[key].workRestTime = value;
        setWorkRestTime(value); 
    }
    function setInputContents(key, value) {
        workInfos[key].contents = value;
        setContents(value); 
    }
        /*勤怠データ追加昨日 */
        async function addHolidayInfo() {
            try {
                for (let i = 0; i < workInfos.length; i++) {
                    API.graphql(graphqlOperation(createWorkInfo, { input: workInfos[i] }))
                }
            } catch (err) {
                console.log('error creating:', err)

            }
            //window.location.reload();
    }
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

                        {workInfos.map((obj, index) =>
                            <TableRow key={index}>
                                <TableCell style={{ textAlign: 'center' }}>{obj.date}</TableCell>
                                {/*土日の場合赤文字にする */}
                                {'土' === obj.day || '日' === obj.day ? <TableCell style={{ textAlign: 'center', color:'red' }}>{obj.day}</TableCell> : <TableCell style={{ textAlign: 'center' }}>{obj.day}</TableCell>
                                }
                                <TableCell style={{ textAlign: 'center' }}>
                                    <input type="time" value={obj.workStartTime} onChange={ev => setInputStartTime(index, ev.target.value)}
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
                                    <input type="text" value={obj.contents} onChange={ev => setInputContents(index, ev.target.value)}  />
                                </TableCell>
                                
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Link to={`/about/${username}`}><Button style={styles.button} onClick={() => addHolidayInfo()}>登録</Button></Link>
        </>
}
const styles = {
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: '18px', right: '0px' }
}
export default WorkRegist