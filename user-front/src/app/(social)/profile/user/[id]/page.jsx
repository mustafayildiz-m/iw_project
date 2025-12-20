'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardBody, Row, Col, Badge } from 'react-bootstrap';
import { BsEnvelope, BsCalendar, BsPerson, BsClock, BsGeoAlt } from 'react-icons/bs';
import { useLanguage } from '../../../../../context/useLanguageContext';

const UserProfilePage = () => {
  const params = useParams();
  const { t, locale } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = params.id;
        
        if (userId) {
          const token = localStorage.getItem('token');
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            console.error('User not found');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params.id]);

  // Tarih formatını düzenle
  const formatDate = (dateString) => {
    if (!dateString) return t('userProfile.notSpecified');
    
    try {
      const date = new Date(dateString);
      const localeMap = {
        'tr': 'tr-TR',
        'en': 'en-US',
        'ar': 'ar-SA',
        'de': 'de-DE',
        'fr': 'fr-FR',
        'ja': 'ja-JP'
      };
      return date.toLocaleDateString(localeMap[locale] || 'tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Kullanıcı adını düzenle
  const getDisplayName = (user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || t('userProfile.user');
  };

  // Rol badge'ini döndür
  const getRoleBadge = (role) => {
    const roleConfig = {
      'user': { text: t('userProfile.user'), variant: 'primary' },
      'admin': { text: t('userProfile.admin'), variant: 'danger' },
      'moderator': { text: t('userProfile.moderator'), variant: 'warning' }
    };
    
    const config = roleConfig[role] || { text: t('userProfile.user'), variant: 'primary' };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t('common.loading')}</span>
          </div>
          <p className="mt-3">{t('userProfile.loading')}</p>
        </CardBody>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <h4>{t('userProfile.notFound')}</h4>
          <p className="text-muted">{t('userProfile.notFoundDescription')}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="vstack gap-4">
      {/* Temel Bilgiler */}
      <Card>
        <CardBody>
          <h5 className="card-title mb-4">
            <BsPerson className="me-2" />
            {t('userProfile.basicInfo')}
          </h5>
          <Row className="g-3">
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <BsEnvelope className="text-muted me-3" size={18} />
                <div>
                  <small className="text-muted d-block">{t('userProfile.email')}</small>
                  <span className="fw-medium">{user.email}</span>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <BsPerson className="text-muted me-3" size={18} />
                <div>
                  <small className="text-muted d-block">{t('userProfile.username')}</small>
                  <span className="fw-medium">@{user.username}</span>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <BsGeoAlt className="text-muted me-3" size={18} />
                <div>
                  <small className="text-muted d-block">{t('userProfile.location')}</small>
                  <span className="fw-medium">{t('userProfile.notSpecified')}</span>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <BsPerson className="text-muted me-3" size={18} />
                <div>
                  <small className="text-muted d-block">{t('userProfile.role')}</small>
                  <div className="mt-1">{getRoleBadge(user.role)}</div>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Hesap Bilgileri */}
      <Card>
        <CardBody>
          <h5 className="card-title mb-4">
            <BsClock className="me-2" />
            {t('userProfile.accountInfo')}
          </h5>
          <Row className="g-3">
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <BsCalendar className="text-muted me-3" size={18} />
                <div>
                  <small className="text-muted d-block">{t('userProfile.registrationDate')}</small>
                  <span className="fw-medium">{formatDate(user.createdAt)}</span>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <BsClock className="text-muted me-3" size={18} />
                <div>
                  <small className="text-muted d-block">{t('userProfile.lastUpdate')}</small>
                  <span className="fw-medium">{formatDate(user.updatedAt)}</span>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <BsPerson className="text-muted me-3" size={18} />
                <div>
                  <small className="text-muted d-block">{t('userProfile.accountStatus')}</small>
                  <div className="mt-1">
                    <Badge bg={user.isActive ? 'success' : 'danger'}>
                      {user.isActive ? t('userProfile.active') : t('userProfile.inactive')}
                    </Badge>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Biyografi */}
      <Card>
        <CardBody>
          <h5 className="card-title mb-4">
            <BsPerson className="me-2" />
            {t('userProfile.about')}
          </h5>
          <div className="text-muted">
            <p className="mb-0">
              {t('userProfile.aboutDescription', { name: getDisplayName(user) })}
            </p>
            <p className="mt-3 mb-0">
              {user.firstName && user.lastName ? 
                t('userProfile.joinedDateWithName', { 
                  name: `${user.firstName} ${user.lastName}`, 
                  date: formatDate(user.createdAt) 
                }) : 
                t('userProfile.joinedDateActive', { date: formatDate(user.createdAt) })
              }
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserProfilePage;
