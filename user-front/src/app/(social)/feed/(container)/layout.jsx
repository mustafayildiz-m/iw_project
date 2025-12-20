'use client';

import { BsChatLeftTextFill, BsPeopleFill } from 'react-icons/bs';
import { Col, Container, Offcanvas, OffcanvasBody, OffcanvasHeader, Row } from 'react-bootstrap';
import { useLayoutContext } from '@/context/useLayoutContext';
import { FaSlidersH } from 'react-icons/fa';
import ProfilePanel from '@/components/layout/ProfilePanel';
import { profilePanelLinksData1 } from '@/assets/data/layout';
import OnlineUsersPanel from '@/components/layout/OnlineUsersPanel';
import ConversationPanel from '@/components/layout/ConversationPanel';
import useViewPort from '@/hooks/useViewPort';
import { useLanguage } from '@/context/useLanguageContext';

const FeedLayout = ({
  children
}) => {
  const { t } = useLanguage();
  const {
    messagingOffcanvas,
    startOffcanvas
  } = useLayoutContext();
  const {
    width
  } = useViewPort();
  return <>
      <main>
        <Container>
          <Row className="g-4" style={{ marginTop: '0.5rem' }}>
            <Col lg={3}>
              <div className="d-flex align-items-center d-lg-none">
                <button onClick={startOffcanvas.toggle} className="border-0 bg-transparent" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSideNavbar" aria-controls="offcanvasSideNavbar">
                  <span className="btn btn-primary">
                    <FaSlidersH />
                  </span>
                  <span className="h6 mb-0 fw-bold d-lg-none ms-2">{t('menu.profile')}</span>
                </button>
              </div>

              <nav className="navbar navbar-expand-lg mx-0">
                {width >= 992 ? <div className="d-block px-2 px-lg-0">
                    <ProfilePanel links={profilePanelLinksData1} />
                  </div> : <Offcanvas show={startOffcanvas.open} placement="start" onHide={startOffcanvas.toggle} tabIndex={-1} id="offcanvasSideNavbar">
                    <OffcanvasHeader closeButton />

                    <OffcanvasBody className="d-block px-2 px-lg-0">
                      <div>
                        <ProfilePanel links={profilePanelLinksData1} />
                      </div>
                    </OffcanvasBody>
                  </Offcanvas>}
              </nav>
            </Col>
            {children}
          </Row>
        </Container>
      </main>
      <div className="d-none d-lg-block">
        <a 
          onClick={messagingOffcanvas.toggle} 
          className="position-fixed end-0 bottom-0 me-5 mb-5 d-flex align-items-center justify-content-center" 
          role="button" 
          aria-controls="offcanvasChat"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: 'none',
            position: 'relative',
            zIndex: 1000
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
          }}
        >
          <BsPeopleFill size={24} color="white" />
          <span 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
            style={{
              fontSize: '0.7rem',
              minWidth: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white',
              animation: 'pulse 2s infinite'
            }}
          >
            <span className="online-dot" style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'inline-block'
            }}></span>
          </span>
        </a>
      </div>
      
      {/* Online Users Panel */}
      <OnlineUsersPanel />
      
      {/* Conversation Panel */}
      <ConversationPanel />
    </>;
};
export default FeedLayout;