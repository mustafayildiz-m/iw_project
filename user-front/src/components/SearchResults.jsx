'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchContext } from '@/context/useSearchContext';
import { useLanguage } from '@/context/useLanguageContext';
import Link from 'next/link';
import Image from 'next/image';

// Tab configuration (labels will be translated in component)
const TABS = [
  { id: 'all', labelKey: 'search.all', icon: '🔍' },
  { id: 'users', labelKey: 'search.users', icon: '👤' },
  { id: 'scholars', labelKey: 'search.scholars', icon: '🎓' },
  { id: 'followers', labelKey: 'search.followers', icon: '👥' }
];

const SearchResults = () => {
  const {
    searchQuery,
    searchResults,
    isSearching,
    showResults,
    clearSearch,
    performSearch
  } = useSearchContext();

  const { t, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const resultsRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mobile form submit
  const handleMobileSubmit = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('mobileSearch') || '';
    if (query.trim() && performSearch) {
      performSearch(query);
    }
  }, [performSearch]);

  // Handle mobile input change
  const handleMobileInputChange = useCallback((e) => {
    const query = e.target.value;
    if (query.trim() && performSearch) {
      performSearch(query);
    } else if (!query.trim()) {
      clearSearch();
    }
  }, [performSearch, clearSearch]);

  // Close on outside click
  useEffect(() => {
    if (!showResults) return;

    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        clearSearch();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        clearSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showResults, clearSearch]);

  // Total results count
  const totalResults = useMemo(() =>
    searchResults.users.length +
    searchResults.scholars.length +
    searchResults.followers.length,
    [searchResults]
  );

  // Get tab count
  const getTabCount = useCallback((tabId) => {
    switch (tabId) {
      case 'users': return searchResults.users.length;
      case 'scholars': return searchResults.scholars.length;
      case 'followers': return searchResults.followers.length;
      default: return totalResults;
    }
  }, [searchResults, totalResults]);

  // Render user item
  const renderUserItem = useCallback((user) => (
    user.id && user.id !== 'undefined' ? (
      <Link
        key={user.id}
        href={`/profile/user/${user.id}`}
        className="d-block text-decoration-none"
        onClick={() => clearSearch()}
      >
        <div
          className="d-flex align-items-start p-3 border-bottom search-result-item"
          style={{ transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bs-gray-100)';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <div className="flex-shrink-0 me-3">
            <div
              className="position-relative"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #e9ecef'
              }}
            >
              <Image
                src={user.profilePicture || '/profile/profile.png'}
                alt={user.name}
                width={48}
                height={48}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="flex-grow-1 min-width-0">
            <div className="d-flex align-items-center mb-1">
              <h6 className="mb-0 text-body fw-semibold text-truncate">
                {user.name}
              </h6>
            </div>
            <div className="text-muted small mb-1">@{user.username}</div>
            {user.bio && (
              <p className="mb-0 small text-muted text-truncate" style={{ maxWidth: '300px' }}>
                {user.bio}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 ms-2">
            <svg width="16" height="16" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
            </svg>
          </div>
        </div>
      </Link>
    ) : null
  ), [clearSearch]);

  // Render scholar item
  const renderScholarItem = useCallback((scholar) => (
    scholar.id && scholar.id !== 'undefined' ? (
      <Link
        key={scholar.id}
        href={`/profile/scholar/${scholar.id}`}
        className="d-block text-decoration-none"
        onClick={() => clearSearch()}
      >
        <div
          className="d-flex align-items-start p-3 border-bottom search-result-item"
          style={{ transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bs-gray-100)';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <div className="flex-shrink-0 me-3">
            <div
              className="position-relative"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #198754'
              }}
            >
              <Image
                src={scholar.profilePicture || '/profile/profile.png'}
                alt={scholar.name}
                width={48}
                height={48}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="flex-grow-1 min-width-0">
            <div className="d-flex align-items-center mb-1">
              <h6 className="mb-0 text-body fw-semibold me-2">
                {scholar.name}
              </h6>
              <span className="badge bg-success small">{t('search.scholar')}</span>
            </div>
            <div className="text-muted small mb-1">@{scholar.username}</div>
            {scholar.lineage && (
              <div className="small text-muted mb-1">
                <strong>Neseb:</strong> {scholar.lineage}
              </div>
            )}
            {scholar.birthDate && scholar.deathDate && (
              <div className="small text-muted">
                {scholar.birthDate} - {scholar.deathDate}
              </div>
            )}
          </div>
          <div className="flex-shrink-0 ms-2">
            <svg width="16" height="16" fill="currentColor" className="text-success" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
            </svg>
          </div>
        </div>
      </Link>
    ) : null
  ), [clearSearch, t]);

  // Render follower item
  const renderFollowerItem = useCallback((follower) => (
    follower.id && follower.id !== 'undefined' ? (
      <Link
        key={follower.id}
        href={`/profile/user/${follower.id}`}
        className="d-block text-decoration-none"
        onClick={() => clearSearch()}
      >
        <div
          className="d-flex align-items-start p-3 border-bottom search-result-item"
          style={{ transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bs-gray-100)';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <div className="flex-shrink-0 me-3">
            <div
              className="position-relative"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #0dcaf0'
              }}
            >
              <Image
                src={follower.profilePicture || '/profile/profile.png'}
                alt={follower.name}
                width={48}
                height={48}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="flex-grow-1 min-width-0">
            <div className="d-flex align-items-center mb-1">
              <h6 className="mb-0 text-body fw-semibold me-2">
                {follower.name}
              </h6>
              <span className="badge bg-info small">Takipçi</span>
            </div>
            <div className="text-muted small mb-1">@{follower.username}</div>
            {follower.bio && (
              <p className="mb-0 small text-muted text-truncate" style={{ maxWidth: '300px' }}>
                {follower.bio}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 ms-2">
            <svg width="16" height="16" fill="currentColor" className="text-info" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
            </svg>
          </div>
        </div>
      </Link>
    ) : null
  ), [clearSearch]);

  // Don't render if not showing
  if (!showResults) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: 0.5,
            zIndex: 1049,
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={clearSearch}
        />
      )}

      {/* Results container */}
      <div
        ref={resultsRef}
        className={`${isMobile ? 'position-fixed' : 'position-absolute'}`}
        style={{
          ...(isMobile ? {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bs-body-bg)'
          } : {
            top: 'calc(100% + 8px)',
            ...(isRTL ? { right: 0 } : { left: 0 }),
            zIndex: 1050,
            minWidth: '500px',
            maxWidth: '800px',
            width: '650px',
            animation: 'slideDown 0.2s ease-out'
          })
        }}
      >
        <div className={`bg-body ${!isMobile && 'rounded-3 shadow-lg border'}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* Mobile Search Header - Only show on mobile */}
          {isMobile && (
            <div className="p-3 border-bottom bg-body sticky-top">
              <form onSubmit={handleMobileSubmit}>
                <div className="d-flex align-items-center gap-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-light rounded-circle p-2 flex-shrink-0"
                    onClick={clearSearch}
                    aria-label="Geri"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                  </button>

                  <div className="flex-grow-1 position-relative">
                    <input
                      ref={mobileInputRef}
                      name="mobileSearch"
                      type="text"
                      className="form-control form-control-sm"
                      placeholder={t('search.searchPlaceholder')}
                      value={searchQuery}
                      onChange={handleMobileInputChange}
                      style={{
                        ...(isRTL ? { paddingRight: '40px' } : { paddingLeft: '40px' }),
                        borderRadius: '20px',
                        border: '1px solid #dee2e6',
                        fontSize: '14px'
                      }}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="position-absolute top-50 translate-middle-y bg-transparent border-0 text-muted"
                      style={isRTL ? { right: '12px' } : { left: '12px' }}
                      aria-label={t('search.placeholder')}
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                      </svg>
                    </button>

                    {/* Clear button */}
                    {searchQuery && (
                      <button
                        type="button"
                        className="position-absolute top-50 translate-middle-y bg-transparent border-0 text-muted"
                        style={isRTL ? { left: '12px' } : { right: '12px' }}
                        onClick={clearSearch}
                        aria-label="Temizle"
                      >
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Header - Desktop or Mobile Results Count */}
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <div className="d-flex align-items-center">
              {isSearching ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm text-primary me-2"
                    role="status"
                    style={{ width: '16px', height: '16px' }}
                  >
                    <span className="visually-hidden">{t('search.searching')}</span>
                  </div>
                  <span className="small text-muted">{t('search.searching')}</span>
                </>
              ) : (
                <span className="fw-semibold text-body">
                  {totalResults} {t('search.results')}
                </span>
              )}
            </div>
            {/* Desktop close button */}
            {!isMobile && (
              <button
                className="btn btn-sm btn-light rounded-circle p-2"
                onClick={clearSearch}
                aria-label="Kapat"
                style={{ width: '32px', height: '32px' }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div
            className={`d-flex border-bottom ${isMobile ? 'justify-content-around' : ''} overflow-x-auto`}
            style={{
              scrollbarWidth: 'thin',
              WebkitOverflowScrolling: 'touch',
              gap: isMobile ? '2px' : '0'
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`btn btn-sm flex-shrink-0 border-0 rounded-0 ${activeTab === tab.id ? 'btn-primary' : 'btn-light'
                  }`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: isMobile ? '10px 12px' : '12px 20px',
                  fontSize: isMobile ? '12px' : '14px',
                  borderBottom: activeTab === tab.id ? '2px solid #0d6efd' : 'none',
                  transition: 'all 0.2s ease',
                  minWidth: isMobile ? 'auto' : 'fit-content',
                  whiteSpace: 'nowrap',
                  flex: isMobile ? '1' : 'initial'
                }}
              >
                <span style={{ fontSize: isMobile ? '14px' : '16px' }} className={isRTL ? (isMobile ? 'ms-1' : 'ms-2') : (isMobile ? 'me-1' : 'me-2')}>{tab.icon}</span>
                <span className={isMobile ? 'd-none d-sm-inline' : ''}>{t(tab.labelKey)}</span>
                {/* Mobile: Show only first word or short version */}
                {isMobile && <span className="d-sm-none" style={{ fontSize: '11px' }}>{t(tab.labelKey).split(' ')[0]}</span>}
                {tab.id !== 'all' && (
                  <span className={`badge ${activeTab === tab.id ? 'bg-light text-primary' : 'bg-secondary'} ${isRTL ? 'me-1' : 'ms-1'}`} style={{ fontSize: isMobile ? '9px' : '11px', padding: isMobile ? '2px 6px' : '4px 8px' }}>
                    {getTabCount(tab.id)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Results */}
          <div
            className="flex-grow-1 overflow-auto"
            style={{
              maxHeight: isMobile ? 'none' : '500px',
              scrollbarWidth: 'thin'
            }}
          >
            {activeTab === 'all' && (
              <>
                {searchResults.users.length > 0 && (
                  <>
                    <div className="p-2 bg-body-secondary sticky-top">
                      <small className="text-muted fw-semibold">👤 {t('search.users')}</small>
                    </div>
                    {searchResults.users.slice(0, 3).map(renderUserItem)}
                  </>
                )}

                {searchResults.scholars.length > 0 && (
                  <>
                    <div className="p-2 bg-body-secondary sticky-top">
                      <small className="text-muted fw-semibold">🎓 {t('search.scholars')}</small>
                    </div>
                    {searchResults.scholars.slice(0, 3).map(renderScholarItem)}
                  </>
                )}

                {searchResults.followers.length > 0 && (
                  <>
                    <div className="p-2 bg-body-secondary sticky-top">
                      <small className="text-muted fw-semibold">👥 {t('search.followers')}</small>
                    </div>
                    {searchResults.followers.slice(0, 3).map(renderFollowerItem)}
                  </>
                )}
              </>
            )}

            {activeTab === 'users' && searchResults.users.map(renderUserItem)}
            {activeTab === 'scholars' && searchResults.scholars.map(renderScholarItem)}
            {activeTab === 'followers' && searchResults.followers.map(renderFollowerItem)}

            {totalResults === 0 && !isSearching && (
              <div className="text-center p-5">
                <div className="mb-3" style={{ fontSize: '48px' }}>🔍</div>
                <p className="text-muted mb-0">{t('search.noResults')}</p>
                <small className="text-muted">{t('search.noResultsDescription')}</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.5;
          }
        }

        .min-width-0 {
          min-width: 0;
        }

        .overflow-x-auto::-webkit-scrollbar {
          height: 4px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 2px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .overflow-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .overflow-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  );
};

export default SearchResults;