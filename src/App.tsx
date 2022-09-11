import React, { useState } from 'react';
import './App.scss';
import Work from './components/Work';
import uuid from 'react-uuid';

const fixedInputClass="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
const fixedButtonClass="group relative py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"


function App() {

  const workExpObj = {
    startDate: '',
    endDate: '',
    company: '',
    jobTitle:'',
    jobDescription:''
  }

  const [name,setName]=useState("");
  const [workExp,setWorkExp]=useState([{id: uuid(), ...workExpObj}]);
  const [age,setAge]=useState("");

  const onNameChange=(e:any)=>{
    setName(e.target.value)
  }
  const onAgeChange=(e:any)=>{
    setAge(e.target.value)
  }

  const onWorkFormUpdate = (e: any) => {
  }

  const onRemoveWork = ({id}: {id: any}) => {
    const tempArray = workExp.filter((work) => work.id !== id)
    setWorkExp(tempArray) 
  }
  const onAddWorkExp = (e: any) => {
    e.preventDefault();
    const uniqueObj = {id: uuid(), ...workExpObj}
    console.log('form submitted ✅', workExp.length);
    const tempArray = [...workExp, uniqueObj]
    setWorkExp(tempArray)
    console.log('form submitted 222 ✅', workExp.length);


  }
  return (
    <form className="mt-8 space-y-6 experience-form" noValidate>
        <div className="-space-y-px personal-details">
          <div className="my-5">
              <label htmlFor="name" className="">
                Name
              </label>
              <input
                id='name'
                onChange={onNameChange}
                value={name}
                type="text"
                required
                className={fixedInputClass}
                placeholder="Enter Name"
              />
            </div>
          <div className="my-5">
              <label htmlFor="age" className="">
                Age
              </label>
              <input
                id='age'
                onChange={onAgeChange}
                value={age}
                type="number"
                required
                min={1}
                className={fixedInputClass}
                placeholder="Enter Age"
              />
            </div>
        </div>
        <div className='add-work'>
          <span> Work Experience </span>
          <button className={fixedButtonClass} formNoValidate  onClick={onAddWorkExp}> Add </button>
        </div>
        <div className='-space-y-px work-exp'>
          { workExp.map((work, i) => <Work key={work.id} id={work.id} onWorkFormUpdate={onWorkFormUpdate} onRemoveWork={onRemoveWork} /> )}
        </div>
        <div className='action'>
          <button className={fixedButtonClass}> Clear </button>
          <button className={fixedButtonClass} type='submit'> Save </button>
        </div>
      </form>
  );
}

export default App;
