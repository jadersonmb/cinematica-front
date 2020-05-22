import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import validate from 'validate.js';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Switch,
  FormHelperText,
  TextField,
  Typography,
  Link
} from '@material-ui/core';

import useRouter from 'utils/useRouter';
import axios from 'axios';

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
  const { className, ...rest } = props;

  const classes = useStyles();
  const { history } = useRouter();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

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

  const handleSubmit = async event => {
    event.preventDefault();
    history.push('/Especialidade');
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const onSalvar = () => {
    EspecialidadeDTO.descricao = formState.values.descricao
    axios({
      method: 'POST',
      url: 'http://localhost:8080/especialidades/',
      data: EspecialidadeDTO
    }).catch((error) => {
    });
  }

  return (
    <form
      {...rest}
      className={clsx(classes.root, className)}
      onSubmit={handleSubmit}
    >
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
        type="submit"
        variant="contained"
        onClick={onSalvar}
      >
        Salvar
      </Button>
    </form>
  );
};

RegisterForm.propTypes = {
  className: PropTypes.string
};

export default RegisterForm;
