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
import { getHandler } from "../../utils/handlerReqRes";
import MFRForm from "../drugs/MFRForm";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ENTITIES } from "../../ui-config/entities";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

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
  const [isLoading, setIsLoading] = useState(false)
  //
  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const data = await getHandler("/manufacturers");
      // alert(JSON.stringify(data));
      dispatch(
        setCurrentView({
          view: ENTITIES.manufacturer,
          data: data.data.data.data,
        })
      );
      setIsLoading(false);
    };
    if (!isLoading) {
      fetch();
    }
    //
    localStorage.setItem("activeTab", ENTITIES.manufacturer);
    localStorage.setItem("lastRoute", location.pathname);
  }, [dispatch]);
  //
  return (
    <div className="w-full border border-neutral-200 rounded-xl overflow-hidden shadow-sm bg-white">
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
                    <Button
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
                      <AiFillEdit className="w-5 h-5 text-primary-600 hover:text-primary-700 transition-colors cursor-pointer" />
                    </Button>
                    <Button>
                      <AiFillDelete className="w-5 h-5 text-error-600 hover:text-error-700 transition-colors cursor-pointer" />
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
