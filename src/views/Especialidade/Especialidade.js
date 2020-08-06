import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { Page, SearchBar } from 'components';
import  Header   from './components/Header/Header';
import Results  from './components/Results/Results';
import  RegisterForm  from './components/RegisterForm/RegisterForm';
import MuiAlert from '@material-ui/lab/Alert';
import {
  Card,
  CardHeader,
  IconButton
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  },
  alert: {
    marginTop: theme.spacing(3)
  },
  card: {
    marginTop: '40px'
  }
}));

const Especialidade = () => {
  
  const classes = useStyles();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [isMessage, setIsMessage] = useState(false);
  const [message, setMessage] = useState();
  const [typeMessage, setTypeMessage] = useState();
  const [newItem, setNewItem] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [searchText, setSearchText] = useState();

  const fetchCustomers = (page, rowsPerPage, searchText) => {
    window.scrollTo(0, 0);
    let search = searchText === undefined ? '&searchTerm=' : '&searchTerm=' + searchText;
    axios.get('/cinematica-service/especialidades/?page=' + page + '&size=' + rowsPerPage + search).then(response => {
      setPage(page);
      setRowPerPage(response.data.size);
      setSize(response.data.totalElements);
      setCustomers(response.data.content);
    }).catch((error) => {
      setIsMessage(true);
      setTypeMessage('error');
      setMessage('Erro na requisição da API. Favor contactar o Administrador do Sistema');
    })
  };

  const fetchCustomersPagination = (page, rowsPerPage) => {
    fetchCustomers(page, rowsPerPage);
  }

  useEffect(() => {
    /*let mounted = true;*/
    fetchCustomers(page, rowPerPage);
    return () => {
      /*mounted = false;*/
    };
  }, []); 

  const handleFilter = () => { 
  };
  
  const handleSearch = () => {
    fetchCustomers(page, rowPerPage, searchText);
  };

  const closeMessage = () => {
    setTimeout(() => {
      setIsMessage(false);
      setMessage('');
    }, 3000);
  }

  const closeNewItem = () => {
    setNewItem(false);
    selectedCustomers.length = 0;
  }

  const onEdit = () => {
    setNewItem(true);
  }
  
  return (
    <Page
      className={classes.root}
      title="Especialidades"
    >
      <Header setNewItem={setNewItem} />
      <SearchBar
        setSearchText={setSearchText}
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      {(isMessage) &&
        <Alert variant="filled" severity={typeMessage} className={classes.alert}>{message}</Alert>
      }
      {(newItem) &&
        <div>
          <Card className={classes.card}>
            <CardHeader title="Nova Especialidade" action={
              <IconButton aria-label="cancel" onClickCapture={closeNewItem}>
                <CancelIcon />
              </IconButton>
            } />
            <RegisterForm customers={customers} selectedCustomers={selectedCustomers} closeNewItem={closeNewItem} closeMessage={closeMessage} fetchCustomers={fetchCustomers} setMessage={setMessage} setTypeMessage={setTypeMessage} setIsMessage={setIsMessage} />
          </Card>
        </div>
      }
      {customers && (
        <Results
          size={size}
          page={page}
          setPage={setPage}
          onEdit={onEdit}
          selectedCustomers={selectedCustomers}
          setSelectedCustomers={setSelectedCustomers}
          setNewItem={setNewItem}
          closeMessage={closeMessage} 
          fetchCustomers={fetchCustomers}
          setMessage={setMessage} 
          setTypeMessage={setTypeMessage}
          setIsMessage={setIsMessage}
          className={classes.results}
          customers={customers}
          fetchCustomersPagination={fetchCustomersPagination}
          rowPerPage={rowPerPage}
        />
      )}
    </Page>
  );
};

export default Especialidade;
