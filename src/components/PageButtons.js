export const PageButtons = ({ page, setPage, totalPages, fetchFunction }) => {
  return (
    <div style={{ width: 500, margin: "auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <button
          style={{ marginRight: 5 }}
          onClick={async () => {
            if (page !== 0) {
              setPage(page - 1);
              await fetchFunction();
            }
          }}
          className="btn btn-secondary"
        >
          {"<"}
        </button>
        <div style={{ marginTop: 5 }}>Pag. {page + 1}</div>
        <button
          style={{ marginLeft: 5 }}
          onClick={async () => {
            if (page !== totalPages - 1) {
              setPage(page + 1);
              await fetchFunction();
            }
          }}
          className="btn btn-secondary "
        >
          {">"}
        </button>
      </div>
    </div>
  );
};
