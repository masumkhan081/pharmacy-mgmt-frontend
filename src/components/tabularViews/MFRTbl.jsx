import React, { useEffect } from "react";
import { tblHeaderMfrs, tblOptionsDrugsPage } from "../../ui-config/table";
import { useDispatch, useSelector } from "react-redux";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import {
  checkSingle,
  checkAll,
  setCurrentView,
  toggleModal,
  setModaldata,
} from "../../redux/slices/DrugsView";
import { getHandler } from "../../utils/handler";
import MFRForm from "../drugs/MFRForm";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ENTITIES } from "../../ui-config/entities";

export default function MFRTbl({ }) {
  //
  const location = useLocation();
  const dispatch = useDispatch();
  const mfrs = useSelector((state) => state.drugsView.manufacturers);
  const allChecked = useSelector((state) => state.drugsView.allChecked);
  const isModalForEdit = useSelector((state) => state.drugsView.isModalForEdit);
  const isModalVisible = useSelector((state) => state.drugsView.isModalVisible);
  //
  const [dropDown, setDropDown] = useState(false);
  //
  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/manufacturers");
      console.log(JSON.stringify(data));
      dispatch(
        setCurrentView({
          view: ENTITIES.manufacturer,
          data: data.data.manufacturers,
        })
      );
    };
    fetch();
    //
    localStorage.setItem("activeTab", ENTITIES.manufacturer);
    localStorage.setItem("lastRoute", location.pathname);
  }, []);
  //
  return (
    <div className="w-full border rounded-md border-slate-200 overflow-x-scroll">
      <table className="w-full ">
        <thead>
          <tr className="tr_thead">
            {/* <th className="th">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => dispatch(checkAll())}
              />
            </th> */}
            {tblHeaderMfrs.map((itm, ind) => {
              return (
                <th key={ind} className="th">
                  {itm}
                </th>
              );
            })}
            <th className="th">Action</th>
          </tr>
        </thead>

        <tbody>
          {mfrs &&
            mfrs.map((item, ind) => {
              return (
                <tr key={item._id} className="tr_tbody">
                  {/* <td className="td">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => dispatch(checkSingle())}
                  />
                </td> */}
                  <td className="py-1.125">{ind + 1}</td>
                  <td className="py-1.125">{item.name}</td>
                  <td className="py-1.0 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        dispatch(
                          toggleModal({
                            isModalForEdit: true,
                            isModalVisible: true,
                          })
                        );
                        dispatch(
                          setModaldata({ id: item._id, name: item.name })
                        );
                      }}
                    >
                      <AiFillEdit className="p-0.125 w-6 h-6 shadow-sm border bg-slate-200 border-teal-600 rounded-full" />
                    </button>
                    <button>
                      <AiFillDelete className="p-0.125 w-6 h-6 shadow-sm border bg-slate-200 border-teal-600 rounded-full" />
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
