import logo from './logo.svg';
import './App.css';
import Table from './components/Table';
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {

  const [articles, setArticles] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalArticles, setTotalArticles] = useState(0);
  const [filterValue, setFilterValue] = useState('');
  const [selectedDate , setSelectedDate] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({
    title: true,
    source: true,
    publishedAt: true,
    author: true,
    description: true,
  });


  const tagHead = [
    { key: 'title', lable: 'Title' },
    { key: 'source', lable: 'Source' },
    { key: 'publishedAt', lable: 'PublishedAt' },
    { key: 'author', lable: 'Author' },
    { key: 'description', lable: 'Description' },
  ]


  console.log(selectedDate)
  async function fetchNewsApiData() {

    await axios.get(`http://127.0.0.1:8000/api/news?page=${page}&per_page=${rowsPerPage}&search=${filterValue}&publishedAt=${selectedDate}`)
      .then(function (response) {
        setArticles(response?.data?.data)
        setTotalArticles(response.data?.total);

      })
      .catch(function (error) {
        console.log(error);
      })

  }

  useEffect(() => {
    fetchNewsApiData(page, rowsPerPage, filterValue,selectedDate)
  }, [page, rowsPerPage, filterValue,selectedDate])


  const listData = articles?.map((c) => {
    return {
      ...c,
      source: (
        <span>{c?.source?.name}</span>
      ), publishedAt: (
        new Date(c.publishedAt).toLocaleDateString()
      )
    };
  });


  return (
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>

        <div className="container mx-auto  p-10 ">

          <Table
            listData={listData}
            headCell={tagHead}
            tableTitle={"News List"}
            page={page}
            rowsPerPage={rowsPerPage}
            totalArticles={totalArticles}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
            setColumnVisibility={setColumnVisibility}
            columnVisibility={columnVisibility}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      </LocalizationProvider>
    </BrowserRouter>

  );
}

export default App;
