'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';
import { BsSearch, BsPerson, BsMortarboard, BsPeople, BsPlus, BsEye } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';
import avatar7 from '@/assets/images/avatar/07.jpg';
import { useLanguage } from '@/context/useLanguageContext';

const ScholarsPage = () => {
  const { t } = useLanguage();
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredScholars, setFilteredScholars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchScholars = async () => {
      // Don't fetch if we're in search mode
      if (isSearching) return;

      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scholars?page=${currentPage}&limit=${itemsPerPage}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();

          if (data.scholars && Array.isArray(data.scholars)) {
            setScholars(data.scholars);
            setFilteredScholars(data.scholars);
            setTotalCount(data.totalCount || 0);
            setTotalPages(data.totalPages || 1);
          }
        } else {
          setError('Alimler yüklenirken bir hata oluştu.');
        }
      } catch (error) {
        console.error('Error fetching scholars:', error);
        setError('Alimler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchScholars();
  }, [currentPage, isSearching]);

  // Debounced search effect
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        setSearchLoading(true);

        try {
          const token = localStorage.getItem('token');
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/search/scholars?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=${itemsPerPage}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            setFilteredScholars(data.scholars || []);
            setTotalCount(data.totalCount || 0);
            setTotalPages(data.totalPages || 1);
          } else {
            console.error('Search failed:', response.status);
            setFilteredScholars([]);
          }
        } catch (error) {
          console.error('Error performing search:', error);
          setFilteredScholars([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, currentPage]);

  // Update filtered scholars when scholars change and not searching
  useEffect(() => {
    if (!isSearching && !searchQuery.trim()) {
      setFilteredScholars(scholars);
    }
  }, [scholars, isSearching, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <Button
          key="first"
          variant="outline-primary"
          size="sm"
          onClick={() => handlePageChange(1)}
          className="me-1"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        items.push(<span key="ellipsis1" className="me-1">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Button
          key={i}
          variant={i === currentPage ? "primary" : "outline-primary"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="me-1"
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<span key="ellipsis2" className="me-1">...</span>);
      }
      items.push(
        <Button
          key="last"
          variant="outline-primary"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className="me-1"
        >
          {totalPages}
        </Button>
      );
    }

    return items;
  };

  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return avatar7;
    if (photoUrl.startsWith('/uploads/')) {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      return `${apiBaseUrl}${photoUrl}`;
    }
    return photoUrl;
  };

  const renderScholarCard = (scholar) => (
    <Col lg={4} md={6} sm={6} className="mb-4" key={scholar.id}>
      <Card className="h-100 shadow-sm">
        <div className="position-relative">
          <div className="d-flex justify-content-center pt-3">
            <div className="avatar avatar-lg">
              <Image
                height={80}
                width={80}
                src={getImageUrl(scholar.photoUrl)}
                alt={scholar.fullName}
                className="avatar-img rounded-circle border border-3"
                onError={(e) => {
                  e.target.src = avatar7;
                }}
              />
            </div>
          </div>
          <Badge
            bg="primary"
            className="position-absolute top-0 end-0 m-2"
            style={{ transform: 'translate(50%, -50%)' }}
          >
            <BsMortarboard className="me-1" />
            {t('scholars.scholar')}
          </Badge>
        </div>

        <CardBody className="text-center pt-2">
          <CardTitle className="h6 mb-2">
            {scholar.fullName || 'İsimsiz Alim'}
          </CardTitle>

          {scholar.biography && (
            <p className="text-muted small mb-3" style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {scholar.biography}
            </p>
          )}

          <div className="d-grid gap-2">
            {scholar.id ? (
              <Link href={`/profile/scholar/${scholar.id}`} className="btn btn-primary btn-sm">
                <BsEye className="me-1" />
                {t('scholars.viewProfile')}
              </Link>
            ) : (
              <Button variant="primary" size="sm" disabled>
                <BsEye className="me-1" />
                {t('scholars.viewProfile')}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </Col>
  );

  if (loading) {
    return (
      <div className="col-lg-9">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">{t('scholars.loadingScholars')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-9">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="mb-0 d-flex align-items-center">
            <BsMortarboard className="me-2 text-primary" />
            {t('scholars.title')}
            <Badge bg="secondary" className="ms-2">
              {totalCount} {t('scholars.totalScholars')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form.Group className="mb-3">
            <div className="input-group input-group-lg">
              <span className="input-group-text">
                {searchLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <BsSearch />
                )}
              </span>
              <Form.Control
                type="text"
                placeholder={t('scholars.searchPlaceholder')}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            {isSearching && (
              <small className="text-muted mt-1 d-block">
                "{searchQuery}" {t('whoToFollow.searchInDatabase')} {totalCount} {t('whoToFollow.resultsFound')}
              </small>
            )}
          </Form.Group>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {filteredScholars.length === 0 ? (
            <div className="text-center py-5">
              <BsMortarboard size={48} className="text-muted mb-3" />
              <h5 className="text-muted">{t('scholars.noScholarsFound')}</h5>
              <p className="text-muted">
                {searchQuery ? t('scholars.noScholarsDescription') : t('scholars.noScholarsFound')}
              </p>
            </div>
          ) : (
            <>
              <Row>
                {filteredScholars.map(renderScholarCard)}
              </Row>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="me-1"
                    >
                      {t('pagination.previous')}
                    </Button>

                    {generatePaginationItems()}

                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ms-1"
                    >
                      {t('pagination.next')}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ScholarsPage;

