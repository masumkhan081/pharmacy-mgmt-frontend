import React, { useEffect } from "react";
import { tblHeaderGenerics, tblOptionsDrugsPage } from "../../ui-config/table";
import { useDispatch, useSelector } from "react-redux";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import {
  checkSingle,
  checkAll,
  setCurrentView,
  setGenerics,
  toggleModal,
  setModaldata,
} from "../../redux/slices/DrugsView";
import { getHandler } from "../../utils/handlerReqRes";
import { useLocation } from "react-router-dom";
import { ENTITIES } from "../../ui-config/entities";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

export default function GenericTbl({ }) {
  //
  const location = useLocation();
  const dispatch = useDispatch();
  const generics = useSelector((state) => state.drugsView.generics);
  const allChecked = useSelector((state) => state.drugsView.allChecked);
  //
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getHandler("/generics");
        dispatch(setCurrentView({ view: ENTITIES.generic, data }));
      } catch (err) {
        console.error("Failed to fetch generics:", err.message);
      }
    };
    fetch();
    localStorage.setItem("activeTab", ENTITIES.generic);
    localStorage.setItem("lastRoute", location.pathname);
  }, []);
  //
  return (
    <div className="table-shell">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="tr-thead">
            {/* <th className="th">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => dispatch(checkAll())}
              />
            </th> */}
            {tblHeaderGenerics.map((itm, ind) => {
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
          {generics &&
            generics.map((item, ind) => {
              return (
                <tr key={item._id} className="tr-tbody">
                  <td className="td">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => dispatch(checkSingle())}
                    />
                  </td>
                  <td className="py-4">{ind + 1}</td>
                  <td className="py-4">{item.name}</td>
                  <td className="py-4">{item.groupId}</td>
                  <td className="py-4 flex justify-center gap-2">
                    <Button
                      aria-label={`Edit ${item.name}`}
                      onClick={() => {
                        dispatch(
                          toggleModal({
                            isModalForEdit: true,
                            isModalVisible: true,
                            data: { id: item._id, name: item.name },
                          })
                        );
                        dispatch(
                          setModaldata({ id: item._id, name: item.name })
                        );
                      }}
                    >
                      <AiFillEdit className="w-5 h-5 text-primary-600 hover:text-primary-700 transition-colors cursor-pointer" />
                    </Button>
                    <Button aria-label={`Delete ${item.name}`}>
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
