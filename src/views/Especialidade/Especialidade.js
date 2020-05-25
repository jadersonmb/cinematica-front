import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { Page, SearchBar } from 'components';
import { Header, Results, RegisterForm } from './components';
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
  const [isMessage, setIsMessage] = useState(false);
  const [message, setMessage] = useState();
  const [typeMessage, setTypeMessage] = useState();
  const [novoItem, setNovoItem] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchCustomers = () => {
      axios.get('http://localhost:8080/especialidades/').then(response => {
        if (mounted) {
          setCustomers(response.data);
          setIsMessage(false);
        }
      }).catch((error) => {
        setIsMessage(true);
        setTypeMessage('error');
        setMessage('Erro na requisição da API. Favor contactar o Administrador do Sistema');
      }).finally(() => {
      });;
    };
    
    fetchCustomers();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFilter = () => { };
  const handleSearch = () => { };

  const fecharNovoItem = () => {
    setNovoItem(false);
  }

  return (
    <Page
      className={classes.root}
      title="Especialidades"
    >
      <Header setNovoItem={setNovoItem} />
      <SearchBar
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      {(isMessage) &&
        <Alert variant="filled" severity={typeMessage} className={classes.alert}>{message}</Alert>
      }
      {(novoItem) &&
        <div>
          <Card className={classes.card}>
            <CardHeader title="Nova Especialidade" action={
              <IconButton aria-label="cancel" onClickCapture={fecharNovoItem}>
                <CancelIcon />
              </IconButton>
            } />
            <RegisterForm setMessage={setMessage} setTypeMessage={setTypeMessage} setIsMessage={setIsMessage} />
          </Card>
        </div>
      }
      {customers && (
        <Results
          className={classes.results}
          customers={customers}
        />
      )}
    </Page>
  );
};

export default Especialidade;
