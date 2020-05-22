import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Link,
  Avatar
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAddOutlined';
import './RegisterEspecialidade.css'
import gradients from 'utils/gradients';
import { Page } from 'components';
import { RegisterForm } from './components';

const useStyles = makeStyles(theme => ({
}));

const RegisterEspecialidade = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Nova Especialidade">
      <Card className="card">
        <CardHeader title="Nova Especialidade" />
        <RegisterForm />
      </Card>
    </Page>
  );
};

export default RegisterEspecialidade;
