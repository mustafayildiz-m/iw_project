'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaSearch, FaUser } from 'react-icons/fa';
import { Spinner, Button } from 'react-bootstrap';
import Link from 'next/link';
import './who-to-follow.css';
import { getUserIdFromToken } from '../../../../../utils/auth';
import { useLanguage } from '@/context/useLanguageContext';

export default function WhoToFollowPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [followLoading, setFollowLoading] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Helper function to create unique key for each follower
  const getFollowerKey = (follower) => {
    return `${follower.type}-${follower.id}`;
  };

  // Fetch users with pagination
  useEffect(() => {
    const fetchData = async () => {
      if (isSearching) return; // Don't fetch if searching

      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/who-to-follow?page=${currentPage}&limit=${itemsPerPage}`,
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

          // Normalize data
          const userItems = (data.users || []).map(u => ({
            id: u.id,
            type: 'user',
            name: u.name || [u.firstName, u.lastName].filter(Boolean).join(' '),
            username: u.username,
            firstName: u.firstName,
            lastName: u.lastName,
            photoUrl: u.photoUrl,
            description: u.description || u.biography,
            isFollowing: u.isFollowing || false
          }));

          setUsers(userItems);
          setFilteredUsers(userItems);
          setTotalCount(data.totalCount || 0);
          setTotalPages(data.totalPages || 1);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, isSearching]);

  // Debounced search function
  useEffect(() => {
    if (loading) return;

    const searchTimeout = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        setSearchLoading(true);

        try {
          const token = localStorage.getItem('token');
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/who-to-follow/search?q=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${itemsPerPage}`,
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

            const userItems = (data.users || []).map(u => ({
              id: u.id,
              type: 'user',
              name: u.name || [u.firstName, u.lastName].filter(Boolean).join(' '),
              username: u.username,
              firstName: u.firstName,
              lastName: u.lastName,
              photoUrl: u.photoUrl,
              description: u.description || u.biography,
              isFollowing: u.isFollowing || false
            }));

            setFilteredUsers(userItems);
            setTotalCount(data.totalCount || 0);
            setTotalPages(data.totalPages || 1);
          } else {
            console.error('Search failed:', response.status);
            setFilteredUsers([]);
          }
        } catch (error) {
          console.error('Error performing search:', error);
          setFilteredUsers([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, currentPage, loading]);

  // Update filtered users when users change and not searching
  useEffect(() => {
    if (!isSearching && !searchTerm.trim()) {
      setFilteredUsers(users);
    }
  }, [users, isSearching, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
    if (!photoUrl) return '/profile/profile.png';
    if (photoUrl.startsWith('/uploads/')) {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      return `${apiBaseUrl}${photoUrl}`;
    }
    return photoUrl;
  };

  // Follow function
  const handleFollow = async (followerId, followerType) => {
    const followerKey = `${followerType}-${followerId}`;
    try {
      setFollowLoading(prev => ({ ...prev, [followerKey]: true }));
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken();

      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const endpoint = '/user-follow/follow';
      const requestBody = {
        follower_id: parseInt(userId),
        following_id: parseInt(followerId)
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        // Update the local state
        setUsers(prev =>
          prev.map(item =>
            item.id === followerId && item.type === followerType
              ? { ...item, isFollowing: true }
              : item
          )
        );
        setFilteredUsers(prev =>
          prev.map(item =>
            item.id === followerId && item.type === followerType
              ? { ...item, isFollowing: true }
              : item
          )
        );
      } else {
        console.error('Follow failed');
      }
    } catch (error) {
      console.error('Error following:', error);
    } finally {
      setFollowLoading(prev => ({ ...prev, [followerKey]: false }));
    }
  };

  // Unfollow function
  const handleUnfollow = async (followerId, followerType) => {
    const followerKey = `${followerType}-${followerId}`;
    try {
      setFollowLoading(prev => ({ ...prev, [followerKey]: true }));
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken();

      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const endpoint = '/user-follow/unfollow';
      const requestBody = {
        follower_id: parseInt(userId),
        following_id: parseInt(followerId)
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        // Update the local state
        setUsers(prev =>
          prev.map(item =>
            item.id === followerId && item.type === followerType
              ? { ...item, isFollowing: false }
              : item
          )
        );
        setFilteredUsers(prev =>
          prev.map(item =>
            item.id === followerId && item.type === followerType
              ? { ...item, isFollowing: false }
              : item
          )
        );
      } else {
        console.error('Unfollow failed');
      }
    } catch (error) {
      console.error('Error unfollowing:', error);
    } finally {
      setFollowLoading(prev => ({ ...prev, [followerKey]: false }));
    }
  };

  if (loading) {
    return (
      <div className="col-lg-9">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="mt-3 text-muted">{t('whoToFollow.loadingUsers')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-9">
      <div className="card who-to-follow-card">
        <div className="card-header who-to-follow-header">
          <h5 className="mb-0">
            <FaUser className="me-2" />
            {t('whoToFollow.users')}
          </h5>
          <p className="text-muted mb-0 mt-2">
            {isSearching ? (
              <>
                <FaSearch className="me-1" />
                "{searchTerm}" {t('whoToFollow.searchInDatabase')} {totalCount} {t('whoToFollow.resultsFound')}
              </>
            ) : (
              `${totalCount} ${t('whoToFollow.peopleFound')}`
            )}
          </p>
        </div>

        <div className="search-filter-section">
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="input-group search-input-group">
                <span className="input-group-text">
                  {searchLoading ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">{t('search.searching')}</span>
                    </div>
                  ) : (
                    <FaSearch />
                  )}
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('whoToFollow.searchUserPlaceholder')}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="users-grid">
          <div className="row">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={`${user.type}-${user.id}`} className="col-lg-4 col-md-6 mb-3">
                  <div className="card h-100 user-card">
                    <div className="card-body text-center">
                      <div className="user-avatar">
                        <img
                          src={getImageUrl(user.photoUrl)}
                          alt={user.name}
                          width={80}
                          height={80}
                          className="rounded-circle"
                          onError={(e) => {
                            e.target.src = '/profile/profile.png';
                          }}
                        />
                        <span className="badge user-badge bg-secondary">
                          <FaUser className="me-1" />
                          {t('whoToFollow.user')}
                        </span>
                      </div>

                      <h6 className="user-name">
                        <Link href={`/profile/${user.type || 'user'}/${user.id}`} className="text-decoration-none">
                          {user.name}
                        </Link>
                      </h6>

                      {user.username && (
                        <p className="user-username">@{user.username}</p>
                      )}

                      {user.description && (
                        <p className="user-description">
                          {user.description.replace(/<[^>]*>/g, '')}
                        </p>
                      )}

                      {user.isFollowing ? (
                        <button
                          className="btn btn-outline-danger w-100"
                          onClick={() => handleUnfollow(user.id, user.type)}
                          disabled={followLoading[getFollowerKey(user)]}
                        >
                          {followLoading[getFollowerKey(user)] ? (
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          ) : (
                            t('whoToFollow.unfollow')
                          )}
                        </button>
                      ) : (
                        <button
                          className="btn follow-button w-100"
                          onClick={() => handleFollow(user.id, user.type)}
                          disabled={followLoading[getFollowerKey(user)]}
                        >
                          {followLoading[getFollowerKey(user)] ? (
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          ) : (
                            <>
                              <FaPlus className="me-1" />
                              {t('whoToFollow.follow')}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="empty-state">
                  <FaSearch className="empty-state-icon" />
                  <h5 className="text-muted">{t('whoToFollow.noResultsTitle')}</h5>
                  <p className="text-muted">
                    {t('whoToFollow.noResultsDescription')}
                  </p>
                  <button
                    className="btn clear-filters-btn"
                    onClick={() => {
                      setSearchTerm('');
                      setIsSearching(false);
                      setCurrentPage(1);
                    }}
                  >
                    {t('whoToFollow.clearFilters')}
                  </button>
                </div>
              </div>
            )}
          </div>

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
        </div>
      </div>
    </div>
  );
}
