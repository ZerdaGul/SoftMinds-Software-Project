import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

import ConfirmModal from '../modals/ConfirmModal';
import './settings.scss';
import { DeleteUser } from '../../services/AuthService';
import InfoModal from '../modals/InfoModal';

const Settings = ({ initialValues }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isSubRoute = location.pathname !== '/profile/settings';

  const onLoaded = () => {
    setLoading(false);
    setLoaded(true);
    setShowModal(true);
  };

  const onError = (error) => {
    setLoading(false);
    setError(true);
    setShowModal(true);
    setErrorMessage(error.message);
  };

  const handleAccountDelete = async () => {
    setLoading(true);
    try {
      await DeleteUser({id: initialValues.id});
      onLoaded();
    } catch (error) {
      onError(error);
    }
  };

  const modal = (
    <div>
      {loaded && navigate('/')}
      {error && createPortal(
        <InfoModal
          title={"Error"}
          subtitle={errorMessage}
          onClose={() => {
            setShowModal(false);
            navigate('/');
          }} />,
        document.body
      )}
      {loading && createPortal(<img src='../../assets/loading-animation.gif' alt="Loading..." />, document.body)}
      <div className='overlay'></div>
    </div>
  );

  return (
    <>
      {showModal && modal}
      {!isSubRoute ? (
        <div className="settings__list">
          <div className='settings__item'>
            <Link to="reset-password" className='settings__action'>Reset password</Link>
          </div>
          <div className='settings__item'>
            <a href="#"
              onClick={() => setShowModal(true)}
              className='settings__action settings__action-delete'>Delete my account</a>
            <p className="settings__descr">Deleting your account will permanently remove all your data, including your profile information, order history, saved preferences, and any other associated content. This action cannot be undone. </p>
            {showModal && createPortal(
              <ConfirmModal
                title={"Delete account?"}
                subtitle={"You will not be able to undo this action"}
                buttonText={"Delete"}
                onClose={() => setShowModal(false)}
                onConfirm={handleAccountDelete} />,
              document.body
            )}
            {showModal && <div className='overlay'></div>}
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Settings;
