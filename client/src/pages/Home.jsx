import "../styles/Home.css";
import Objetivo from "../components/Objetivo";
export default function Home() {
  return (
    <>
      <div className="home__fondoImg"></div>

      <div className="contenido__home">
        <h1 className="home__titulo">¿QUÉ BUSCAMOS?</h1>
        <div className="objetivos">
          <Objetivo
            imagen="./src/assets/ImageHome3.png"
            alt="Entrenar ingenieras"
            descripcion={
              <>
                Entrenar 1000 ingenieras
                <br />
                hispanas en software para 2025
              </>
            }
          />
          <Objetivo
            imagen="./src/assets/ImageHome2.png"
            alt="Cambiar el paradigma"
            descripcion={
              <>
                Cambiar el paradigma
                <br />
                en áreas y carreras STEM
              </>
            }
          />
          <Objetivo
            imagen="./src/assets/ImageHome.png"
            alt="Catalizar la independencia"
            descripcion={
              <>
                Catalizar la independecia
                <br />
                financiera de la mujer
              </>
            }
          />
        </div>
      </div>
    </>
  );
}
