'use client';

import { Card, Col, Row, Container } from 'react-bootstrap';
import SignUpForm from './components/SignUpForm';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../auth-pages.module.css';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/useLanguageContext';

const SignUp = () => {
  const { t } = useLanguage();
  
  return (
    <div className={styles.authWrapper}>
      <Container style={{ position: 'relative', zIndex: 20, maxWidth: '100%' }}>
        {/* Language Switcher - Desktop: Top Right, Mobile: Bottom */}
        <div className={`${styles.languageSwitcher} d-none d-md-block`}>
          <LanguageSwitcher variant="simple" />
        </div>
        
        <Row className="justify-content-center">
          <Col xs={12} className="text-center mb-1">
            <div className={styles.logoContainer}>
              <Image 
                src="/logo/logo.png" 
                alt="Site Logo" 
                width={110} 
                height={110} 
                className={styles.logoImage}
                priority
              />
              <h1 className={`h3 text-white ${styles.mainTitle}`}>
                {t('auth.bismillah')}
              </h1>
              <p className={`text-white small ${styles.subtitle}`}>
                {t('auth.platformWelcome')}
              </p>
            </div>
          </Col>
          
          <Col xs={12} sm={10} md={8} lg={7} xl={5} xxl={4}>
            <Card className={`border-0 ${styles.authCard}`}>
              <Card.Body className="p-3">
                <div className="text-center mb-2">
                  <h2 className={`h2 ${styles.cardTitle}`}>{t('auth.signUp')}</h2>
                  <p className={styles.cardSubtitle}>
                    {t('auth.alreadyHaveAccount')}{' '}
                    <Link href="/auth-advance/sign-in" className={styles.cardLink}>
                      {t('auth.signIn')}
                    </Link>
                  </p>
                </div>
                <SignUpForm />
              </Card.Body>
            </Card>
          </Col>
          
          {/* Language Switcher Mobile - Bottom */}
          <Col xs={12} className="d-md-none">
            <div className="text-center mt-3">
              <LanguageSwitcher variant="simple" />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;