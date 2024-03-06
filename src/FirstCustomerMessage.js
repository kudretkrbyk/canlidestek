import React from "react";

export default function FirstCustomerMessage({ _handleOpenForm }) {
  return (
    <div>
      <div
        id="müşteri-mesajı-1"
        className="p-6 w-full flex justify-end items-center"
      >
        <div className="flex justify-start items-start gap-3">
          <div
            id="buttons"
            className="flex flex-col justify-center items-end gap-3"
          >
            <button
              id="1"
              className="p-2 bg-blue-200  dark:bg-blue-700 rounded-xl rounded-tr-sm"
              onClick={_handleOpenForm}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </button>

            <button
              id="2"
              className="p-2 bg-blue-200  dark:bg-blue-700 rounded-xl rounded-tr-sm "
              onClick={_handleOpenForm}
            >
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s
            </button>
            <button
              id="3"
              className="p-2 bg-blue-200  dark:bg-blue-700 rounded-xl rounded-tr-sm"
              onClick={_handleOpenForm}
            >
              temsilciye bağlan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
