import React from 'react'
import Doctor_Panel from '../Dashboard/Doctor_Panel';
import PatientPanel from '../Dashboard/PatientPanel';

function Panel() {
const user = JSON.parse(localStorage.getItem('user'));
const role = user?.role;
// const dashboardRoute = role === 'doctor' ? '/DoctorPanel' : '/patient-panel';
  return  <>
    {role === 'doctor' ? <Doctor_Panel /> : <PatientPanel />}
    </>
  
}

export default Panel
