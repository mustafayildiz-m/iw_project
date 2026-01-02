'use client';

import { Card, CardBody, CardHeader, CardTitle, Row, Col, Form, InputGroup, Button, Pagination, Spinner, Alert, Badge, Collapse } from 'react-bootstrap';
import { useState, useEffect, useCallback } from 'react';
import { BsSearch, BsArrowLeft, BsBook, BsFilter, BsGrid3X3Gap, BsList, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/useLanguageContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const BooksListPage = () => {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const languageId = searchParams.get('languageId');
  const languageName = decodeURIComponent(searchParams.get('languageName') || '');
  const languageCode = searchParams.get('languageCode');

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState(''); // Aktif arama terimi
  const [selectedCategory, setSelectedCategory] = useState(''); // Seçili kategori
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState(() => {
    // localStorage'dan görünüm modunu güvenli şekilde oku
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('booksViewMode');
        if (saved === 'grid' || saved === 'list') {
          return saved;
        }
      }
    } catch (error) {
      console.error('localStorage okuma hatası:', error);
    }
    return 'grid';
  }); // 'grid' veya 'list'
  
  const [showCategoryFilter, setShowCategoryFilter] = useState(() => {
    // localStorage'dan kategori filtre durumunu güvenli şekilde oku
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('booksCategoryFilterOpen');
        return saved === 'true';
      }
    } catch (error) {
      console.error('localStorage okuma hatası:', error);
    }
    return false;
  }); // Kategori filtresini aç/kapa
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const itemsPerPage = 12;

  // Kategorileri mevcut kitaplardan çıkar
  const extractCategoriesFromBooks = useCallback((booksData) => {
    const categorySet = new Set();
    booksData.forEach(book => {
      if (book.categories && Array.isArray(book.categories)) {
        book.categories.forEach(category => {
          if (category && category.trim()) {
            categorySet.add(category.trim());
          }
        });
      }
    });
    return Array.from(categorySet).sort();
  }, []);

  // Kitapları fetch et (server-side pagination, search ve category)
  const fetchBooks = useCallback(async (page = 1, search = '', category = '') => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error(t('books.list.pleaseLogin'));
      }

      const params = new URLSearchParams();
      if (languageId) {
        params.append('languageId', languageId);
      }
      params.append('page', page.toString());
      params.append('limit', itemsPerPage.toString());
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      
      if (category && category.trim()) {
        params.append('category', category.trim());
      }

      const response = await fetch(`${API_BASE_URL}/books?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Backend artık { data: [...], pagination: {...} } formatında dönüyor
      const data = result.data || [];
      const paginationInfo = result.pagination || {};
      
      // Backend'den gelen translations'ı transform et
      const transformedBooks = data.map(book => {
        const selectedTranslation = languageId 
          ? book.translations?.find(t => t.languageId === parseInt(languageId))
          : book.translations?.[0];
        
        const translation = selectedTranslation || book.translations?.[0];

        return {
          ...book,
          title: translation?.title || book.author || 'Başlıksız Kitap',
          description: translation?.description || '',
          summary: translation?.summary || '',
        };
      });

      setBooks(transformedBooks);
      setPagination(paginationInfo);
      
      // Kategorileri güncelle (sadece ilk sayfa için)
      if (page === 1 && !search && !category) {
        const extractedCategories = extractCategoriesFromBooks(transformedBooks);
        setCategories(extractedCategories);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }, [languageId, itemsPerPage, t]);

  // Dil değiştiğinde kitapları getir (kategoriler kitaplardan çıkarılacak)
  useEffect(() => {
    if (languageId) {
      fetchBooks(currentPage, activeSearch, selectedCategory);
    }
  }, [languageId, currentPage, activeSearch, selectedCategory, fetchBooks]);

  // Arama fonksiyonu (server-side search)
  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }
    setCurrentPage(1);
    setActiveSearch(searchQuery);
  };

  // Kategori filtreleme fonksiyonu
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Sayfa değişimi (server-side pagination)
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Server-side pagination kullanıldığı için client-side hesaplama gereksiz
  // Backend zaten sayfalanmış veriyi döndürüyor

  // Image URL helper
  const getBookImage = (book) => {
    if (book.coverImage) {
      return book.coverImage.startsWith('http') ? book.coverImage : `${API_BASE_URL}${book.coverImage}`;
    }
    if (book.coverUrl) {
      return book.coverUrl.startsWith('http') ? book.coverUrl : `${API_BASE_URL}${book.coverUrl}`;
    }
    return '/images/book-placeholder.jpg';
  };

  // Kitap detay sayfası URL'ini oluştur (dil bilgisi ile)
  const getBookDetailUrl = (bookId) => {
    const params = new URLSearchParams({
      languageId,
      languageName,
      languageCode
    });
    return `/feed/books/${bookId}?${params.toString()}`;
  };

  // Görünüm modunu localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('booksViewMode', viewMode);
      } catch (error) {
        console.error('localStorage yazma hatası:', error);
      }
    }
  }, [viewMode]);

  // Kategori filtre durumunu localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('booksCategoryFilterOpen', showCategoryFilter.toString());
      } catch (error) {
        console.error('localStorage yazma hatası:', error);
      }
    }
  }, [showCategoryFilter]);

  // languageId yoksa dil seçim sayfasına yönlendir (useEffect içinde)
  useEffect(() => {
    if (!languageId) {
      router.push('/feed/books');
    }
  }, [languageId, router]);

  if (!languageId) {
    return null;
  }

  return (
    <Col lg={9}>
      {/* Header */}
      <Card className="mb-4 border-0 shadow-sm">
        <CardHeader className="bg-gradient text-white border-0" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <Row className="align-items-center g-3">
            <Col xs={12} md={5}>
              <div className="d-flex align-items-center">
                <Link href="/feed/books">
                  <Button
                    variant="light"
                    size="sm"
                    className="me-3"
                  >
                    <BsArrowLeft className="me-1" />
                    {t('books.list.backToLanguages')}
                  </Button>
                </Link>
                <CardTitle className="mb-0 h4">
                  <BsBook className="me-2" />
                  {t(`books.languages.${languageName}`)} {t('books.list.booksTitle')}
                </CardTitle>
              </div>
            </Col>
            <Col xs={12} md={5}>
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder={t('books.list.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white"
                  />
                  <Button variant="light" type="submit">
                    <BsSearch />
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col xs={12} md={2} className="text-end">
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'light' : 'outline-light'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  title={t('books.list.gridView')}
                >
                  <BsGrid3X3Gap size={18} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'light' : 'outline-light'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  title={t('books.list.listView')}
                >
                  <BsList size={22} />
                </Button>
              </div>
            </Col>
          </Row>
        </CardHeader>
      </Card>

      {/* Category Filter - Collapsible */}
      {categories.length > 0 && (
        <Card className="mb-4 border-0 shadow-sm">
          <CardBody>
            <div
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              style={{ cursor: 'pointer' }}
              className="d-flex align-items-center justify-content-between mb-3"
            >
              <h6 className="mb-0">
                <BsFilter className="me-2" />
                {t('books.list.filterByCategory')}
                {selectedCategory && (
                  <Badge bg="primary" className="ms-2">{selectedCategory}</Badge>
                )}
              </h6>
              <div className="text-primary">
                {showCategoryFilter ? <BsChevronUp size={20} /> : <BsChevronDown size={20} />}
              </div>
            </div>
            
            <Collapse in={showCategoryFilter}>
              <div>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === '' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => handleCategoryChange('')}
                    className="mb-2"
                  >
                    {t('books.list.allCategories')}
                  </Button>
                  {categories.map((category, index) => (
                    <Button
                      key={index}
                      variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => handleCategoryChange(category)}
                      className="mb-2"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </Collapse>
          </CardBody>
        </Card>
      )}

      {/* Stats */}
      <Card className="mb-4 border-0 shadow-sm">
        <CardBody>
          <Row className="text-center">
            <Col xs={6} md={3}>
              <div className="p-3">
                <h3 className="mb-0 text-primary">{pagination.totalCount}</h3>
                <small className="text-muted">{t('books.list.totalBooks')}</small>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="p-3">
                <h3 className="mb-0 text-success">{pagination.currentPage}</h3>
                <small className="text-muted">{t('books.list.currentPage')}</small>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="p-3">
                <h3 className="mb-0 text-info">{pagination.totalPages}</h3>
                <small className="text-muted">{t('books.list.totalPages')}</small>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="p-3">
                <h3 className="mb-0 text-warning">{books.length}</h3>
                <small className="text-muted">{t('books.list.onThisPage')}</small>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">{t('books.list.loadingBooks')}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert variant="danger">
          <Alert.Heading>{t('books.list.error')}</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* No Results */}
      {!loading && !error && books.length === 0 && (
        <Alert variant="info">
          <Alert.Heading>{t('books.list.noBooks')}</Alert.Heading>
          <p>{searchQuery ? `"${searchQuery}" ${t('books.list.noSearchResults')}` : t('books.list.noLanguageBooks')}</p>
        </Alert>
      )}

      {/* Books Grid/List View */}
      {!loading && !error && books.length > 0 && (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <Row className="g-4 mb-4">
              {books.map((book) => (
                <Col key={book.id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="h-100 shadow-sm border-0 book-card" style={{
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    <div className="position-relative" style={{ paddingTop: '140%', overflow: 'hidden' }}>
                      <Image
                        src={getBookImage(book)}
                        alt={book.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-top"
                        onError={(e) => {
                          e.target.src = '/images/book-placeholder.jpg';
                        }}
                      />
                      {/* Hover overlay */}
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-0 hover-overlay" style={{
                        background: 'rgba(0,0,0,0.7)',
                        transition: 'opacity 0.3s ease'
                      }}>
                        <Link href={getBookDetailUrl(book.id)}>
                          <Button variant="light" size="sm">
                            {t('books.list.viewDetails')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <Card.Body className="p-3">
                      <Link href={getBookDetailUrl(book.id)} className="text-decoration-none">
                        <Card.Title className="text-center mb-2" style={{ 
                          fontSize: '0.95rem',
                          minHeight: '2.4em',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {book.title}
                        </Card.Title>
                      </Link>
                      
                      {book.author && (
                        <p className="text-muted small text-center mb-2" style={{
                          fontSize: '0.8rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {book.author}
                        </p>
                      )}

                      {book.categories && book.categories.length > 0 && (
                        <div className="text-center">
                          {book.categories.slice(0, 2).map((category, catIdx) => (
                            <Badge 
                              key={catIdx}
                              bg="primary"
                              className="me-1 mb-1"
                              style={{ fontSize: '0.7rem' }}
                            >
                              {category}
                            </Badge>
                          ))}
                          {book.categories.length > 2 && (
                            <Badge bg="secondary" style={{ fontSize: '0.7rem' }}>
                              +{book.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {book.translations && (
                        <div className="text-center mt-2">
                          <small className="text-muted">
                            {book.translations.length} {t('books.list.availableLanguages')}
                          </small>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="mb-4">
              {books.map((book) => (
                <Card key={book.id} className="mb-3 shadow-sm border-0 book-list-card" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <Row className="g-0">
                    <Col xs={12} md={3} lg={2}>
                      <div className="position-relative" style={{ height: '100%', minHeight: '200px' }}>
                        <Image
                          src={getBookImage(book)}
                          alt={book.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-start"
                          onError={(e) => {
                            e.target.src = '/images/book-placeholder.jpg';
                          }}
                        />
                      </div>
                    </Col>
                    <Col xs={12} md={9} lg={10}>
                      <Card.Body className="p-4">
                        <Row>
                          <Col xs={12} lg={8}>
                            <Link href={getBookDetailUrl(book.id)} className="text-decoration-none">
                              <Card.Title className="mb-2 h5" style={{ color: '#667eea' }}>
                                {book.title}
                              </Card.Title>
                            </Link>
                            
                            {book.author && (
                              <p className="text-muted mb-3">
                                <strong>{t('books.list.author')}:</strong> {book.author}
                              </p>
                            )}

                            {book.description && (
                              <p className="text-muted mb-3" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: '1.6'
                              }}>
                                {book.description}
                              </p>
                            )}

                            {book.categories && book.categories.length > 0 && (
                              <div className="mb-3">
                                <small className="text-muted me-2">
                                  <strong>{t('books.list.categories')}:</strong>
                                </small>
                                {book.categories.map((category, catIdx) => (
                                  <Badge 
                                    key={catIdx}
                                    bg="primary"
                                    className="me-1 mb-1"
                                    style={{ fontSize: '0.75rem' }}
                                  >
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {book.translations && (
                              <div className="mb-2">
                                <small className="text-muted">
                                  <BsBook className="me-1" />
                                  {book.translations.length} {t('books.list.availableLanguages')}
                                </small>
                              </div>
                            )}
                          </Col>
                          <Col xs={12} lg={4} className="d-flex flex-column justify-content-between align-items-end">
                            <div className="mb-3">
                              {book.publishYear && (
                                <Badge bg="secondary" className="mb-2">
                                  {book.publishYear}
                                </Badge>
                              )}
                            </div>
                            <Link href={getBookDetailUrl(book.id)}>
                              <Button variant="primary" size="sm">
                                {t('books.list.viewDetails')}
                              </Button>
                            </Link>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center mb-4">
              <Pagination>
                <Pagination.First 
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => handlePageChange(1)}
                />
                <Pagination.Prev 
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                
                {/* Sayfa numaraları */}
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Akıllı pagination: sadece mevcut sayfa civarındaki sayfaları göster
                  if (
                    pageNumber === 1 || 
                    pageNumber === pagination.totalPages || 
                    (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                  ) {
                    return (
                      <Pagination.Item
                        key={pageNumber}
                        active={pageNumber === currentPage}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </Pagination.Item>
                    );
                  } else if (
                    pageNumber === currentPage - 3 || 
                    pageNumber === currentPage + 3
                  ) {
                    return <Pagination.Ellipsis key={pageNumber} disabled />;
                  }
                  return null;
                })}

                <Pagination.Next 
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
                <Pagination.Last 
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(pagination.totalPages)}
                />
              </Pagination>
            </div>
          )}

          {/* Pagination Info */}
          <div className="text-center text-muted mb-4">
            <small>
              {t('books.list.showing')}: {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, pagination.totalCount)} {t('books.list.paginationInfo')} {pagination.totalCount} {t('books.list.books')}
            </small>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .book-card {
          transition: all 0.3s ease !important;
          animation: fadeIn 0.4s ease-out;
        }
        .book-card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2) !important;
        }
        .book-card .hover-overlay {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .book-card:hover .hover-overlay {
          opacity: 1 !important;
        }
        .book-list-card {
          transition: all 0.3s ease !important;
          animation: fadeIn 0.4s ease-out;
        }
        .book-list-card:hover {
          transform: translateX(5px) !important;
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.15) !important;
        }
      `}</style>
    </Col>
  );
};

export default BooksListPage;

