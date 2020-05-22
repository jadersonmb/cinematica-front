import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import axios from 'axios';
import { Page, SearchBar } from 'components';
import { Header, Results } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const Especialidade = () => {
  const classes = useStyles();

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchCustomers = () => {
      axios.get('http://localhost:8080/especialidades/').then(response => {
        if (mounted) {
          setCustomers(response.data);
        }
      }).catch((error) => {
        console.log(error);
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

  return (
    <Page
      className={classes.root}
      title="Especialidades"
    >
      <Header />
      <SearchBar
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
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
