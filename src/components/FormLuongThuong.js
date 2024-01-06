import React, { useState, useEffect } from "react";
import Api from "../api/Api";

export const FormLuongThuong = ({ closeModal, onSubmit, defaultValue }) => {
  const [formState, setFormState] = useState(
    defaultValue || {
      LoaiLuongThuong: "",
      Tien: "",
      Thang: new Date().getMonth() + 1,
      Nam: new Date().getFullYear(),
      LoaiNhanVien: "Tất cả",
      MaNV: "",
      GhiChu: "",
    }
  );
  const [errors, setErrors] = useState("");
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    getStaffs();
  }, []);

  const getStaffs = async () => {
    const staffs = await Api.getAllStaffs();
    setStaffs(staffs);
  };
  const validateForm = () => {
    let validate = true;
    if (formState.LoaiLuongThuong != "" && formState.Tien != "") {
      if (formState.LoaiNhanVien == "Cá nhân" && formState.MaNV == "")
        validate = false;
    } else validate = false;
    if (validate) {
      setErrors("");
      console.log(1);
      return true;
    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (value == "") {
          switch (key) {
            case "LoaiLuongThuong":
              errorFields.push("Loại lương thưởng");
              break;
            case "Tien":
              errorFields.push("Số tiền");
              break;
            case "LoaiNhanVien":
              errorFields.push("Loại nhân viên");
              break;
            case "MaNV":
              if (formState.LoaiNhanVien == "Cá nhân")
                errorFields.push("Mã nhân viên");
              break;
            default:
              break;
          }
        }
      }
      setErrors("Vui lòng nhập: " + errorFields.join(", "));
      return false;
    }
  };

  const handleChange = (e) => {
    if (e.target.name == "LoaiNhanVien" && e.target.value != "Cá nhân")
      setFormState({ ...formState, [e.target.name]: e.target.value, MaNV: "" });
    else setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formState);

    closeModal();
  };

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
    >
      <div className="col-sm-4 modal1">
        <form>
          <div className="mb-2">
            <b>Loại lương thưởng</b>
          </div>
          <input
            type="text"
            className="form-control pb-2 pt-2 mb-2"
            value={formState.LoaiLuongThuong}
            id="LoaiLuongThuong"
            name="LoaiLuongThuong"
            onChange={handleChange}
          />
          <div className="mb-2">
            <b>Tiền</b>
          </div>
          <input
            type="number"
            className="form-control pb-2 pt-2 mb-2"
            value={formState.Tien}
            id="Tien"
            name="Tien"
            onChange={handleChange}
          />
          <div className="mb-2">
            <b>Ghi chú</b>
          </div>
          <input
            type="text"
            className="form-control pb-2 pt-2 mb-2"
            value={formState.GhiChu}
            id="GhiChu"
            name="GhiChu"
            onChange={handleChange}
          />
          <div className="mb-2">
            <b>Loại nhân viên</b>
          </div>
          <select
            className="form-select pb-2 pt-2 mb-2"
            aria-label="Chọn chi nhánh"
            id="LoaiNhanVien"
            name="LoaiNhanVien"
            value={formState.LoaiNhanVien}
            onChange={handleChange}
          >
            <option value="Tất cả">Tất cả</option>
            <option selected value="Tiếp tân">
              Tiếp tân
            </option>
            <option value="Nha sĩ">Nha sĩ</option>
            <option value="Phụ tá">Phụ tá</option>
            <option value="Quản lý">Quản lý</option>
            <option value="Cá nhân">Cá nhân</option>
          </select>
          {formState.LoaiNhanVien === "Cá nhân" ? (
            <div>
              <div className="mb-2">
                <b>Mã nhân viên</b>
              </div>
              <select
                className="form-select pb-2 pt-2 mb-2"
                id="type"
                name="MaNV"
                onChange={handleChange}
                value={formState.MaNV}
              >
                {staffs.map((item, index) => (
                  <option key={index} value={item.maNhanVien}>
                    {item.maNhanVien}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {errors && <div className="error">{errors}</div>}
          <div className="text-end">
            <button
              type="submit"
              className="btn pb-2 pt-2 ps-3 pe-3 mt-2"
              style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
              onClick={(e) => handleSubmit(e)}
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};