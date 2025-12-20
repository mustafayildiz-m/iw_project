'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';
import avatar7 from '@/assets/images/avatar/07.jpg';
import dynamic from 'next/dynamic';

// MapComponent'i dynamic import ile yükle (SSR hatası önlemek için)
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Harita yükleniyor...</span>
      </div>
      <p className="mt-2 text-muted">Harita yükleniyor...</p>
    </div>
  )
});

const ScholarProfilePage = () => {
  const params = useParams();
  const [scholar, setScholar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const biographyRef = useRef(null);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [showBioToggle, setShowBioToggle] = useState(false);

  useEffect(() => {
    const fetchScholarData = async () => {
      try {
        const scholarId = params.id;
        if (scholarId) {
          // JWT token'ı localStorage'dan al
          const token = localStorage.getItem('token');
          
          // API'den alim verilerini çek
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholars/${scholarId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setScholar(data);
            setError(null);
          } else if (response.status === 404) {
            setError('notfound');
          } else {
            setError('server');
            console.error('Scholar not found - Response:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Scholar error response body:', errorText);
          }
        }
      } catch (error) {
        console.error('Error fetching scholar data:', error);
        setError('network');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarData();
  }, [params.id]);

  // Helper function to get proper image URL
  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return avatar7;
    if (photoUrl.startsWith('/uploads/') || photoUrl.startsWith('uploads/')) {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      // Ensure the path starts with a slash
      const normalizedPath = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
      return `${apiBaseUrl}${normalizedPath}`;
    }
    return photoUrl;
  };

  // Measure biography to determine if toggle is needed
  useEffect(() => {
    if (!scholar) return;
    const element = biographyRef.current;
    if (!element) return;

    // Temporarily ensure collapsed styles are applied for accurate measurement
    const MAX_HEIGHT = 240; // px ~ 12-14 lines depending on font
    const needsToggle = element.scrollHeight > MAX_HEIGHT + 10; // buffer
    setShowBioToggle(needsToggle);
  }, [scholar]);



  if (loading) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card>
              <CardBody className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Alim bilgileri yükleniyor...</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error || !scholar) {
    return (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col lg={8}>
            <Card className="shadow-lg border-0">
              <CardBody className="text-center py-5">
                <div className="mb-4">
                  {error === 'notfound' ? (
                    <div style={{ fontSize: '5rem' }} className="mb-3">🔍</div>
                  ) : error === 'network' ? (
                    <div style={{ fontSize: '5rem' }} className="mb-3">📡</div>
                  ) : (
                    <div style={{ fontSize: '5rem' }} className="mb-3">⚠️</div>
                  )}
                </div>
                <h3 className="mb-3 fw-bold">
                  {error === 'notfound' ? 'Âlim Bulunamadı' : error === 'network' ? 'Bağlantı Hatası' : 'Bir Hata Oluştu'}
                </h3>
                <p className="text-muted mb-4">
                  {error === 'notfound' 
                    ? 'Aradığınız âlim profili sistemde bulunamadı. ID kontrol edip tekrar deneyebilirsiniz.' 
                    : error === 'network'
                    ? 'İnternet bağlantınızı kontrol edip sayfayı yenileyin.'
                    : 'Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin.'}
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <button 
                    className="btn btn-primary px-4"
                    onClick={() => window.history.back()}
                  >
                    ← Geri Dön
                  </button>
                  <button 
                    className="btn btn-outline-primary px-4"
                    onClick={() => window.location.reload()}
                  >
                    🔄 Yeniden Dene
                  </button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="g-4">
        <Col lg={8}>
          <Card>
            <CardBody>
              <div className="text-center mb-4">
                <div className="avatar avatar-xxl mb-3">
                  <Image 
                    className="avatar-img rounded-circle border border-white border-3" 
                    src={getImageUrl(scholar.photoUrl)} 
                    alt="avatar" 
                    width={120}
                    height={120}
                    onError={(e) => {
                      e.target.src = avatar7;
                    }}
                  />
                </div>
                <h2>{scholar.fullName}</h2>
                <p className="text-muted">{scholar.lineage || 'Nesebi belirtilmemiş'}</p>
                <div
                  className="mx-auto"
                  style={{ maxWidth: 820 }}
                >
                  <div
                    ref={biographyRef}
                    className="lead position-relative"
                    style={{
                      maxHeight: isBioExpanded ? 'none' : 240,
                      overflow: 'hidden',
                      transition: 'max-height 300ms ease',
                    }}
                    dangerouslySetInnerHTML={{ __html: scholar.biography || 'Bu alim hakkında henüz biyografi bilgisi bulunmamaktadır.' }}
                  />

                  {!isBioExpanded && showBioToggle && (
                    <div
                      aria-hidden
                      style={{
                        position: 'relative',
                        marginTop: -60,
                        height: 60,
                        pointerEvents: 'none',
                        background:
                          'linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--bs-body-bg, #fff) 60%)',
                      }}
                    />
                  )}

                  {showBioToggle && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary mt-3"
                      onClick={() => setIsBioExpanded((v) => !v)}
                    >
                      {isBioExpanded ? 'Daha az göster' : 'Devamını oku'}
                    </button>
                  )}
                </div>
              </div>

              <div className="row text-center mb-4">
                <div className="col-4">
                  <h4>{scholar.ownBooks?.length || 0}</h4>
                  <p className="text-muted">Kendi Kitapları</p>
                </div>
                <div className="col-4">
                  <h4>{scholar.relatedBooks?.length || 0}</h4>
                  <p className="text-muted">İlgili Kitaplar</p>
                </div>
                <div className="col-4">
                  <h4>{scholar.sources?.length || 0}</h4>
                  <p className="text-muted">Kaynaklar</p>
                </div>
              </div>

              <div className="border-top pt-4">
                <h5>Biyografik Bilgiler</h5>
                <ul className="list-unstyled">
                  <li><strong>Doğum Tarihi:</strong> {scholar.birthDate || 'Belirtilmemiş'}</li>
                  <li><strong>Vefat Tarihi:</strong> {scholar.deathDate || 'Belirtilmemiş'}</li>
                  <li><strong>Konum:</strong> {scholar.locationName || 'Belirtilmemiş'}</li>
                  <li><strong>Koordinatlar:</strong> {scholar.latitude && scholar.longitude ? `${scholar.latitude}, ${scholar.longitude}` : 'Belirtilmemiş'}</li>
                </ul>
                
                {/* Harita Bileşeni */}
                {scholar.latitude && scholar.longitude && (
                  <div className="mt-4">
                    <h6 className="mb-3">
                      <i className="fas fa-map-marker-alt text-primary me-2"></i>
                      Konum Haritası
                    </h6>
                    <MapComponent 
                      latitude={scholar.latitude}
                      longitude={scholar.longitude}
                      locationName={scholar.locationName}
                      title={scholar.fullName}
                    />
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <CardBody>
              <h5>Kitaplar</h5>
              {scholar.ownBooks && scholar.ownBooks.length > 0 ? (
                <ul className="list-unstyled">
                  {scholar.ownBooks.map((book, index) => (
                    <li key={book.id} className="mb-2">
                      <strong>{book.title}</strong>
                      {book.description && <p className="small text-muted mb-0">{book.description}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted small">Henüz kitap bilgisi bulunmamaktadır.</p>
              )}
              
              <hr />
              
              <h6>Kaynaklar</h6>
              {scholar.sources && scholar.sources.length > 0 ? (
                <ul className="list-unstyled">
                  {scholar.sources.map((source, index) => (
                    <li key={source.id} className="mb-1">
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="small">
                        {source.content}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted small">Henüz kaynak bilgisi bulunmamaktadır.</p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ScholarProfilePage;
