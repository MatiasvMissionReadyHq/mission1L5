import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState({type: null, brand:null});
  const [loading, setLoading] = useState(false);
 
  const renderResult = (items) => {

    if (!items) {
      return null;
    }
    const arrayBrand = ["hyundai","honda","mercedes benz","mitsubishi", "toyota", "volkswagen"];
    const arrayType = ["sedan", "hatchback", "suv", "van", "ute"];
    let apiResult=[];
    // let apiResult[0]=[];

    items.map(item=>{
      //check if the tagName is include in brands
      if(arrayBrand.includes(item.tagName) && !apiResult.includes(item.tagName)){
        if(typeof(apiResult['brand']) == "undefined"){
          apiResult['brand']=item.tagName;
        } 
      }
      // check if the tagName is include in car type array
      // console.log(arrayType.includes(item.tagName))
      if(typeof(apiResult['type']) == "undefined" && arrayType.includes(item.tagName)){
        apiResult["type"]=item.tagName;
      }

    });
    console.log(apiResult)
    return apiResult;
  } 

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if(response.status==200){
        setResult(renderResult(response.data));
      }else{
        alert("Something went wrong, please try again later");
      }
      

    } catch (error) {
        console.error("error uploading the file!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Car Recognition</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} accept="image/*" required />
          <button type="submit">Upload</button>
        </form>
        {loading && <p>Loading...</p>}
        {(result.type && result.brand) && (
          <div className="result">
            <h2>Recognition Result</h2>
              <ul>
              <li>Car Brand: {result.brand}</li>
                <li>Car type: {result.type}</li>
              </ul>  
          </div>
        )}   
      </header>
    </div>
  );
}

export default App;