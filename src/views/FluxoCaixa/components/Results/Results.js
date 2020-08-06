import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles, withStyles } from '@material-ui/styles';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';

import getInitials from 'utils/getInitials';
import { ReviewStars, GenericMoreButton, TableEditBar } from 'components';
import NumberFormat from 'react-number-format';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import gradients from 'utils/gradients';
import Tooltip from '@material-ui/core/Tooltip';
import { Label } from 'components';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 700
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  actions: {
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  },
  avatarGreen: {
    backgroundImage: gradients.green
  },
  avatarRed: {
    backgroundImage: gradients.red
  },
}));

const Results = props => {
  const { className, customers, setMessage, setTypeMessage, setIsMessage, fetchCustomers, fetchCustomersPagination, closeMessage, setNewItem, setSelectedCustomers,
    selectedCustomers, onEdit, page, setPage, size, rowPerPage, ...rest } = props;

  const classes = useStyles();
  const [rows, setRows] = useState();

  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

  const handleSelectAll = event => {
    const selected = event.target.checked
      ? customers.map(customer => customer.id)
      : [];

    setSelectedCustomers(selected);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomers.indexOf(id);
    let newSelectedCustomers = [];

    if (selectedIndex === -1) {
      newSelectedCustomers = newSelectedCustomers.concat(selectedCustomers, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomers = newSelectedCustomers.concat(
        selectedCustomers.slice(1)
      );
    } else if (selectedIndex === selectedCustomers.length - 1) {
      newSelectedCustomers = newSelectedCustomers.concat(
        selectedCustomers.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCustomers = newSelectedCustomers.concat(
        selectedCustomers.slice(0, selectedIndex),
        selectedCustomers.slice(selectedIndex + 1)
      );
    }
    setSelectedCustomers(newSelectedCustomers);
  };

  const handleChangePage = (event, page) => {
    fetchCustomersPagination(page, rowPerPage);
  };

  const handleChangeRowsPerPage = event => {
    setRows(event.target.value);
    fetchCustomersPagination(size / event.target.value > 0 ? 0 : page, event.target.value)
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
      </Typography>
      <Card>
        <CardHeader
          action={<GenericMoreButton />}
          title="Todos Fluxo de caixa"
        />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCustomers.length === customers.length}
                        color="primary"
                        indeterminate={
                          selectedCustomers.length > 0 &&
                          selectedCustomers.length < customers.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell>Paciente</TableCell>
                    <TableCell>Data de lançamento</TableCell>
                    <TableCell>Especialidade</TableCell>
                    <TableCell>Responsável</TableCell>
                    <TableCell>Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.slice(0, rowPerPage).map(customer => (
                    <TableRow
                      hover
                      key={customer.id}
                      selected={selectedCustomers.indexOf(customer.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedCustomers.indexOf(customer.id) !== -1
                          }
                          color="primary"
                          onChange={event =>
                            handleSelectOne(event, customer.id)
                          }
                          value={selectedCustomers.indexOf(customer.id) !== -1}
                        />
                      </TableCell>
                      <TableCell />
                      <TableCell>
                        <HtmlTooltip
                          title={
                            <React.Fragment>
                              <Typography color="inherit">{customer.tipoLancamento}</Typography>
                            </React.Fragment>
                          }
                        >
                          <Avatar className={customer.tipoLancamento == 'Receita' ? classes.avatarGreen : classes.avatarRed}>
                            {customer.tipoLancamento == 'Receita' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                          </Avatar>
                        </HtmlTooltip>
                      </TableCell>
                      <TableCell>{customer.pessoa === null ? 'Cinemática' : customer.pessoa.nome}</TableCell>
                      <TableCell>{moment(customer.dataLancamento).format('L')}</TableCell>
                      <TableCell>{customer.especialidade !== null ? customer.especialidade.descricao : ''}</TableCell>
                      <TableCell>{customer.usuario.pessoa.nome}</TableCell>
                      <TableCell><Label color={customer.tipoLancamento == 'Receita' ? 'Green' : 'Red'} ><NumberFormat value={customer.valor} displayType={'text'} thousandSeparator={true} prefix={'R$'} /></Label></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>
          <TablePagination
            component="div"
            count={size}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count, page }) => `${from}-${to} de ${count}`}
            page={page}
            rowsPerPage={rowPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage={'Linhas por página:'}
          />
        </CardActions>
      </Card>
      <TableEditBar onEdit={onEdit} setNewItem={setNewItem} selected={selectedCustomers} closeMessage={closeMessage} fetchCustomers={fetchCustomers} setMessage={setMessage} setTypeMessage={setTypeMessage} setIsMessage={setIsMessage} />
    </div>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

Results.defaultProps = {
  customers: []
};

export default Results;
