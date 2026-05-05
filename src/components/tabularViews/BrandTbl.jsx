import React, { useEffect } from "react";
import { tblHeaderBrands, tblOptionsDrugsPage } from "../../ui-config/table";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSingle,
  checkAll,
  setCurrentView,
} from "../../redux/slices/DrugsView";
import { getHandler } from "../../utils/handlerReqRes";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import {
  toggleModal,
  setModaldata
} from "../../redux/slices/DrugsView";
import { useLocation } from "react-router-dom";
import { ENTITIES } from "../../ui-config/entities";
import Button from "../common-ui/Button";
import Input from "../common-ui/Input";

export default function BrandTbl({ }) {
  //
  const location = useLocation();
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.drugsView.brands);
  const allChecked = useSelector((state) => state.drugsView.allChecked);
  //
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getHandler("/brands");
        dispatch(setCurrentView({ view: ENTITIES.brand, data }));
      } catch (err) {
        console.error("Failed to fetch brands:", err.message);
      }
    };
    fetch();
    localStorage.setItem("activeTab", ENTITIES.brand);
    localStorage.setItem("lastRoute", location.pathname);
  }, []);
  //
  return (
    <div className="table-shell">
      <table className="w-full min-w-[480px]">
        <thead>
          <tr className="tr-thead">
            <th className="th">
              <Input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => dispatch(checkAll())}
              />
            </th>
            {tblHeaderBrands.map((itm, ind) => {
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

          {brands && brands?.map((item, ind) => {
            return (
              <tr key={item._id ?? ind} className="tr-tbody">
                <td className="td">
                  <Input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => dispatch(checkSingle())}
                  />
                </td>

                <td className="py-4">{ind + 1}</td>
                <td className="py-4">{item.name}</td>
                {/* <td className="py-4">{item.genericId.name}</td>
                <td className="py-4">{item.genericId.groupId.name}</td>
                <td className="py-4">{item.mfrId.name}</td> */}
                <td className="py-4 flex justify-center gap-2">
                  <Button
                    aria-label={`Edit ${item.name}`}
                    onClick={() => {
                      dispatch(toggleModal({ isModalForEdit: true, isModalVisible: true, data: { id: item._id, name: item.name } }))
                      dispatch(setModaldata({ id: item._id, name: item.name }))
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
      {/* {JSON.stringify(brands)} */}
    </div>
  );
}
