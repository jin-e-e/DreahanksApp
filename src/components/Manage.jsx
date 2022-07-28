import React, { useEffect, useState } from 'react';
import './css/manage.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { API, graphqlOperation } from 'aws-amplify'
import { listHolidayInfos } from '../graphql/queries'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteHolidayInfo, updateHolidayInfo } from '../graphql/mutations'
import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Link } from 'react-router-dom';

const Manage = () => {
    //日付ソート
    const [order, setorder] = React.useState("ASC");
    //検索するユーザー名
    const [searchName, setSearchName] = React.useState(null);
    //確認ID
    const [confirmId, setConfirmId] = React.useState('0');
    //削除ID
    const [deleteId, setDeleteId] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    //休暇データ
    const [holidayInfos, setHolidayInfos] = useState([]);
    //Cognitoから取得したユーザー名
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchHolidayInfos()
        getUserList()
    }, [searchName])

    //AWSのCognitoに登録されているユーザー名を取得
    async function getUserList() {
        try {
            //AWSのCognitoと連結
            const client = new CognitoIdentityProviderClient({
                region: "ap-northeast-1",
                credentials: {
                    accessKeyId: "AKIA2TBGQV36MBUFIBMP",
                    secretAccessKey: "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",
                },
            });
            const command = new ListUsersCommand({ UserPoolId: "ap-northeast-1_uaYr8XVpl" });

            const data = await client.send(command);
            for (let i = 0; i < data.Users.length; i++) {
                users[i] = { "user": data.Users[i].Username };
            }
        } catch (error) {
            console.error(error);
        }
    }
   
    /*　日付ソート */
    const sorting = (col) => {
        if (order === "ASC") {
            const sorted = [...holidayInfos].sort((a, b) =>
                a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
            );
            setHolidayInfos(sorted);
            setorder("DSC")
        }
        if (order === "DSC") {
            const sorted = [...holidayInfos].sort((a, b) =>
                a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
            );
            setHolidayInfos(sorted);
            setorder("ASC")
        }
    }

    //全社員の休暇データを取得
    async function fetchHolidayInfos() {
        try {
            const holidayInfoData = await API.graphql(graphqlOperation(listHolidayInfos))
            const holidayInfos = holidayInfoData.data.listHolidayInfos.items
            setHolidayInfos(holidayInfos)
        } catch (error) { console.log('error fetching', error) }
    }
    //「確認」ダイアログを表示する
    function handleConfirmClickOpen(comfirmId) {
        setConfirmId(comfirmId);
        setConfirmOpen(true);
    };

    //「削除」ダイアログを表示する
    function handleDeleteClickOpen(deleteId) {
        setDeleteId(deleteId);
        setOpen(true);
    };
    //「確認」ダイアログを閉じる
    const handleComfirmClose = () => {
        setConfirmOpen(false);
    };

    //「削除」ダイアログを閉じる
    const handleClose = () => {
        setOpen(false);
    };


    /*休暇データ削除機能 */
    async function deleteHandler() {
        try {
            const holidayID = { "id": deleteId }
            await API.graphql(graphqlOperation(deleteHolidayInfo, { input: holidayID }))
        } catch (err) {
            console.log('error deleting todo:', err)
        }
        window.location.reload();
    }
    /*休暇データ確認フラグ変更 */
    async function changeConfirmFlg() {
        try {
            await API.graphql(
                graphqlOperation(updateHolidayInfo, {
                    input: {
                        id: confirmId,
                        confirmFlg: '1'
                    }
                })
            )
        } catch (err) {
            console.log('error deleting', err)
        }
        window.location.reload();
    }

    return <>
        < h2 > DreamHanks休暇一覧</h2>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">社員名</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={searchName} onChange={event => setSearchName(event.target.value)}>
                {users.map((userNames, index) => (<MenuItem value={userNames.user}>{userNames.user}</MenuItem>))}
            </Select>
        </FormControl><br/>
        <ul>
            <Link to={`/workList/${searchName}`}><Button style={styles.button}>勤怠一覧</Button></Link>
        </ul><br/>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow style={{ textAlign: 'center', padding: '5px' }}>
                        <TableCell style={{ textAlign: 'center', padding: '5px' }}>名前</TableCell>
                        <TableCell colSpan="2" style={{ textAlign: 'center', padding: '5px' }}>
                            <Button onClick={() => sorting("date")}>日付</Button>
                        </TableCell>
                        <TableCell style={{ textAlign: 'center', padding: '5px' }}>内容</TableCell>
                        <TableCell style={{ textAlign: 'center', padding: '5px' }}>確認</TableCell>
                        <TableCell style={{ textAlign: 'center', padding: '5px' }}>削除</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {holidayInfos.map((holidayInfo, index) => (
                        <TableRow key={holidayInfo.id ? holidayInfo.id : index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            {/* searchName이랑 홀리데이인포이름이람 같은면 표시 */}
                            {searchName === holidayInfo.userName && holidayInfo.confirmFlg === '1' ?
                                [
                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                        {holidayInfo.userName}
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                        {holidayInfo.date.substring(0, 9)}
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                        {holidayInfo.dateTo.substring(0, 9)}
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '4px' }}>
                                        {holidayInfo.contents}
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                        <Button disabled={true} variant="outlined" onClick={() => handleConfirmClickOpen(holidayInfo.id)}>確認</Button>
                                        <Dialog open={confirmOpen} onClose={handleComfirmClose} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
                                        <DialogTitle id="confirm-dialog-title">{"確認"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="confirm-dialog-description">本当に確認しますか？</DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={changeConfirmFlg} autoFocus>はい</Button>
                                            <Button onClick={handleComfirmClose}>いいえ</Button>
                                        </DialogActions>
                                        </Dialog>
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                        <Button style={{ textAlign: 'center', padding: '5px' }} variant="outlined" onClick={() => handleDeleteClickOpen(holidayInfo.id)}>削除</Button>
                                        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                        <DialogTitle id="alert-dialog-title">{"削除"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">本当に削除しますか？</DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={deleteHandler} autoFocus>はい</Button>
                                            <Button onClick={handleClose}>いいえ</Button>
                                        </DialogActions>
                                    </Dialog>
                                    </TableCell>
                                ]:
                                (searchName === holidayInfo.userName && holidayInfo.confirmFlg === '0' ?
                                [
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                        {holidayInfo.userName}
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                        {holidayInfo.date.substring(0, 9)}
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                        {holidayInfo.dateTo.substring(0, 9)}
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '4px' }}>
                                        {holidayInfo.contents}
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                        <Button variant="outlined" onClick={() => handleConfirmClickOpen(holidayInfo.id)}>確認</Button>
                                        <Dialog open={confirmOpen} onClose={handleComfirmClose} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
                                        <DialogTitle id="confirm-dialog-title">{"確認"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="confirm-dialog-description">本当に確認しますか？</DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={changeConfirmFlg} autoFocus>はい</Button>
                                            <Button onClick={handleComfirmClose}>いいえ</Button>
                                        </DialogActions>
                                        </Dialog>
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                        <Button style={{ textAlign: 'center', padding: '5px' }} variant="outlined" onClick={() => handleDeleteClickOpen(holidayInfo.id)}>削除</Button>
                                        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                            <DialogTitle id="alert-dialog-title">{"削除"}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">本当に削除しますか？</DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={deleteHandler} autoFocus>はい</Button>
                                                <Button onClick={handleClose}>いいえ</Button>
                                            </DialogActions>
                                        </Dialog>
                                    </TableCell>
                                    ] :
                                    (searchName === null && holidayInfo.confirmFlg === '0' ?
                                    [
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>{holidayInfo.userName}</TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>{holidayInfo.date.substring(0, 9)}</TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>{holidayInfo.dateTo.substring(0, 9)}</TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '4px' }}>{holidayInfo.contents}</TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                        <Button variant="outlined" onClick={() => handleConfirmClickOpen(holidayInfo.id)}>確認</Button>
                                        <Dialog open={confirmOpen} onClose={handleComfirmClose} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
                                        <DialogTitle id="confirm-dialog-title">{"確認"}</DialogTitle>
                                        <DialogContent>
                                        <DialogContentText id="confirm-dialog-description">本当に確認しますか？</DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={changeConfirmFlg} autoFocus>はい</Button>
                                        <Button onClick={handleComfirmClose}>いいえ</Button>
                                        </DialogActions>
                                        </Dialog>
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                        <Button style={{ textAlign: 'center', padding: '5px' }} variant="outlined" onClick={() => handleDeleteClickOpen(holidayInfo.id)}>削除</Button>
                                       <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                       <DialogTitle id="alert-dialog-title">{"削除"}</DialogTitle>
                                       <DialogContent>
                                       <DialogContentText id="alert-dialog-description">本当に削除しますか？</DialogContentText>
                                       </DialogContent>
                                       <DialogActions>
                                       <Button onClick={deleteHandler} autoFocus>はい</Button>
                                       <Button onClick={handleClose}>いいえ</Button>
                                       </DialogActions>
                                       </Dialog>
                                    </TableCell>
                                    ] :
                                    (searchName === null && holidayInfo.confirmFlg === '1' ?
                                    [
                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                        {holidayInfo.userName}</TableCell>,
                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                        {holidayInfo.date.substring(0, 9)}</TableCell>,
                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                        {holidayInfo.dateTo.substring(0, 9)}</TableCell>, <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '4px' }}>{holidayInfo.contents}
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                        <Button disabled={true} variant="outlined" onClick={() => handleConfirmClickOpen(holidayInfo.id)}>確認</Button>
                                        <Dialog open={confirmOpen} onClose={handleComfirmClose} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
                                        <DialogTitle id="confirm-dialog-title">{"確認"}</DialogTitle>
                                        <DialogContent>
                                        <DialogContentText id="confirm-dialog-description">本当に確認しますか？</DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={changeConfirmFlg} autoFocus>はい</Button>
                                        <Button onClick={handleComfirmClose}>いいえ</Button>
                                        </DialogActions>
                                        </Dialog>
                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                        <Button style={{ textAlign: 'center', padding: '5px' }} variant="outlined" onClick={() => handleDeleteClickOpen(holidayInfo.id)}>削除</Button>
                                       <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                       <DialogTitle id="alert-dialog-title">{"削除"}</DialogTitle>
                                       <DialogContent>
                                       <DialogContentText id="alert-dialog-description">本当に削除しますか？</DialogContentText>
                                       </DialogContent>
                                       <DialogActions>
                                       <Button onClick={deleteHandler} autoFocus>はい</Button>
                                       <Button onClick={handleClose}>いいえ</Button>
                                       </DialogActions>
                                       </Dialog>
                                    </TableCell>
                                    ] : "")))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}
const styles = {
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: '18px', right: '0px' }
}
export default Manage