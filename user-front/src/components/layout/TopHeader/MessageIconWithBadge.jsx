'use client';

import Link from 'next/link';
import { BsChatLeftTextFill } from 'react-icons/bs';
import { useWebSocketChatContext } from '@/context/useWebSocketChatContext';
import { useMemo } from 'react';

const MessageIconWithBadge = () => {
  const { conversations } = useWebSocketChatContext();

  // Okunmamış mesaj sayısını hesapla
  const unreadCount = useMemo(() => {
    return conversations.reduce((total, conversation) => {
      return total + (conversation.unreadCount || 0);
    }, 0);
  }, [conversations]);

  return (
    <Link className="nav-link bg-light icon-md btn btn-light p-0 position-relative" href="/messaging">
      <BsChatLeftTextFill size={15} />
      
      {/* Badge - sadece okunmamış mesaj varsa göster */}
      {unreadCount > 0 && (
        <span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{
            fontSize: '0.6rem',
            minWidth: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px 6px',
            zIndex: 10
          }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default MessageIconWithBadge;
