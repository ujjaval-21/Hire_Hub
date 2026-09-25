function ConfirmLogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Log out?</h3>
        <p className="card-meta">Are you sure you want to log out of your account?</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmLogoutModal;