import React from 'react';
import { NavLink } from 'react-router-dom';
import homeicon from './assets/home.png'
const Homeicon = () => {
  return (
    <>
    <div><NavLink to="/">              
            <img src={homeicon} alt="" className='absolute z-[100] hidden md:block md:scale-[0.8] md:top-12 md:left-0' />
   </NavLink></div>
    </>
  );
};

export default Homeicon;
