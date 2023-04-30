/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import {TextField,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Button, Modal, Box, Typography, Alert, Snackbar} from "@mui/material";
import Container from "@mui/material/Container";
import { useEffect, useState } from 'react';
import { CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';



function App() {
  const [post, setPost] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [postValue, setPostValue] = useState("");
  const [alertEdit, setAlertEdit] = useState(false)


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'grid',
    justifyContent: 'center',
  };
  const [currentPage , setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  

  const getPost = async () => {
    try {
      let response = await fetch('https://fakestoreapi.com/products',
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      let result = await response.json();
      setPost(result)
      setLoading(true)
    } catch (error) {
      console.error(error);
    }
  }

  const textInputSearch = (e) => {
    setSearch(e.target.value)
  }

  const prePage = () => {
    if(currentPage !== 1){
      setCurrentPage(currentPage - 1)
    }
  }

  const nextPage = () => {
    if(currentPage !== Math.ceil(result.length / recordsPerPage)){
      setCurrentPage(currentPage + 1)
    }
  }

  const editButton = (payload) => {
    setOpen(true)
    setPostValue(payload)
  }

  const handleCloseModalEdit = () => {
    setOpen(false)
  }

  const editConfirmButton = () => {
    setAlertEdit(true)
    setOpen(false)
  }

  let result = post

  let records = result.slice(firstIndex , lastIndex);

  !search ? result = post : records = post.filter((datos) => datos.title.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    getPost()
  }, [])

  return (
    <>
      <Container sx={{ marginTop: 5 }}>
        <TextField
          id="txtSearch"
          value={search}
          onChange={textInputSearch}
          label="Filtro de busqueda"
          variant="outlined"
        />

        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell>Codigo</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Acciones</TableCell>

              </TableRow>
            </TableHead>
            {
              loading ? (
                <TableBody sx={{ fontWeight: 'bold' }}>
                  {
                    result.length === 0 ? 
                    (
                      <TableRow key="notfound">
                        <TableCell colSpan={5} align="center" sx={{ fontWeight: 'bold' }}>No encontrado</TableCell>
                      </TableRow>
                    ) 
                    :
                    (
                      records.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row"> {row.id}</TableCell>
                          <TableCell align="right">{row.title}</TableCell>
                          <TableCell align="right">{row.description}</TableCell>
                          <TableCell align="right">{row.price}</TableCell>
                          <TableCell align="right">
                            <Button variant="contained" color='warning' onClick={() => editButton(row)}> <EditIcon/> </Button>
                            <Button variant="contained" color='error'> <DeleteIcon/> </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )
                  }
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow key="skeleton">
                    <TableCell colSpan={5} rowSpan={5} align="center">
                      <CircularProgress/>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )
            }
          </Table>
        </TableContainer>
        
        <Button 
          variant="contained" 
          color='primary' 
          sx={{marginRight: 4 , marginTop: 4}} 
          onClick={prePage}>
            {<NavigateBeforeIcon/>} Anterior 
        </Button>
        <Button 
          variant="contained" 
          color='primary' 
          sx={{ marginTop: 4}}
          onClick={nextPage}>
            Siguiente{<NavigateNextIcon/>}
        </Button>
      </Container>    
        <Modal
          open={open}
          onClose={handleCloseModalEdit}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Editar Producto
            </Typography>
              <TextField 
                value={postValue.id} 
                InputProps={{ readOnly: true }} 
                label="Codigo"
                sx={{marginTop: 2 , width:350 }}
              />
              <TextField 
                multiline rows={4} 
                value={postValue.title} 
                InputProps={{ readOnly: true }} 
                label="Titulo"
                sx={{marginTop: 2 ,  width:350}}
              />
              <Button 
                variant="contained" 
                color='success'
                sx={{marginTop: 2}}
                onClick={() => editConfirmButton()}
              > 
                Editar Producto 
              </Button>
          </Box>
        </Modal>
        <Snackbar open={alertEdit} autoHideDuration={4000} onClose={() => setAlertEdit(false)}>
          <Alert variant="filled" severity="success">
            Producto Editado
          </Alert>
        </Snackbar>
    </>
  )
}

export default App
