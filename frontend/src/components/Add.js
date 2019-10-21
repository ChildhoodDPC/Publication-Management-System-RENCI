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
  const [textarea, setTextArea] = useState(`10.1111/risa.13004\n10.1111/risa.12990\n10.1109/noms.2018.8406240\n10.1109/noms.2018.8406273\n10.1093/sysbio/syx098`);
  const [insertStatus, setinsertStatus] = useState({ 'Added': [], 'Found': [] });
  const [result, setResultState] = useState('');
  const [file, setFile] = useState('');
  const [authorString, setAuthorStringState] = useState('');

  const handleChange = event => {
    setrefState(event.target.value);
  }

  const handleTextAreaChange = event => {
    setTextArea(event.target.value);
  }

  const fileChangeHandler = event => {
    setFile(event.target.files[0]);
  }

  function submitFile() {
    let formData = new FormData();
    formData.append('dois', file);
    console.log(formData.get('dois'))
    fetch(`http://${currentUrl}:5000/insert`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
  }

  const textAreaSubmit = event => {
    const lines = textarea.split('\n');
    event.preventDefault();
    fetch(`http://${currentUrl}:5000/insert`, {
      method: 'POST',
      body: lines,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(res => res.json())
      .then(data => setinsertStatus(data))
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
      <Container className={classes.root}>
        <textarea className={classes.body} id="user_input" rows="20" cols="60" onChange={handleTextAreaChange}>{textarea}
        </textarea>
        <Container>
          {insertStatus.Added.map(status => <Typography>{status}</Typography>)}
          {insertStatus.Found.map(status => <Typography>{status}</Typography>)}
        </Container>
        <Button className={classes.subButton} variant="contained" color="secondary" onClick={textAreaSubmit}> Submit </Button>
      </Container>

      {/* <Container>
        <Typography className={classes.body}><strong>   Result :  </strong>{result.status}</Typography>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.body}><strong>Title: </strong> {result.Title}</Typography>
            <Typography className={classes.body}><strong>DOI: </strong>{result.DOI}</Typography>
            <Typography className={classes.body}><strong>Author(s): </strong>{authorString}</Typography>
            <Typography className={classes.body}><strong>Type: </strong> {result.Type}</Typography>
          </CardContent>
        </Card>
      </Container> */}
    </div>
  );
}

export default Add;