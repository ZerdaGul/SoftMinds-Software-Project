import React, {useState} from 'react'
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import ConfirmModal from '../modals/ConfirmModal';
import './settings.scss';


const Settings = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const handleAccountDelete =() => {
    //delete API
    navigate('/');
  }

  return (
    <div className="settings__list">
      <div className='settings__item'>
        <a href="#" 
          onClick={() => setShowModal(true)}
          className='settings__action settings__action-delete'>Delete my account</a>
        <p className="settings__descr">Deleting your account will permanently remove all your data, including your profile information, order history, saved preferences, and any other associated content. This action cannot be undone. </p>
        {showModal ? createPortal(
          <ConfirmModal 
            title={"Delete account?"}
            subtitle={"You will not be able to undo this action"}
            buttonText={"Delete"}
            onClose={() => setShowModal(false)}
            onConfirm={handleAccountDelete}/>,
          document.body
        ) : null}
        {showModal && <div className='overlay'></div>}
      </div>
    </div>
  )
}

export default Settings