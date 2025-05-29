import "../styles/Home.css";
import Objetivo from "../components/Objetivo";
export default function Home() {
  return (
    <>
      <div className="home__fondoImg"></div>

      <div className="contenido__home">
        <h2 className="home__titulo">¿QUÉ BUSCAMOS?</h2>
        <div className="objetivos">
          <Objetivo
            imagen="./src/assets/ImageHome3.svg"
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
            imagen="./src/assets/ImageHome2.svg"
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
            imagen="./src/assets/ImageHome.svg"
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
