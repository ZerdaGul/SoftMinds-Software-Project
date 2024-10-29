import React, {useEffect, useState} from 'react'
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';

import ConfirmModal from '../modals/ConfirmModal';
import './settings.scss';
import { GetActiveUser, DeleteUser } from '../../services/AuthService';


const Settings = () => {
  const [activeUser, setActiveUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadUser();
  }, [])

  const loadUser = () => {
    GetActiveUser()
      .then(data => setActiveUser(data.user))
      .catch((error) => console.log(error.message));
  }
  const handleAccountDelete =() => {
    const id = activeUser.id;
    deleteAccount(id);
    navigate('/');
  }

  const deleteAccount=(id)=> {
    DeleteUser(id)
      .then(() => console.log('Success'))
      .catch((error) => console.log(error.message));
  }

  return (
    <div className="settings__list">
      <div className='settings__item'>
        <Link to="reset-password" 
          className='settings__action settings__action'>Reset password</Link>        
      </div>
      <div className='settings__item'>
        <a href="#" 
          onClick={() => setShowModal(true)}
          className='settings__action settings__action-delete'>Delete my account</a>
        <p className="settings__descr">Deleting your account will permanently remove all your data, including your profile information, order history, saved preferences, and any other associated content. This action cannot be undone. </p>
        {showModal && <div>
            {createPortal(
            <ConfirmModal 
              title={"Delete account?"}
              subtitle={"You will not be able to undo this action"}
              buttonText={"Delete"}
              onClose={() => setShowModal(false)}
              onConfirm={handleAccountDelete}/>,
            document.body
          )}
          <div className='overlay'></div>
        </div> }
        
      </div>
      
    </div>
  )
}

export default Settings