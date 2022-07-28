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

const Manage = () => {

    const [order, setorder] = React.useState("ASC");
    const [searchName, setSearchName] = React.useState(null);
    const [confirmId, setConfirmId] = React.useState('0');
    const [deleteId, setDeleteId] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [holidayInfos, setHolidayInfos] = useState([])
    const names = [
        'All',
        'jini',
        'leejinlee'


    ];
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
    useEffect(() => {
        fetchHolidayInfos()
    }, [])

    async function fetchHolidayInfos() {
        try {
            const holidayInfoData = await API.graphql(graphqlOperation(listHolidayInfos))
            const holidayInfos = holidayInfoData.data.listHolidayInfos.items
            setHolidayInfos(holidayInfos)
        } catch (err) { console.log('error fetching todos') }
    }

    function handleConfirmClickOpen(comfirmId) {
        setConfirmId(comfirmId);
        setConfirmOpen(true);
    };

    function handleClickOpen(deleteId) {
        setDeleteId(deleteId);
        setOpen(true);
    };

    const comfirmHandleClose = () => {
        setConfirmOpen(false);
    };

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
    async function changeConfirmFlg(holidayInfo) {
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
            console.log('error deleting todo:', err)
        }
        window.location.reload();
    }
    return <>

        < h2 > DreamHanks休暇一覧</h2>

        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">社員名</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={searchName} onChange={event => setSearchName(event.target.value)}>
                {names.map((name, index) => (
                    <MenuItem value={name}>{name}</MenuItem>
                ))}
            </Select>
        </FormControl> <br />
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow style={{ textAlign: 'center', padding: '5px' }}>
                        <TableCell style={{ textAlign: 'center', padding: '5px' }}>名前</TableCell>
                        <TableCell colSpan="2" style={{ textAlign: 'center', padding: '5px' }}><Button onClick={() => sorting("date")}>日付</Button></TableCell>
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
                                [<TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>{holidayInfo.userName}</TableCell>,
                                <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>{holidayInfo.date.substring(0, 9)}</TableCell>,
                                <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>{holidayInfo.dateTo.substring(0, 9)}</TableCell>,
                                <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '4px' }}>{holidayInfo.contents}</TableCell>,
                                <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                    <Button disabled={true} variant="outlined" onClick={() => handleConfirmClickOpen(holidayInfo.id)}>確認</Button>
                                    <Dialog open={confirmOpen} onClose={comfirmHandleClose} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
                                        <DialogTitle id="confirm-dialog-title">{"確認"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="confirm-dialog-description">本当に確認しますか？</DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={changeConfirmFlg} autoFocus>はい</Button>
                                            <Button onClick={comfirmHandleClose}>いいえ</Button>
                                        </DialogActions>
                                    </Dialog>
                                </TableCell>,
                                <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                    <Button style={{ textAlign: 'center', padding: '5px' }} variant="outlined" onClick={() => handleClickOpen(holidayInfo.id)}>削除</Button>
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
                                ]
                                :
                                (searchName === holidayInfo.userName && holidayInfo.confirmFlg === '0' ?
                                    [<TableCell style={{ textAlign: 'center', padding: '5px' }}>{holidayInfo.userName}</TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>{holidayInfo.date.substring(0, 9)}</TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>{holidayInfo.dateTo.substring(0, 9)}</TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '4px' }}>{holidayInfo.contents}</TableCell>, <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                        <Button variant="outlined" onClick={() => handleConfirmClickOpen(holidayInfo.id)}>確認</Button>
                                        <Dialog open={confirmOpen} onClose={comfirmHandleClose} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
                                            <DialogTitle id="confirm-dialog-title">{"確認"}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="confirm-dialog-description">本当に確認しますか？</DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={changeConfirmFlg} autoFocus>はい</Button>
                                                <Button onClick={comfirmHandleClose}>いいえ</Button>
                                            </DialogActions>
                                        </Dialog>

                                    </TableCell>,
                                    <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                        <Button style={{ textAlign: 'center', padding: '5px' }} variant="outlined" onClick={() => handleClickOpen(holidayInfo.id)}>削除</Button>
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
                                    ]



                                    : (searchName === 'All' && holidayInfo.confirmFlg === '1' ?
                                        [
                                            <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>{holidayInfo.userName}</TableCell>
                                            , <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>{holidayInfo.date.substring(0, 9)}</TableCell>,
                                            <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>{holidayInfo.dateTo.substring(0, 9)}</TableCell>,
                                            <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '4px' }}>{holidayInfo.contents}</TableCell>, <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                                <Button disabled={true} variant="outlined" onClick={() => handleConfirmClickOpen(holidayInfo.id)}>確認</Button>
                                                <Dialog open={confirmOpen} onClose={comfirmHandleClose} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
                                                    <DialogTitle id="confirm-dialog-title">{"確認"}</DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="confirm-dialog-description">本当に確認しますか？</DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={changeConfirmFlg} autoFocus>はい</Button>
                                                        <Button onClick={comfirmHandleClose}>いいえ</Button>
                                                    </DialogActions>
                                                </Dialog>

                                            </TableCell>,
                                            <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                                <Button style={{ textAlign: 'center', padding: '5px' }} variant="outlined" onClick={() => handleClickOpen(holidayInfo.id)}>削除</Button>
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

                                        ]
                                        : (searchName === 'All' && holidayInfo.confirmFlg === '0' ?
                                            [
                                                <TableCell style={{ textAlign: 'center', padding: '5px' }}>{holidayInfo.userName}</TableCell>
                                                , <TableCell style={{ textAlign: 'center', padding: '5px' }}>{holidayInfo.date.substring(0, 9)}</TableCell>,
                                                <TableCell style={{ textAlign: 'center', padding: '5px' }}>{holidayInfo.dateTo.substring(0, 9)}</TableCell>,
                                                <TableCell style={{ textAlign: 'center', padding: '4px' }}>{holidayInfo.contents}</TableCell>, <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                                    <Button variant="outlined" onClick={() => handleConfirmClickOpen(holidayInfo.id)}>確認</Button>
                                                    <Dialog open={confirmOpen} onClose={comfirmHandleClose} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
                                                        <DialogTitle id="confirm-dialog-title">{"確認"}</DialogTitle>
                                                        <DialogContent>
                                                            <DialogContentText id="confirm-dialog-description">本当に確認しますか？</DialogContentText>
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button onClick={changeConfirmFlg} autoFocus>はい</Button>
                                                            <Button onClick={comfirmHandleClose}>いいえ</Button>
                                                        </DialogActions>
                                                    </Dialog>

                                                </TableCell>,
                                                <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                                    <Button style={{ textAlign: 'center', padding: '5px' }} variant="outlined" onClick={() => handleClickOpen(holidayInfo.id)}>削除</Button>
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
                                            ]
                                            : (searchName === null && holidayInfo.confirmFlg === '0' ? [
                                                <TableCell style={{ textAlign: 'center', padding: '5px' }}>{holidayInfo.userName}</TableCell>
                                                , <TableCell style={{ textAlign: 'center', padding: '5px' }}>{holidayInfo.date.substring(0, 9)}</TableCell>, <TableCell style={{ textAlign: 'center', padding: '5px' }}>{holidayInfo.dateTo.substring(0, 9)}</TableCell>, <TableCell style={{ textAlign: 'center', padding: '4px' }}>{holidayInfo.contents}</TableCell>, <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                                    <Button variant="outlined" onClick={() => handleConfirmClickOpen(holidayInfo.id)}>確認</Button>
                                                    <Dialog open={confirmOpen} onClose={comfirmHandleClose} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
                                                        <DialogTitle id="confirm-dialog-title">{"確認"}</DialogTitle>
                                                        <DialogContent>
                                                            <DialogContentText id="confirm-dialog-description">本当に確認しますか？</DialogContentText>
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button onClick={changeConfirmFlg} autoFocus>はい</Button>
                                                            <Button onClick={comfirmHandleClose}>いいえ</Button>
                                                        </DialogActions>
                                                    </Dialog>

                                                </TableCell>,
                                                <TableCell style={{ textAlign: 'center', padding: '5px' }}>
                                                    <Button style={{ textAlign: 'center', padding: '5px' }} variant="outlined" onClick={() => handleClickOpen(holidayInfo.id)}>削除</Button>
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
                                            ] : (searchName === null && holidayInfo.confirmFlg === '1' ?
                                                [
                                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>{holidayInfo.userName}</TableCell>
                                                    , <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>{holidayInfo.date.substring(0, 9)}</TableCell>, <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>{holidayInfo.dateTo.substring(0, 9)}</TableCell>, <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '4px' }}>{holidayInfo.contents}</TableCell>, <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                                        <Button disabled={true} variant="outlined" onClick={() => handleConfirmClickOpen(holidayInfo.id)}>確認</Button>
                                                        <Dialog open={confirmOpen} onClose={comfirmHandleClose} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
                                                            <DialogTitle id="confirm-dialog-title">{"確認"}</DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText id="confirm-dialog-description">本当に確認しますか？</DialogContentText>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={changeConfirmFlg} autoFocus>はい</Button>
                                                                <Button onClick={comfirmHandleClose}>いいえ</Button>
                                                            </DialogActions>
                                                        </Dialog>

                                                    </TableCell>,
                                                    <TableCell style={{ textAlign: 'center', backgroundColor: 'grey', padding: '5px' }}>
                                                        <Button style={{ textAlign: 'center', padding: '5px' }} variant="outlined" onClick={() => handleClickOpen(holidayInfo.id)}>削除</Button>
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

                                                ] : "")))))}



                        </TableRow>

                    ))}




                </TableBody>
            </Table>
        </TableContainer>



    </>
}
export default Manage