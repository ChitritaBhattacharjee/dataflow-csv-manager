import React from "react";
import ReactDOM from "react-dom/client";

import FileUploader from "./component/FileUploader";

const AppLayout = () => {
    return (
      <div id="container">
        <h1 className="text-2xl font-semibold text-center my-4">
          CSV to Database Dump & CSV Report generation😎
        </h1>
        <FileUploader />
      </div>
    );
  };

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<AppLayout />);