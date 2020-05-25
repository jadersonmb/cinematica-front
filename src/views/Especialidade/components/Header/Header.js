import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = props => {
  const { className, setNovoItem, ...rest } = props;

  const classes = useStyles();

  const novoItem = () => {
    setNovoItem(true);
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        alignItems="flex-end"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid item>
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            Especialidade
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            onClick={novoItem}
            variant="contained">
            Novo
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
