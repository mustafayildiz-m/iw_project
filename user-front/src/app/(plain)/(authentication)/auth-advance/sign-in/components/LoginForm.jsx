'use client';

import Link from 'next/link';
import { Button, FormCheck } from 'react-bootstrap';
import useSignIn from './useSignIn';
import TextFormInput from '@/components/form/TextFormInput';
import PasswordFormInput from '@/components/form/PasswordFormInput';
import { useLanguage } from '@/context/useLanguageContext';

const LoginForm = () => {
  const { t } = useLanguage();
  const {
    loading,
    login,
    control
  } = useSignIn();
  return <form className="mt-2" onSubmit={login}>
      <div className="mb-2">
        <TextFormInput 
          name="email" 
          type="email" 
          placeholder={t('auth.emailPlaceholder')}
          control={control} 
          containerClassName="input-group-lg" 
        />
      </div>
      <div className="mb-2">
        {/* @ts-ignore */}
        <PasswordFormInput 
          name="password" 
          placeholder={t('auth.passwordPlaceholder')}
          control={control} 
          size="lg" 
          containerClassName="w-100" 
        />
      </div>
      <div className="mb-2 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
        <div>
          <FormCheck 
            type="checkbox" 
            label={t('auth.rememberMe')}
            id="rememberCheck"
            style={{ fontSize: '0.95rem' }}
          />
        </div>
        <Link 
          href="/auth-advance/forgot-pass"
          style={{
            color: '#0a66c2',
            fontWeight: '600',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'color 0.2s ease, text-decoration 0.2s ease',
            padding: '0.5rem 0',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#004182';
            e.target.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#0a66c2';
            e.target.style.textDecoration = 'none';
          }}
        >
          {t('auth.forgotPassword')}?
        </Link>
      </div>
      <div className="d-grid mt-2">
        <Button 
          variant="primary" 
          size="lg" 
          type="submit" 
          disabled={loading}
          style={{
            background: '#0a66c2',
            border: 'none',
            fontWeight: '600',
            padding: '0.875rem 1.5rem',
            borderRadius: '24px',
            boxShadow: 'none',
            transition: 'all 0.2s ease',
            fontSize: '1rem',
            minHeight: '52px',
            width: '100%'
          }}
          onClick={(e) => {
            // Ensure form submission
            e.stopPropagation();
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.background = '#004182';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.background = '#0a66c2';
            }
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {t('auth.loggingIn')}
            </>
          ) : (
            t('auth.signIn')
          )}
        </Button>
      </div>
    </form>;
};
export default LoginForm;