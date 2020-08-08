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
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
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

  
  const [paciente, setPaciente] = React.useState([]);
  const [formaPagamento, setFormaPagamento] = React.useState([]);
  const [especialidade, setEspecialidade] = React.useState([]);
  const [tipoLancamento, setTipoLancamento] = React.useState([{"nome": "Receita" }, {"nome": "Despesa"}]);

  useEffect(() => {
    /*let mounted = true;*/
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
      dataLancamento: new Date(),
      formaPagamento: '',
      especialidade: '',
      descricao: '',
      valor: '',
      tipoLancamento: '',
    },
    touched: {
    },
    errors: {}
  });

  if (selectedCustomers.length === 1 && formState.values.numeroRecibo === '') {
    const customer = customers.filter(e => e.id === selectedCustomers[0]);
    formState.values.tipoLancamento = customer[0].tipoLancamento
    formState.values.numeroRecibo = customer[0].numeroRecibo;
    formState.values.quantidadeParcela = customer[0].quantidadeParcela;
    formState.values.dataLancamento = customer[0].dataLancamento;
    formState.values.paciente = customer[0].pessoa === null ? 'Cinemática' : customer[0].pessoa.nome;
    formState.values.descricao = customer[0].descricao;
    formState.values.valor = customer[0].valor;
    formState.isValid = true;
    console.log(formState.values)
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

  const onSalvar = () => {
    formState.values.tipoLancamento = formState.values.tipoLancamento != undefined ? formState.values.tipoLancamento.nome : null;
    /*formState.values.paciente = formState.values.paciente != undefined ? formState.values.paciente.id : null; */
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
    console.log(formState.values)
  }

  const queryFormasPagamentos = value => {
    axios.get(`/cinematica-service/formaPagamentos?descricao=${value}&size=10`).then(response => {
      setFormaPagamento(response.data.content);
    }).catch((error) => {
      setFormaPagamento([]);
    });
  }

  const handleFormasPagamentosChange = async (event, newValue) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        formaPagamento: newValue
      },
      touched: {
        ...formState.touched,
        formaPagamento: true
      }
    }));
  };

  const queryEspecialidades = value => {
    axios.get(`/cinematica-service/especialidades?descricao=${value}&size=10`).then(response => {
      setEspecialidade(response.data.content);
    }).catch((error) => {
      setEspecialidade([]);
    });
  }

  const handleEspecialidadesChange = async (event, newValue) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        especialidade: newValue
      },
      touched: {
        ...formState.touched,
        especialidade: true
      }
    }));
  };

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

  const handleTipoLancamentoChange = async (event, newValue) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        tipoLancamento: newValue
      },
      touched: {
        ...formState.touched,
        tipoLancamento: true
      }
    }));
  };

  const numberFormat = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'INR'
    }).format(value);

  return (
    <form
      {...rest}
      className={clsx(classes.root, horario)}>
      <div className={classes.fields}>
        <Autocomplete
          loadingText="Aguarde um momento..."
          noOptionsText="Nada foi encontrado"
          options={tipoLancamento}
          value={formState.values.tipoLancamento}
          onChange={handleTipoLancamentoChange}
          getOptionLabel={option => option.nome ? option.nome : ''}
          includeInputInList
          renderInput={params => (
            <TextField
              {...params}
              name="tipoLancamento"
              error={hasError('tipoLancamento')}
              helperText={hasError('tipoLancamento') ? formState.errors.tipoLancamento[0] : null}
              label="Tipo de Lançamento"
              variant="outlined"
            />
          )}
        />
      </div>
      <div className={classes.fields}>
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
          disabled={true}
          name="dataLancamento"
          variant="outlined"
          format="DD/MM/YYYY"
          margin="normal"
          value={formState.values.dataLancamento}
          onChange={handleChange}
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
      <div className={classes.fields}>
        <Autocomplete
          loadingText="Aguarde um momento..."
          noOptionsText="Nada foi encontrado"
          options={especialidade}
          value={formState.values.especialidade}
          onChange={handleEspecialidadesChange}
          onOpen={() => queryEspecialidades('')}
          getOptionLabel={option => option.descricao ? option.descricao : ''}
          includeInputInList
          renderInput={params => (
            <TextField
              {...params}
              name="especialidade"
              error={hasError('especialidade')}
              helperText={hasError('especialidade') ? formState.errors.especialidade[0] : null}
              label="Especialidades"
              variant="outlined"
              onChange={({ target }) => queryEspecialidades(target.value)}
            />
          )}
        />
      </div>
      <div className={classes.fields}>
        <Autocomplete
          loadingText="Aguarde um momento..."
          noOptionsText="Nada foi encontrado"
          options={formaPagamento}
          value={formState.values.formaPagamento}
          onChange={handleFormasPagamentosChange}
          onOpen={() => queryFormasPagamentos('')}
          getOptionLabel={option => option.descricao ? option.descricao : ''}
          includeInputInList
          renderInput={params => (
            <TextField
              {...params}
              name="formaPagamento"
              error={hasError('formaPagamento')}
              helperText={hasError('formaPagamento') ? formState.errors.formaPagamento[0] : null}
              label="Forma de Pagamento"
              variant="outlined"
              onChange={({ target }) => queryFormasPagamentos(target.value)}
            />
          )}
        />
      </div>
      <div className={classes.fields}>
      <TextField
          error={hasError('descricao')}
          label="Observações"
          name="descricao"
          onChange={handleChange}
          value={formState.values.descricao || ''}
          variant="outlined"
        />
      </div>
      <div className={classes.fields}>
        <FormControl fullWidth className={classes.margin} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-amount">Valor</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            name="valor"
            pattern="[0-9]*"
            type="number"
            value={formState.values.valor}
            onChange={handleChange}
            startAdornment={<InputAdornment position="start">R$</InputAdornment>}
            labelWidth={60}
          />
        </FormControl>
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
