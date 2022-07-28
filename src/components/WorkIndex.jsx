import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, {useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listWorkInfos } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'
import { useParams} from "react-router-dom";
const WorkIndex = () => {
    const today = {
        //今日の年度
        year: new Date().getFullYear(), 
        //今日の月
        month: new Date().getMonth() + 1, 
    };
    //現在、選択された年度
    const [selectedYear, setSelectedYear] = React.useState(today.year); 
   
     //現在、選択された月
    const [selectedMonth, setSelectedMonth] = useState(today.month); 

    //ユーザー名
    const { username } = useParams();

    //勤怠情報リスト
    const [workInfos, setWorkInfos] = useState([])

    //選択された月が変えたらfetchWorkInfos()関数を実行
    useEffect(() => {
        fetchWorkInfos()
    }, [selectedMonth])


    //前月処理
    const prevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(selectedYear-1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    //来月処理
    const nextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    //勤怠情報を取得
    async function fetchWorkInfos() {
        try {
            const workInfoData = await API.graphql(graphqlOperation(listWorkInfos, {
                filter: { userName: { eq: username }, year: { eq: selectedYear }, month: { eq: selectedMonth }}
            }))
            const workInfos = workInfoData.data.listWorkInfos.items

            //勤怠情報がある場合
            if (workInfos.length > 0) {
                //勤怠登録ボタン非活性化
                const registButton = document.querySelector('#registButton')
                registButton.disabled = true

                //勤怠修正ボタン活性化
                const renewButton = document.querySelector('#renewButton')
                renewButton.disabled = false
                setWorkInfos(workInfos)

                //日付昇順ソート
                const sorted = [...workInfos].sort((a, b) =>
                   a["date"].toLowerCase() > b["date"].toLowerCase() ? 1 : -1
                );
                setWorkInfos(sorted);
            }
            //勤怠情報がない場合
            else {
                //勤怠登録ボタン活性化
                const registButton = document.querySelector('#registButton')
                registButton.disabled = false

                //勤怠修正ボタン非活性化
                const renewButton = document.querySelector('#renewButton')
                renewButton.disabled = true
                setWorkInfos(workInfos)
            }
        } catch (err) { console.log('error fetching', err) }
    }

    return <>
        <Link to="/"> <Button style={styles.button}>休暇入力へ戻る</Button></Link>
        <h3>ID:{username} </h3>
        < h2 > DreamHanks勤怠</h2>
        
        <br/>
        <Button onClick={prevMonth}>◀︎</Button> {selectedYear}年{selectedMonth}月
        <Button onClick={nextMonth}>▶︎</Button>
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
                            {  ('土' === obj.day || '日' === obj.day)? [
                                <TableCell style={{ textAlign: 'center' }}>{obj.date}</TableCell>,
                                <TableCell style={{ textAlign: 'center', color: 'red'}}>{obj.day}</TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>{obj.workStartTime}</TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>{obj.workEndTime}</TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>{obj.workRestTime}</TableCell>,
                                <TableCell style={{ textAlign: 'center' }}>{obj.contents}</TableCell>

                            ] : [<TableCell style={{ textAlign: 'center' }}>{obj.date}</TableCell>,
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
      
        <Link to={`/regist/${username}/${selectedYear}/${selectedMonth}`}><Button style={styles.button} id="registButton">入力</Button></Link>
       
        <Link to={`/change/${username}/${selectedYear}/${selectedMonth}`}><Button style={styles.button} id="renewButton">修正</Button></Link>
        
    </>
}
const styles = {
    button: { backgroundColor: 'black',color: 'white',outline: 'none',fontSize:'18px',right: '0px'}
}
export default WorkIndex