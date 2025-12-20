import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Card, CardBody, CardFooter, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap';
import avatar7 from '@/assets/images/avatar/07.jpg';
import bgBannerImg from '@/assets/images/bg/01.jpg';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/context/useLanguageContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import { BsCamera, BsCheckCircleFill, BsEye, BsImage } from 'react-icons/bs';
import clsx from 'clsx';

const ProfilePanel = ({ links }) => {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const { showNotification } = useNotificationContext();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [followStats, setFollowStats] = useState({
    followersCount: 0,
    followingCount: 0
  });

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPhotoViewModal, setShowPhotoViewModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);

      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token || !session.user.id) return;

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const userData = await response.json();
            console.log('📥 ProfilePanel: Profile data fetched:', userData);
            console.log('📸 ProfilePanel: photoUrl from API:', userData.photoUrl);
            setUser(prev => ({
              ...prev,
              photoUrl: userData.photoUrl,
              firstName: userData.firstName,
              lastName: userData.lastName,
              username: userData.username,
              bio: userData.biography
            }));
            setImageLoading(true);
            setImageKey(prev => prev + 1);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    } else if (status === 'unauthenticated') {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    }
  }, [session, status]);

  useEffect(() => {
    const fetchFollowStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/following/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFollowStats({
            followersCount: data.followersCount || 0,
            followingCount: data.totalFollowingCount || 0
          });
        }
      } catch (error) {
        // Silent fail
      }
    };

    fetchFollowStats();
  }, []);

  useEffect(() => {
    const handleProfilePhotoUpdate = async () => {
      if (session?.user?.id) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setImageLoading(true);
            setImageKey(prev => prev + 1);
            setUser(prev => ({
              ...prev,
              photoUrl: userData.photoUrl
            }));
          }
        } catch (error) {
          console.error('Error updating profile photo:', error);
        }
      }
    };

    window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    return () => window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
  }, [session?.user?.id]);

  const getImageUrl = (photoUrl, bustCache = false) => {
    console.log('🖼️ ProfilePanel getImageUrl called with photoUrl:', photoUrl, 'bustCache:', bustCache);
    
    // If photoUrl is null, undefined, or empty, return default avatar
    if (!photoUrl || photoUrl === 'null' || photoUrl === 'undefined' || photoUrl === '') {
      console.log('⚠️ ProfilePanel: No photoUrl, returning default avatar');
      return typeof avatar7 === 'string' ? avatar7 : avatar7.src || avatar7;
    }
    
    // If photoUrl is an object (imported image), return it directly
    if (typeof photoUrl === 'object' && photoUrl.src) {
      console.log('📦 ProfilePanel: photoUrl is an object, returning directly:', photoUrl);
      return photoUrl;
    }
    
    // If photoUrl is not a string, return default avatar
    if (typeof photoUrl !== 'string') {
      console.log('⚠️ ProfilePanel: photoUrl is not a string, returning default avatar');
      return typeof avatar7 === 'string' ? avatar7 : avatar7.src || avatar7;
    }
    
    // Trim whitespace
    photoUrl = photoUrl.trim();
    
    // If it starts with /uploads/, add API base URL
    if (photoUrl.startsWith('/uploads/')) {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      // Remove trailing slash from API base URL if present
      const cleanApiBaseUrl = apiBaseUrl.replace(/\/$/, '');
      const url = `${cleanApiBaseUrl}${photoUrl}`;
      const finalUrl = bustCache ? `${url}?t=${Date.now()}` : url;
      console.log('✅ ProfilePanel: Generated URL for /uploads/ path:', finalUrl);
      return finalUrl;
    }
    
    // If it starts with uploads/ (without leading slash), add API base URL and leading slash
    if (photoUrl.startsWith('uploads/')) {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const cleanApiBaseUrl = apiBaseUrl.replace(/\/$/, '');
      const url = `${cleanApiBaseUrl}/${photoUrl}`;
      const finalUrl = bustCache ? `${url}?t=${Date.now()}` : url;
      console.log('✅ ProfilePanel: Generated URL for uploads/ path:', finalUrl);
      return finalUrl;
    }
    
    // If it's already a full URL, add cache busting if needed
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      if (bustCache) {
        const separator = photoUrl.includes('?') ? '&' : '?';
        return `${photoUrl}${separator}t=${Date.now()}`;
      }
      return photoUrl;
    }
    
    // For any other case, try to construct URL with API base URL
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const cleanApiBaseUrl = apiBaseUrl.replace(/\/$/, '');
    const url = photoUrl.startsWith('/') ? `${cleanApiBaseUrl}${photoUrl}` : `${cleanApiBaseUrl}/${photoUrl}`;
    const finalUrl = bustCache ? `${url}?t=${Date.now()}` : url;
    console.log('✅ ProfilePanel: Generated URL for other path:', finalUrl);
    return finalUrl;
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showNotification({
          title: 'Hata',
          message: 'Dosya boyutu 10MB\'dan büyük olamaz',
          variant: 'danger'
        });
        return;
      }

      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedPhoto || !user?.id) return;

    setUploadingPhoto(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('photo', selectedPhoto);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/photo`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        const updatedUser = await response.json();

        setUser(prev => ({
          ...prev,
          photoUrl: updatedUser.photoUrl
        }));

        showNotification({
          title: 'Başarılı',
          message: 'Profil resminiz güncellendi',
          variant: 'success'
        });

        setShowPhotoModal(false);
        setSelectedPhoto(null);
        setPhotoPreview(null);

        window.dispatchEvent(new Event('profilePhotoUpdated'));
      } else {
        throw new Error('Profil resmi güncellenemedi');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      showNotification({
        title: 'Hata',
        message: 'Profil resmi yüklenirken bir hata oluştu',
        variant: 'danger'
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
      }}>
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="text-muted mt-3 mb-0">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
      }}>
        {/* Cover Image */}
        <div style={{
          height: '80px',
          backgroundImage: `url(${bgBannerImg.src})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }} />

        {/* Profile Content */}
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <div className="text-center">
            {/* Avatar */}
            <div className="position-relative d-inline-block" style={{ marginTop: '-50px' }}>
              <div
                className="position-relative"
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                style={{ cursor: 'pointer' }}
              >
                {imageLoading && (
                  <div
                    className="position-absolute top-0 start-0 rounded-circle border border-white d-flex align-items-center justify-content-center"
                    style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: '#e9ecef',
                      zIndex: 2,
                      borderWidth: '4px !important'
                    }}
                  >
                    <div className="spinner-border spinner-border-sm text-success" role="status">
                      <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                  </div>
                )}
                <img
                  src={getImageUrl(user?.photoUrl, true)}
                  alt="avatar"
                  className="rounded-circle border border-white"
                  key={imageKey}
                  style={{
                    width: '100px',
                    height: '100px',
                    transition: 'all 0.3s ease',
                    opacity: imageLoading ? 0 : 1,
                    borderWidth: '4px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    objectFit: 'cover'
                  }}
                  onLoad={() => {
                    console.log('✅ ProfilePanel: Image loaded successfully');
                    setImageLoading(false);
                  }}
                  onError={(e) => {
                    console.error('❌ ProfilePanel: Image failed to load:', e.target.src);
                    console.error('❌ ProfilePanel: Error event:', e);
                    e.target.src = typeof avatar7 === 'string' ? avatar7 : avatar7.src || avatar7;
                    setImageLoading(false);
                  }}
                />
                <div
                  className="position-absolute rounded-circle d-flex align-items-center justify-content-center border border-white"
                  style={{
                    width: '32px',
                    height: '32px',
                    bottom: '5px',
                    right: '5px',
                    background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)',
                    boxShadow: '0 2px 8px rgba(102, 187, 106, 0.3)'
                  }}
                >
                  <BsCamera className="text-white" size={16} />
                </div>
              </div>

              {/* Dropdown Menu */}
              {showAvatarMenu && (
                <>
                  <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ zIndex: 1040 }}
                    onClick={() => setShowAvatarMenu(false)}
                  />
                  <div
                    className="bg-white rounded-3 shadow-lg border"
                    style={{
                      position: 'absolute',
                      zIndex: 1050,
                      top: 'calc(100% + 10px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '200px',
                      padding: '0.5rem 0',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      className="w-100 d-flex align-items-center py-2 px-3 bg-transparent border-0 text-start"
                      onClick={() => {
                        setShowAvatarMenu(false);
                        setShowPhotoViewModal(true);
                      }}
                      style={{ transition: 'background-color 0.2s', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <BsEye size={18} className="me-2 text-primary flex-shrink-0" />
                      <span>Profil resmini gör</span>
                    </button>
                    <button
                      className="w-100 d-flex align-items-center py-2 px-3 bg-transparent border-0 text-start"
                      onClick={() => {
                        setShowAvatarMenu(false);
                        setShowPhotoModal(true);
                      }}
                      style={{ transition: 'background-color 0.2s', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <BsImage size={18} className="me-2 text-success flex-shrink-0" />
                      <span>Profil resmi seç</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* User Info */}
            <h5 className="mb-1 mt-3 fw-bold">
              {user?.id && user?.id !== 'undefined' ? (
                <Link href={`/profile/user/${user.id}`} className="text-decoration-none text-dark">
                  {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || t('profile.user')}
                </Link>
              ) : (
                <span className="text-dark">
                  {user ? (user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || t('profile.user')) : t('profile.user')}
                </span>
              )}
            </h5>
            <small className="text-muted">@{user?.username || user?.email || t('profile.user')}</small>

            {user?.bio && (
              <p className="mt-2 mb-2 text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                {user.bio}
              </p>
            )}

            {/* Stats */}
            <div className="d-flex gap-3 justify-content-center mt-2 mb-2">
              <Link href="/feed/followers" className="text-decoration-none">
                <div className="text-center">
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '0.95rem' }}>{followStats.followersCount}</h6>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>{t('profile.followers')}</small>
                </div>
              </Link>
              <div className="vr" />
              <Link href="/feed/following" className="text-decoration-none">
                <div className="text-center">
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '0.95rem' }}>{followStats.followingCount}</h6>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>{t('profile.following')}</small>
                </div>
              </Link>
            </div>
          </div>

          <hr style={{ margin: '0.75rem 0', opacity: 0.1 }} />

          {/* Navigation Links */}
          <ul className="nav flex-column" style={{ gap: '0.125rem', padding: 0, margin: 0, listStyle: 'none' }}>
            {links.map((item, idx) => (
              <li key={item.nameKey + idx}>
                <Link
                  className="d-flex align-items-center text-decoration-none"
                  href={item.link}
                  style={{
                    padding: '0.5rem 0.875rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    background: (pathname === item.link || (item.link !== '/' && pathname?.startsWith(item.link)))
                      ? 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)'
                      : 'transparent',
                    color: (pathname === item.link || (item.link !== '/' && pathname?.startsWith(item.link)))
                      ? 'white'
                      : '#2C3E50',
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!(pathname === item.link || (item.link !== '/' && pathname?.startsWith(item.link)))) {
                      e.currentTarget.style.background = 'rgba(129, 199, 132, 0.08)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(pathname === item.link || (item.link !== '/' && pathname?.startsWith(item.link)))) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <Image
                    src={item.image}
                    alt="icon"
                    height={18}
                    width={18}
                    className="me-2"
                    style={{
                      filter: (pathname === item.link || (item.link !== '/' && pathname?.startsWith(item.link)))
                        ? 'brightness(0) invert(1)'
                        : 'none'
                    }}
                  />
                  <span>{t(item.nameKey)}</span>
                </Link>
              </li>
            ))}
          </ul>

          <hr style={{ margin: '0.75rem 0', opacity: 0.1 }} />

          {/* View Profile Button */}
          <div>
            <Link
              href={user?.id && user?.id !== 'undefined' ? `/profile/user/${user.id}/feed` : '/profile/feed'}
              className="d-block text-center text-decoration-none"
              style={{
                padding: '0.5rem',
                color: '#66BB6A',
                fontWeight: 500,
                fontSize: '0.875rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4CAF50'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#66BB6A'}
            >
              {t('profile.viewProfile')}
            </Link>
          </div>
        </div>
      </div>

      {/* Profil Resmini Görüntüleme Modalı */}
      <Modal
        show={showPhotoViewModal}
        onHide={() => setShowPhotoViewModal(false)}
        centered
        size="lg"
        className="modern-modal"
      >
        <div className="modal-content border-0 shadow-lg bg-dark">
          <ModalHeader closeButton className="border-0 bg-dark text-white">
            <h5 className="modal-title mb-0 fw-bold">Profil Resmi</h5>
          </ModalHeader>
          <ModalBody className="p-4 bg-dark">
            <div className="text-center">
              <img
                src={getImageUrl(user?.photoUrl)}
                alt="Profile"
                className="rounded-3 w-100"
                style={{ maxHeight: '500px', objectFit: 'contain', width: '100%' }}
                onError={(e) => { 
                  e.target.src = typeof avatar7 === 'string' ? avatar7 : avatar7.src || avatar7; 
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter className="border-0 bg-dark">
            <button
              type="button"
              className="btn btn-light w-100"
              onClick={() => setShowPhotoViewModal(false)}
            >
              Kapat
            </button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Profil Resmi Güncelleme Modalı */}
      <Modal
        show={showPhotoModal}
        onHide={() => {
          setShowPhotoModal(false);
          setSelectedPhoto(null);
          setPhotoPreview(null);
        }}
        centered
        className="modern-modal"
      >
        <div className="modal-content border-0 shadow-lg">
          <ModalHeader closeButton className="border-0 pb-0">
            <div className="d-flex align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{
                width: '48px',
                height: '48px',
                background: 'rgba(129, 199, 132, 0.1)'
              }}>
                <BsCamera size={20} className="text-success" />
              </div>
              <div>
                <h5 className="modal-title mb-0 fw-bold">Profil Resmini Güncelle</h5>
                <small className="text-muted">Yeni profil resmi seç</small>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="pt-2">
            <div className="text-center mb-4">
              <img
                className="rounded-circle border border-3 border-light shadow"
                src={photoPreview || getImageUrl(user?.photoUrl)}
                alt="Preview"
                width={120}
                height={120}
                style={{ objectFit: 'cover' }}
                onError={(e) => { 
                  e.target.src = typeof avatar7 === 'string' ? avatar7 : avatar7.src || avatar7; 
                }}
              />
            </div>

            <div className="p-4 rounded-3 bg-light border border-2 border-dashed position-relative">
              <label
                htmlFor="profile-photo-upload-panel"
                className="d-block text-center mb-0"
                style={{ cursor: 'pointer' }}
              >
                <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{
                  width: '64px',
                  height: '64px',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <BsCamera size={28} className="text-success" />
                </div>
                <h6 className="fw-bold mb-2">Fotoğraf Seç</h6>
                <small className="text-muted d-block mb-2">
                  Maksimum dosya boyutu: 10MB
                </small>
                <small className="text-muted">
                  Desteklenen formatlar: JPG, PNG, GIF, WebP
                </small>
                <input
                  id="profile-photo-upload-panel"
                  type="file"
                  className="d-none"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                />
              </label>
            </div>

            {selectedPhoto && (
              <div className="mt-3 p-3 rounded-3" style={{ background: 'rgba(129, 199, 132, 0.1)' }}>
                <div className="d-flex align-items-center">
                  <BsCheckCircleFill className="text-success me-2" size={20} />
                  <div className="flex-grow-1">
                    <h6 className="mb-0 text-success">{selectedPhoto.name}</h6>
                    <small className="text-muted">
                      {(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB
                    </small>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="border-0 pt-0">
            <div className="d-flex w-100 gap-2">
              <button
                type="button"
                className="btn btn-light flex-grow-1 py-2"
                onClick={() => {
                  setShowPhotoModal(false);
                  setSelectedPhoto(null);
                  setPhotoPreview(null);
                }}
                disabled={uploadingPhoto}
              >
                İptal
              </button>
              <button
                type="button"
                className="btn btn-success flex-grow-1 py-2"
                onClick={handlePhotoUpload}
                disabled={!selectedPhoto || uploadingPhoto}
              >
                {uploadingPhoto ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Yükleniyor...
                  </>
                ) : (
                  'Kaydet'
                )}
              </button>
            </div>
          </ModalFooter>
        </div>
      </Modal>
    </>
  );
};

export default ProfilePanel;