import React, { useEffect } from "react";
import { tblHeadergroups } from "../../static-data/table";
import { useDispatch, useSelector } from "react-redux";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { checkSingle, checkAll, setCurrentView } from "../../redux/slices/DrugsView";
import { getHandler } from "../../util/handler";

export default function GroupTbl() {
  // 
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.drugsView.groups);
  const allChecked = useSelector((state) => state.drugsView.allChecked);
  // 
  useEffect(() => {
    const fetch = async () => {
      const data = await getHandler("/groups");
      dispatch(setCurrentView({ view: "groups", data: data.data.groups }));
    };
    fetch();
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
            {tblHeadergroups.map((itm, ind) => {
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
          {groups && groups.map((item, ind) => {
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
                      dispatch(initModal({ isModalForEdit: true, isModalVisible: true, data: { id: item._id, name: item.name } }))
                      dispatch(setModaldata({ id: item._id, name: item.name }))
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
