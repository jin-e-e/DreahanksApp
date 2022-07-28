import React, { useEffect, useState } from 'react';
import './css/member.css';
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
import TextField from '@mui/material/TextField';
import { API, graphqlOperation } from 'aws-amplify'
import { listHolidayInfos } from '../graphql/queries'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createHolidayInfo, deleteHolidayInfo } from '../graphql/mutations'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link } from 'react-router-dom';


const initialState = { date: '', dateTo: '', contents: '���̑�', userName: '', confirmFlg: '0' }

const Member = (username) => {
    const [menberUsername] = useState(username.username)

    const [order, setorder] = React.useState("ASC");

    const [formState, setFormState] = useState(initialState)
    const [holidayInfos, setHolidayInfos] = useState([])
    const [value, setValue] = React.useState(null);
    const [value2, setValue2] = React.useState(null);
    const [registOpen, setRegistOpen] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState('');
    const [open, setOpen] = React.useState(false);



    function setInput(key, value) {
        setFormState({ ...formState, [key]: value })
    }
    function setInput(key, value2) {
        setFormState({ ...formState, [key]: value2 })
    }
    /*�x�Ƀf�[�^�ǉ���� */
    async function addHolidayInfo(userName) {
        try {
            const dt = new Date(formState.date);
            const dt2 = new Date(formState.dateTo);

            const dtY = dt.getFullYear();
            const dtM = dt.getMonth() + 1;
            const dtD = dt.getDate();

            const dtM2 = dtM < 10 ? "0" + dtM : dtM;
            const dtD2 = dtD < 10 ? "0" + dtD : dtD;
            const dateFrom = dtY + dtM2 + dtD2;

            const dt2Y = dt2.getFullYear();
            const dt2M = dt2.getMonth() + 1;
            const dt2D = dt2.getDate();

            const dt2M2 = dt2M < 10 ? "0" + dt2M : dt2M;
            const dt2D2 = dt2D < 10 ? "0" + dt2D : dt2D;
            const dateTo = dt2Y + dt2M2 + dt2D2;


            if (Number(dateFrom) > Number(dateTo)) {
                alert("From���t���C�����Ă��������B")
                return
            } else {
                if (!formState.date || !formState.dateTo) return
                const holidayInfo = { ...formState, "userName": userName, "date": dt.toLocaleString(), "dateTo": dt2.toLocaleString() }
                setHolidayInfos([...holidayInfos, holidayInfo])
                setFormState(initialState)
                await API.graphql(graphqlOperation(createHolidayInfo, { input: holidayInfo }))
            }
        } catch (err) {
            console.log('error creating todo:', err)

        }
        window.location.reload();

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
    const registHandleClickOpen = () => {
        setRegistOpen(true);
    };


    const registHandleClose = () => {
        setRegistOpen(false);
    };

    /*�@���t�\�[�g */
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
    function handleClickOpen(deleteId) {
        setDeleteId(deleteId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    /*�x�Ƀf�[�^�폜�@�\ */
    async function deleteHandler() {

        try {
            const holidayID = { "id": deleteId }
            await API.graphql(graphqlOperation(deleteHolidayInfo, { input: holidayID }))
        } catch (err) {
            console.log('error deleting todo:', err)
        }
        window.location.reload();
    }

    return <>
        <ul>

            <Link to={`/about/${menberUsername}`}><button>�Αӓ���</button></Link>
        </ul>
        <h2>DreamHanks�x�ɓ���</h2>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">���e</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={formState.contents} onChange={event => setInput('contents', event.target.value)}>
                <MenuItem value={'�L���x��'}>�L���x��</MenuItem>
                <MenuItem value={'�N���x��'}>�N���x��</MenuItem>
                <MenuItem value={'�a�C�x��'}>�a�C�x��</MenuItem>
                <MenuItem value={'���̑�'}>���̑�</MenuItem>
            </Select>
        </FormControl><br />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker label="From���t" value={value} onChange={(newValue) => [setValue(newValue), setInput('date', newValue)]} renderInput={(params) => <TextField {...params} />} />
        </LocalizationProvider><br />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker minDate={value} label="To���t" value={value2} onChange={(newValue) => [setValue2(newValue), setInput('dateTo', newValue)]} renderInput={(params) => <TextField {...params} />} />
        </LocalizationProvider><br />
        <Button style={styles.button} onClick={registHandleClickOpen} >�o�^</Button> <br />
        <Dialog open={registOpen} onClose={registHandleClose} aria-labelledby="dialogTitle" aria-describedby="dialogDescription">
            <DialogTitle id="dialogTitle">{"�o�^"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialogDescription">�{���ɓo�^���܂����H</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => addHolidayInfo(menberUsername)} autoFocus>�͂�</Button>
                <Button onClick={registHandleClose}>������</Button>
            </DialogActions>
        </Dialog>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ textAlign: 'center' }} colSpan="2"><Button onClick={() => sorting("date")}>���t</Button></TableCell>
                        <TableCell style={{ textAlign: 'center' }}>���e</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>�폜</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {holidayInfos.map((holidayInfo, index) => (
                        <TableRow key={holidayInfo.id ? holidayInfo.id : index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            {menberUsername === holidayInfo.userName && holidayInfo.confirmFlg === '1' ?
                                [<TableCell style={{ backgroundColor: 'grey' }}>{holidayInfo.date.substring(0, 9)}  </TableCell>,
                                <TableCell style={{ backgroundColor: 'grey' }}>{holidayInfo.dateTo.substring(0, 9)}  </TableCell>,
                                <TableCell style={{ backgroundColor: 'grey' }}>{holidayInfo.contents}</TableCell>,
                                <TableCell style={{ backgroundColor: 'grey' }}>
                                    <Button variant="outlined" disabled={true} onClick={() => handleClickOpen(holidayInfo.id)} >�폜</Button>
                                    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                        <DialogTitle id="alert-dialog-title">{"�폜"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">�{���ɍ폜���܂����H</DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={deleteHandler} autoFocus>�͂�</Button>
                                            <Button onClick={handleClose}>������</Button>
                                        </DialogActions>
                                    </Dialog>
                                </TableCell>
                                ] : (menberUsername === holidayInfo.userName && holidayInfo.confirmFlg === '0' ?
                                    [<TableCell>{holidayInfo.date.substring(0, 9)}  </TableCell>,
                                    <TableCell>{holidayInfo.dateTo.substring(0, 9)}  </TableCell>,
                                    <TableCell>{holidayInfo.contents}</TableCell>,
                                    <TableCell>
                                        <Button variant="outlined" onClick={() => handleClickOpen(holidayInfo.id)} >�폜</Button>
                                        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                            <DialogTitle id="alert-dialog-title">{"�폜"}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">�{���ɍ폜���܂����H</DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={deleteHandler} autoFocus>�͂�</Button>
                                                <Button onClick={handleClose}>������</Button>
                                            </DialogActions>
                                        </Dialog>
                                    </TableCell>
                                    ] : null)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    </>
}

const styles = {
    container: { width: 380, margin: '0 auto', display: 'flex', flexDirection: 'column' },
    todo: { marginBottom: 15 },
    input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 15 },
    todoName: { fontSize: 10, fontWeight: 'bold' },
    todoDescription: { marginBottom: 0 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 10, padding: '12px 0px' },
    signButton: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, right: 0, marginLeft: "275px" }
}
export default Member