import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import RegistroParticipantes from "./RegistroParticipantes";
import RegistroColaboradores from "./RegistroColaboradores";
import RegistroSedes from "./RegistroSedes";
import IniciarSesion from "./IniciarSesion";
import Home from "./Home";
import ListadoColaboradores from "./ListadoColaboradores";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home></Home>}>
          {" "}
        </Route>
        <Route
          path="/participante"
          element={<RegistroParticipantes></RegistroParticipantes>}
        >
          {" "}
        </Route>
        <Route
          path="/colaborador"
          element={<RegistroColaboradores></RegistroColaboradores>}
        >
          {" "}
        </Route>
        <Route path="/sede" element={<RegistroSedes></RegistroSedes>}></Route>
        <Route path="/sesion" element={<IniciarSesion></IniciarSesion>}></Route>
        <Route
          path="/viewColaboradores"
          element={<ListadoColaboradores></ListadoColaboradores>}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
