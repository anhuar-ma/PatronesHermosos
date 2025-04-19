export default function Paginacion({ totalPages, currentPage, setCurrentPage }) {
    return (
      <div className="paginacion">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`pagina-btn ${currentPage === index + 1 ? "activa" : ""}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  }
  