import React, { useState, useEffect } from 'react';
import validate from 'validate.js';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import MuiAlert from '@material-ui/lab/Alert';
import {
  Button,
  TextField,
  Typography
} from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import useRouter from 'utils/useRouter';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const schema = {
  horario: {
    presence: { allowEmpty: false },
    length: {
      maximum: 4
    }
  }
};

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
  const { horario, horariInicio, horarioFim, setMessage, setTypeMessage, setIsMessage, fetchCustomers, closeMessage, closeNewItem, customers, selectedCustomers, ...rest } = props;

  const classes = useStyles();
  const { history } = useRouter();
  const [open, setOpen] = useState(false);

  const optionsTipoLancamento = ['Receita', 'Despesa'];
  const [inputTipoLancamento, setInputTipoLancamento] = useState('');
  const [valueTipoLancamento, setValueTipoLancamento] = useState(optionsTipoLancamento[0]);
  const [dataLancamento, setDataLancamento] = React.useState(new Date());

  const [paciente, setPaciente] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  useEffect(() => {
    /*let mounted = true;*/
    axios.get('/cinematica-service/pacientes/selectPessoa').then(response => {
      setOptions(response.data);
    });

    axios.get('/cinematica-service/formaPagamentos/selectFormaDePagamentos').then(response => {
    });
    return () => {
      /*mounted = false;*/
    };
  }, []);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      numeroRecibo: '',
      quantidadeParcela: '',
      paciente: '',
    },
    touched: {
    },
    errors: {}
  });

  if (selectedCustomers.length === 1 && formState.values.numeroRecibo === '') {
    const customer = customers.filter(e => e.id === selectedCustomers[0]);
    formState.values.numeroRecibo = customer[0].numeroRecibo;
    formState.values.quantidadeParcela = customer[0].quantidadeParcela;
    setInputValue(customer[0].pessoa.nome);
    formState.isValid = true;

  }

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

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleDateChange = (date) => {
    setDataLancamento(date);
  };

  const onSalvar = () => {
    formState.values.paciente =  formState.values.paciente != undefined ?  formState.values.paciente.id : null;
     new Promise(function (resolve, reject) {
        axios({
          method: selectedCustomers.length === 1 ? 'PUT' : 'POST',
          url: '/cinematica-service' + (selectedCustomers.length === 1 ? '/fluxoCaixa/' + selectedCustomers[0] : '/fluxoCaixa'),
          data: { ...formState.values }
        }).then(() => {
          setTypeMessage('success')
          setMessage('Registro salvo com sucesso.');
          setIsMessage(true)
          fetchCustomers(0, 10);
          closeNewItem();
          selectedCustomers.length = 0;
        }).catch(error => {
          setTypeMessage('error')
          setMessage('Error ao salvar o registro.');
          setIsMessage(true)
        }).finally(
          closeMessage()
        );
        window.scrollTo(0, document.body.scrollHeight);
      }) 
    console.log( formState.values.paciente)
  }

  const queryPacientes = value => {
    axios.get(`/cinematica-service/pacientes?nome=${value}&size=10`).then(response => {
        setPaciente(response.data.content);
      }).catch((error) => {
        setPaciente([]);
      });
  }

  const handlePacienteChange = async (event, newValue) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        paciente: newValue
      },
      touched: {
        ...formState.touched,
        paciente: true
      }
    }));
  };

  return (
    <form
      {...rest}
      className={clsx(classes.root, horario)}>
      <div className={classes.fields}>
        <Autocomplete
          value={valueTipoLancamento}
          onChange={(event, newValue) => {
            setValueTipoLancamento(newValue);
          }}
          inputValue={inputTipoLancamento}
          onInputChange={(event, newInputValue) => {
            setInputTipoLancamento(newInputValue);
          }}
          id="idTipoLancamentoCombo"
          options={optionsTipoLancamento}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Tipo de Lançamento" variant="outlined" />}
        />
        <Autocomplete
              loadingText="Aguarde um momento..."
              noOptionsText="Nada foi encontrado"
              options={paciente}
              value={formState.values.paciente}
              onChange={handlePacienteChange}
              onOpen={() => queryPacientes('')}
              getOptionLabel={option => option.nome ? option.nome : ''}
              includeInputInList
              renderInput={params => (
                <TextField
                  {...params}
                  name="paciente"
                  error={hasError('paciente')}
                  helperText={hasError('paciente') ? formState.errors.paciente[0] : null}
                  label="Paciente"
                  variant="outlined"
                  onChange={({ target }) => queryPacientes(target.value)}
                />
              )}
            />
      </div>
      <div className={classes.fields}>
        <KeyboardDatePicker
          disableToolbar
          variant="outlined"
          format="DD/MM/YYYY"
          margin="normal"
          value={moment(dataLancamento).format('L')}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </div>
      <div className={classes.fields}>
        <TextField
          error={hasError('numeroRecibo')}
          label="Numero do Recibo"
          name="numeroRecibo"
          onChange={handleChange}
          value={formState.values.numeroRecibo || ''}
          variant="outlined"
        />
        <TextField
          error={hasError('quantidadeParcela')}
          label="Quantidade de Parcelas"
          name="quantidadeParcela"
          onChange={handleChange}
          value={formState.values.quantidadeParcela || ''}
          variant="outlined"
        />
      </div>
      <Button
        className={classes.submitButton}
        color="secondary"
        size="small"
        variant="contained"
        onClick={onSalvar}>
        Salvar
      </Button>
    </form >
  );
};


export default RegisterForm;
