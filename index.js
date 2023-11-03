import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

import data from './response_data.js';

// Define a sample API route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from your Node.js API!' });
});

app.get('/api/fetch_response', (req, res) => {
  // console.log(respon);
  res.json( data);
  // res.json({ message: response_data});
});

app.post('/api/add_response', (req, res) => {
  
  const requestData = req.body;// {"C1-PRY-34" : {token: "C1-PRY-034", time: 1694596190966, display: 34}};
  const keysv = Object.keys(requestData);
  // console.log("keys",keysv);
  data["requested_token"][keysv] = requestData[keysv]; //updated the response
   res.json(data);
});

app.post('/api/checkout_response', (req, res) => {

  let req_final = req.body.tokenToCheckout;//'C1-PRY-24'
  if (data["requested_token"][req_final]) {
    delete data["requested_token"][req_final];
    // console.log(response_data);
  } 
  data["returned_token"].push(req_final);
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
