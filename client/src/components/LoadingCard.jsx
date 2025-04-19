export default function LoadingCard({ mensaje }) {
    return (
      <div className="fondo">
        <div className="register-container">
          <div className="card">
            <h2 className="titulo">{mensaje}</h2>
          </div>
        </div>
      </div>
    );
  }
  