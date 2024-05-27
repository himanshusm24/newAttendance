import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CopyToClipboard } from "react-copy-to-clipboard";

const showAlert = (toastType, message, copymessage = "") => {
  toast[toastType](
    <div>
      {message}
      {copymessage ? (
        <CopyToClipboard text={message}>
          <button
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              border: "none",
              background: "#007bff",
              color: "#fff",
              cursor: "pointer",
              borderRadius: "3px",
            }}
            onClick={() => toast.success("Text copied to clipboard!")}
          >
            Copy
          </button>
        </CopyToClipboard>
      ) : (
        ""
      )}
    </div>,
    {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  );
};

export default showAlert;
