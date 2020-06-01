import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Drawer, Grid, Typography, Button, Hidden } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  }
}));

const TableEditBar = props => {
  const {
    selected,
    setNewItem,
    className,
    onEdit,
    closeMessage,
    fetchCustomers,
    setMessage,
    setTypeMessage,
    setIsMessage,
    ...rest
  } = props;

  const classes = useStyles();

  const onDelete = () => {
    new Promise(function (resolve, reject) {
      var urlDelete = selected.length > 1 ? 'deleteList/' + selected : selected;
      axios.delete('horarios/' + urlDelete).then(response => {
      }).then(() => {
        setTypeMessage('success');
        setMessage('Registro excluído com sucesso.');
        setIsMessage(true);
        selected.length = 0;
        fetchCustomers(0, 10);
      }).catch(error => {
        setTypeMessage('error')
        setMessage(error.response.data[0].mensagemUsuario);
        setIsMessage(true)
      }).finally(
        closeMessage()
      );
    });
  }

  const open = selected.length > 0;
  const showButtonCancelar = selected.length > 1;
  
  return (
    <Drawer
      anchor="bottom"
      open={open}
      /* eslint-disable-next-line react/jsx-sort-props */
      PaperProps={{ elevation: 1 }}
      variant="persistent"
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Grid
          alignItems="center"
          container
          spacing={2}
        >
          <Hidden smDown>
            <Grid
              item
              md={3}
            >
              <Typography
                color="textSecondary"
                variant="subtitle1"
              >
                {selected.length} Selecionados
              </Typography>
            </Grid>
          </Hidden>
          <Grid
            item
            md={6}
            xs={12}
          >
            <div className={classes.actions}>
              <Button onClick={onEdit} style={{ display: showButtonCancelar ? "none" : "block" }}>
                <CheckIcon className={classes.buttonIcon} />
                Editar
              </Button>
              <Button onClick={onDelete}>
                <DeleteIcon className={classes.buttonIcon} />
                Excluir
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </Drawer>
  );
};

export default TableEditBar;
