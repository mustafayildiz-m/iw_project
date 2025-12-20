'use client';

import { Card, Col, Row, Container } from 'react-bootstrap';
import LoginForm from './components/LoginForm';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../auth-pages.module.css';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/useLanguageContext';

const SignIn = () => {
  const { t } = useLanguage();
  
  return (
    <div className={styles.authWrapper}>
      {/* Language Switcher - Desktop: Top Right, Mobile: Bottom */}
      <div className={`${styles.languageSwitcher} d-none d-md-block`}>
        <LanguageSwitcher variant="simple" />
      </div>
      
      <div className={styles.splitLayout}>
        {/* Left Side - Login Form */}
        <div className={styles.leftPanel}>
          <Container className={styles.leftContainer}>
            <div className={styles.logoContainer}>
              <Image 
                src="/logo/logo.png" 
                alt="Site Logo" 
                width={80} 
                height={80} 
                className={styles.logoImage}
                priority
              />
            </div>
            
            <div className={styles.formContainer}>
              <h1 className={styles.welcomeTitle}>
                {t('auth.bismillah')}
              </h1>
              <p className={styles.welcomeSubtitle}>
                {t('auth.platformWelcome')}
              </p>
              
              <Card className={`border-0 ${styles.authCard}`}>
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <h2 className={`h2 ${styles.cardTitle}`}>{t('auth.signIn')}</h2>
                  </div>
                  <LoginForm />
                  <div className="text-center mt-3">
                    <p className={styles.cardSubtitle}>
                      {t('auth.dontHaveAccount')}{' '}
                      <Link href="/auth-advance/sign-up" className={styles.cardLink}>
                        {t('auth.createAccount')}
                      </Link>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </div>
            
            {/* Language Switcher Mobile - Bottom */}
            <div className="d-md-none mt-4 text-center">
              <LanguageSwitcher variant="simple" />
            </div>
          </Container>
        </div>
        
        {/* Right Side - Background Image */}
        <div className={styles.rightPanel}>
          <div className={styles.backgroundImage}></div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;