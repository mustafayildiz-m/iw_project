'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { Document, Page, pdfjs } from 'react-pdf';
import { BsChevronLeft, BsChevronRight, BsZoomIn, BsZoomOut, BsDownload, BsX, BsFullscreen } from 'react-icons/bs';
import { useLanguage } from '@/context/useLanguageContext';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// PDF.js worker'ı yapılandır - CORS uyumlu CDN kullan
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const PdfViewer = ({ show, onHide, pdfUrl, title }) => {
  const { t, loading: langLoading } = useLanguage();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Safe translation function with fallback
  const translate = (key, fallback) => {
    if (langLoading) return fallback;
    try {
      return t(key) || fallback;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    // Modal açıldığında sayfa numarasını sıfırla
    if (show) {
      setPageNumber(1);
      setScale(1.0);
    }
  }, [show]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber(prevPage => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prevPage => Math.min(prevPage + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size={isFullscreen ? 'xl' : 'lg'}
      fullscreen={isFullscreen}
      centered={!isFullscreen}
      className="pdf-viewer-modal"
    >
      <Modal.Header className="bg-gradient text-white border-0" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Modal.Title className="d-flex align-items-center w-100">
          <span className="flex-grow-1">{title || translate('books.pdfViewer.title', 'PDF Viewer')}</span>
          <div className="d-flex gap-2 align-items-center">
            <Button 
              variant="light" 
              size="sm" 
              onClick={toggleFullscreen}
              className="d-flex align-items-center"
            >
              <BsFullscreen />
            </Button>
            <Button 
              variant="light" 
              size="sm" 
              onClick={onHide}
              className="d-flex align-items-center"
            >
              <BsX size={24} />
            </Button>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0 bg-light" style={{ height: isFullscreen ? 'calc(100vh - 120px)' : '70vh', overflowY: 'auto' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100%' }}>
          {pdfUrl ? (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3 text-muted">{translate('books.pdfViewer.loading', 'Loading PDF...')}</p>
                </div>
              }
              error={
                <div className="text-center py-5">
                  <p className="text-danger">{translate('books.pdfViewer.error', 'Error loading PDF')}</p>
                  <Button variant="primary" onClick={downloadPdf}>
                    <BsDownload className="me-2" />
                    {translate('books.detail.downloadPdf', 'Download PDF')}
                  </Button>
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">{translate('books.pdfViewer.error', 'PDF URL not found')}</p>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between align-items-center bg-white border-top">
        {/* Sol: Zoom kontrolleri */}
        <div className="d-flex gap-2 align-items-center">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="d-flex align-items-center"
          >
            <BsZoomOut />
          </Button>
          <span className="text-muted small" style={{ minWidth: '60px', textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </span>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={zoomIn}
            disabled={scale >= 3.0}
            className="d-flex align-items-center"
          >
            <BsZoomIn />
          </Button>
        </div>

        {/* Orta: Sayfa navigasyonu */}
        <div className="d-flex gap-2 align-items-center">
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="d-flex align-items-center"
          >
            <BsChevronLeft />
          </Button>
          <span className="text-muted" style={{ minWidth: '100px', textAlign: 'center' }}>
            {translate('books.pdfViewer.page', 'Page')} {pageNumber} {translate('books.pdfViewer.of', '/')} {numPages || '...'}
          </span>
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="d-flex align-items-center"
          >
            <BsChevronRight />
          </Button>
        </div>

        {/* Sağ: İndirme butonu */}
        <div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={downloadPdf}
            className="d-flex align-items-center"
          >
            <BsDownload className="me-1" />
            {translate('books.pdfViewer.download', 'Download')}
          </Button>
        </div>
      </Modal.Footer>

      <style jsx global>{`
        /* React PDF Custom Styles */
        .react-pdf__Document {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .react-pdf__Page {
          background: white;
          margin: 20px auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
          max-width: 100%;
        }
        
        .react-pdf__Page__canvas {
          max-width: 100%;
          height: auto !important;
          display: block;
        }

        /* Modal Styles */
        .pdf-viewer-modal .modal-content {
          border: none;
          border-radius: 12px;
          overflow: hidden;
        }

        .pdf-viewer-modal .modal-header {
          padding: 1rem 1.5rem;
          border-bottom: none;
        }

        .pdf-viewer-modal .modal-footer {
          padding: 1rem 1.5rem;
          background: #f8f9fa;
        }

        .pdf-viewer-modal .modal-body::-webkit-scrollbar {
          width: 10px;
        }

        .pdf-viewer-modal .modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .pdf-viewer-modal .modal-body::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;
        }

        .pdf-viewer-modal .modal-body::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        @media (max-width: 768px) {
          .pdf-viewer-modal .modal-footer {
            flex-direction: column;
            gap: 0.75rem;
          }

          .pdf-viewer-modal .modal-footer > div {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </Modal>
  );
};

export default PdfViewer;

