'use client';

import { Collapse, Form } from 'react-bootstrap';
import AppMenu from './AppMenu';
import { useLayoutContext } from '@/context/useLayoutContext';
import { useSearchContext } from '@/context/useSearchContext';
import { useLanguage } from '@/context/useLanguageContext';
import { BsSearch } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import SearchResults from '@/components/SearchResults';

const CollapseMenu = ({
  isSearch
}) => {
  const {
    mobileMenu: {
      open
    }
  } = useLayoutContext();

  const searchContext = useSearchContext();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debug: Component render bilgisi
  // console.log('🔍 CollapseMenu render - isSearch:', isSearch);
  // console.log('🔍 CollapseMenu render - query:', query);
  // console.log('🔍 CollapseMenu render - debouncedQuery:', debouncedQuery);
  // console.log('🔍 CollapseMenu render - searchContext:', searchContext);

  // Debounce search input
  useEffect(() => {
    // console.log('🔍 Setting debounce timer for query:', query);
    const timer = setTimeout(() => {
      // console.log('🔍 Debounce timer fired, setting debouncedQuery to:', query);
      setDebouncedQuery(query);
    }, 300);

    return () => {
      // console.log('🔍 Clearing debounce timer');
      clearTimeout(timer);
    };
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    // console.log('🔍 Debounced query changed to:', debouncedQuery);
    if (debouncedQuery.trim()) {
      // console.log('🔍 Calling performSearch with:', debouncedQuery);
      // performSearch fonksiyonunu direkt çağır
      if (searchContext?.performSearch) {
        searchContext.performSearch(debouncedQuery);
      } else {
        // console.log('❌ performSearch function not available');
      }
    } else {
      // console.log('🔍 Clearing search due to empty debounced query');
      if (searchContext?.clearSearch) {
        searchContext.clearSearch();
      }
    }
  }, [debouncedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('🔍 Form submitted with query:', query);
    if (query.trim() && searchContext?.performSearch) {
      // console.log('🔍 Calling performSearch on form submit');
      searchContext.performSearch(query);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    // console.log('🔍 Input changed from:', query, 'to:', newValue);
    setQuery(newValue);
  };

  return (
    <Collapse in={open} className="navbar-collapse">
      <div>
        {isSearch && (
          <div className="nav mt-3 mt-lg-0 flex-nowrap align-items-center px-4 px-lg-0 position-relative search-container">
            <div className="nav-item w-100">
              <Form onSubmit={handleSubmit} className="rounded position-relative">
                <Form.Control
                  className="form-control ps-5 bg-light search-input"
                  type="search"
                  placeholder={t('search.placeholder')}
                  aria-label={t('search.placeholder')}
                  value={query}
                  onChange={handleInputChange}
                />
                <button 
                  className="btn bg-transparent px-2 py-0 position-absolute top-50 start-0 translate-middle-y" 
                  type="submit"
                >
                  <BsSearch className="fs-5" />
                </button>
              </Form>
              <SearchResults />
            </div>
          </div>
        )}

        <AppMenu />
      </div>
    </Collapse>
  );
};

export default CollapseMenu;