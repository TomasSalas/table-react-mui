/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import {TextField,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Button} from "@mui/material";
import Container from "@mui/material/Container";
import { useEffect, useState } from 'react';
import { CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


function App() {
  const [post, setPost] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage , setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  let result = []

  const getPost = async () => {
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

  !search ? result = post : result = post.filter((datos) => datos.title.toLowerCase().includes(search.toLowerCase()))

  const records = result.slice(firstIndex , lastIndex);

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
                        <TableCell colSpan={4} align="center" sx={{ fontWeight: 'bold' }}>No encontrado</TableCell>
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
                            <Button variant="contained" color='warning'> <EditIcon/> </Button>
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
        
        <Button variant="contained" color='primary' sx={{marginRight: 4 , marginTop: 4}} onClick={prePage}>Anterior</Button>
        <Button variant="contained" color='primary' sx={{ marginTop: 4}}onClick={nextPage}>Siguiente</Button>
      </Container>
    </>
  )
}

export default App
