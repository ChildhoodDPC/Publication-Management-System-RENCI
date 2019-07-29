import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';

const useStyles = makeStyles({
    body: {
      fontSize: 18,
      padding: '8px 8px',
    },
    subButton: {
      marginLeft: 10,
    },
    root: {
      padding: '12px 12px',
      display: 'flex',
      alignItems: 'center',
      width: 700,
    },
    input: {
      marginLeft: 8,
      flex: 1
    }
  });
  
  function Add() {
      const classes = useStyles();
      const currentUrl = window.location.hostname;
      const [ref, setrefState] = useState('');
      const [result, setResultState] = useState('');
      const [file, setFile] = useState('');
      const [authorString, setAuthorStringState] = useState('');
    
      const handleChange = event => {
        setrefState(event.target.value);
      }
    
      const fileChangeHandler = event => {
        console.log(event.target.files[0]);
      }

      function submitFile(uploadedfile) {
        fetch(`http://${currentUrl}:5000/insert`, {
          method: 'POST',
          body: uploadedfile})
          .then(res => res.json())
          .then(data => {
            console.log(data);
          })
      }

      const handleSubmit = event => {
        event.preventDefault();
        fetch(`http://${currentUrl}:5000/reference/${ref}/save=yes`)
          .then(res => res.json())
          .then(data => {
            setResultState(data);
            setAuthorStringState(data.Authors.join(', '));
          })
      }
    
      return (
        <div>
          <Container className={classes.root}>
            <Typography><strong>PubFinder</strong></Typography>
            <Input className={classes.input} id="ref" type="text" placeholder="Enter DOI to add Publications.." value={ref} onChange={handleChange}></Input>
            <Button className={classes.subButton} variant="contained" color="secondary" onClick={handleSubmit}>
              ADD </Button>
          </Container>
          <Container>
          <input type='file' name='file' onChange={fileChangeHandler} />
          <Button className={classes.subButton} color="secondary" onClick={submitFile}>Upload File</Button>
          </Container>
          <Container>
            <Typography className={classes.body}><strong>   Result :  </strong>{result.status}</Typography>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.body}><strong>Title: </strong> {result.Title}</Typography>
                <Typography className={classes.body}><strong>DOI: </strong>{result.DOI}</Typography>
                <Typography className={classes.body}><strong>Author(s): </strong>{authorString}</Typography>
                <Typography className={classes.body}><strong>Type: </strong> {result.Type}</Typography>
              </CardContent>
            </Card>
          </Container>
        </div>
      );
    }
  
  export default Add;