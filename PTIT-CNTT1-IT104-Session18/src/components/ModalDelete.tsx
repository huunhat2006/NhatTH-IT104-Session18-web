import "./ModalDelete.css";

type Props = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ModalDelete = ({ show, onClose, onConfirm }: Props) => {
  if (!show) return null;

  return (
    <div className="modal-overlay-delete">
      <div className="modal-content-delete">
        <p>Bạn có chắc muốn xoá công việc này?</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Xoá</button>
          <button onClick={onClose}>Huỷ</button>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
