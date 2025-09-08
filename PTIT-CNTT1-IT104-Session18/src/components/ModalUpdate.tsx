import { useState, useRef, useEffect } from "react";
import "./ModalUpdate.css";

type Props = {
  show: boolean;
  onClose: () => void;
  onUpdate: (newName: string) => void;
  defaultValue: string;
};

const ModalUpdate = ({ show, onClose, onUpdate, defaultValue }: Props) => {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show) {
      setValue(defaultValue);
      inputRef.current?.focus();
    }
  }, [show, defaultValue]);

  if (!show) return null;

  return (
    <div className="modal-overlay-update">
      <div className="modal-content-update">
        <h5>Sửa công việc</h5>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={() => onUpdate(value)}>Cập nhật</button>
          <button onClick={onClose}>Huỷ</button>
        </div>
      </div>
    </div>
  );
};

export default ModalUpdate;
