import React, { useState, useEffect } from 'react';
import validate from 'validate.js';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import MuiAlert from '@material-ui/lab/Alert';
import {
  Button,
  Snackbar,
  TextField,
  Typography
} from '@material-ui/core';

import useRouter from 'utils/useRouter';
import axios from 'axios';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const schema = {
  descricao: {
    presence: { allowEmpty: false },
    length: {
      maximum: 32
    }
  }
};

const EspecialidadeDTO = {
  descricao: String
}

const useStyles = makeStyles(theme => ({
  root: { margin: '20px' },
  fields: {
    margin: theme.spacing(-1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1)
    }
  },
  policy: {
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%'
  }
}));

const RegisterForm = props => {
  const { descricao, setMessage, setTypeMessage, setIsMessage, fetchCustomers, closeMessage, fecharNovoItem, ...rest } = props;

  const classes = useStyles();
  const { history } = useRouter();
  const [open, setOpen] = React.useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const handleChange = event => {
    event.persist();

   const errors = validate(formState.values, schema);
    if (event.target.value.length > 0) {
      formState.isValid = true;
      formState.errors = errors ? false : true;
    } else {
      formState.isValid = false;
      formState.errors = errors ? false : true;
    }

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  /*const handleSubmit = async event => {
    event.preventDefault();
    history.push('/Especialidade');
  };*/

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const onSalvar = () => {
    EspecialidadeDTO.descricao = formState.values.descricao
    new Promise(function (resolve, reject) {
      axios({
        method: 'POST',
        url: 'http://localhost:8080/especialidades/',
        data: EspecialidadeDTO
      }).then(() => {
        setTypeMessage('success')
        setMessage('Registro salvo com sucesso.');
        setIsMessage(true)
        fetchCustomers();
        fecharNovoItem();
      }).catch(error => {
        setTypeMessage('error')
        setMessage('Error ao salvar o registro.');
        setIsMessage(true)
      }).finally(
        closeMessage()
      );
    })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <form
      {...rest}
      className={clsx(classes.root, descricao)}>
      <div className={classes.fields}>
        <TextField
          error={hasError('descricao')}
          label="Descrição"
          name="descricao"
          onChange={handleChange}
          value={formState.values.descricao || ''}
          variant="outlined"
        />
      </div>
      <Button
        className={classes.submitButton}
        color="secondary"
        disabled={!formState.isValid}
        size="small"
        variant="contained"
        onClick={onSalvar}>
        Salvar
      </Button>
    </form>
  );
};

RegisterForm.propTypes = {
  descricao: PropTypes.string
};

export default RegisterForm;
