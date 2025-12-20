'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';
import avatar7 from '@/assets/images/avatar/07.jpg';
import { BsGeoAlt, BsCalendarDate, BsPerson } from 'react-icons/bs';

const ScholarLineagePage = () => {
  const params = useParams();
  const [scholar, setScholar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarData = async () => {
      try {
        const scholarId = params.id;
        if (scholarId) {
          const token = localStorage.getItem('token');
          
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
          }
        }
      } catch (error) {
        console.error('Error fetching scholar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarData();
  }, [params.id]);

  // Helper function to get proper image URL
  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return avatar7;
    if (photoUrl.startsWith('/uploads/')) {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      return `${apiBaseUrl}${photoUrl}`;
    }
    return photoUrl;
  };

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
                <p className="mt-3">Nesebi bilgileri yükleniyor...</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!scholar) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card>
              <CardBody className="text-center py-5">
                <h4>Alim Bulunamadı</h4>
                <p className="text-muted">Aradığınız alim bulunamadı veya silinmiş olabilir.</p>
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
                <div className="avatar avatar-lg mb-3">
                  <Image 
                    className="avatar-img rounded-circle border border-white border-3" 
                    src={getImageUrl(scholar.photoUrl)} 
                    alt="avatar" 
                    width={80}
                    height={80}
                    onError={(e) => {
                      e.target.src = avatar7;
                    }}
                  />
                </div>
                <h3>{scholar.fullName}</h3>
                <p className="text-muted">{scholar.lineage || 'Nesebi belirtilmemiş'}</p>
              </div>

              <div className="border-top pt-4">
                <h5 className="mb-4">Nesebi Bilgileri</h5>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <BsPerson className="me-3 text-primary" size={20} />
                      <div>
                        <strong>Tam Adı:</strong>
                        <p className="mb-0">{scholar.fullName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <BsCalendarDate className="me-3 text-primary" size={20} />
                      <div>
                        <strong>Doğum Tarihi:</strong>
                        <p className="mb-0">{scholar.birthDate || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <BsCalendarDate className="me-3 text-danger" size={20} />
                      <div>
                        <strong>Vefat Tarihi:</strong>
                        <p className="mb-0">{scholar.deathDate || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <BsGeoAlt className="me-3 text-primary" size={20} />
                      <div>
                        <strong>Doğum Yeri:</strong>
                        <p className="mb-0">{scholar.locationName || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {scholar.lineage && (
                  <div className="mt-4">
                    <h6>Detaylı Nesebi:</h6>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-0">{scholar.lineage}</p>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h6>Biyografik Bilgiler:</h6>
                  <div className="bg-light p-3 rounded">
                    {scholar.biography ? (
                      <div dangerouslySetInnerHTML={{ __html: scholar.biography }} />
                    ) : (
                      <p className="mb-0">Bu alim hakkında henüz detaylı biyografi bilgisi bulunmamaktadır.</p>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <CardBody>
              <h5>Hızlı Bilgiler</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Dönem:</strong> {scholar.birthDate && scholar.deathDate ? 
                    `${scholar.birthDate} - ${scholar.deathDate}` : 'Belirtilmemiş'}
                </li>
                <li className="mb-2">
                  <strong>Yaşam Süresi:</strong> {scholar.birthDate && scholar.deathDate ? 
                    `${parseInt(scholar.deathDate) - parseInt(scholar.birthDate)} yıl` : 'Belirtilmemiş'}
                </li>
                <li className="mb-2">
                  <strong>Bölge:</strong> {scholar.locationName ? 
                    scholar.locationName.split(',')[0] : 'Belirtilmemiş'}
                </li>
              </ul>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ScholarLineagePage;
