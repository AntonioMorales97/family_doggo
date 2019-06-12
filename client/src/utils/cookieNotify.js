import React from 'react';
import { toast } from 'react-toastify';
import { Container, Button } from 'reactstrap';
import CookieInformationModal from '../components/CookieInformationModal';

const setCookieConsent = () => {
  localStorage.setItem('cookieConsent', 'true');
};

// Testing...
/*
const deleteCookieConsent = () => {
  localStorage.removeItem('cookieConsent');
};
*/

const CookieMsg = ({ closeToast }) => (
  <Container>
    <h1>We use cookies</h1>
    <p>
      We use cookies to improve and secure your browsing experience on our
      website. By browsing our website, you consent to our use of cookies.
    </p>
    <div className='row'>
      <div>
        <CookieInformationModal />
      </div>
      <div>
        <Button color='light' className='ml-3' onClick={closeToast}>
          OK, I Agree
        </Button>
      </div>
    </div>
  </Container>
);

const cookieNotify = () => {
  if (!localStorage.getItem('cookieConsent')) {
    toast.info(<CookieMsg />, {
      className: 'cookie-info',
      bodyClassName: 'cookie-body',
      autoClose: false,
      position: toast.POSITION.BOTTOM_CENTER,
      closeOnClick: false,
      closeButton: false,
      onClose: () => setCookieConsent()
    });
  }
};

export default cookieNotify;
