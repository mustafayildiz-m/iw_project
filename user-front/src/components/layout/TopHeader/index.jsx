import Link from 'next/link';
import { BsChatLeftTextFill, BsGearFill } from 'react-icons/bs';
import LogoBox from '@/components/LogoBox';
import CollapseMenu from './CollapseMenu';
import MobileMenuToggle from './MobileMenuToggle';
import ProfileDropdown from './ProfileDropdown';
import StyledHeader from './StyledHeader';
import MessageIconWithBadge from './MessageIconWithBadge';
import LanguageSwitcher from '@/components/LanguageSwitcher';
const TopHeader = () => {
  return <StyledHeader>
      <div className="container position-relative d-flex align-items-center justify-content-between" style={{
        minHeight: '64px',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div className="d-flex align-items-center">
          <LogoBox />
        </div>

        <div className="d-none d-lg-flex align-items-center" style={{ flex: 1, justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <CollapseMenu isSearch />
        </div>

        <ul className="nav flex-nowrap align-items-center d-none d-lg-flex list-unstyled mb-0" style={{ gap: '0.5rem' }}>
          <li className="nav-item">
            <MessageIconWithBadge />
          </li>

          <li className="nav-item">
            <LanguageSwitcher />
          </li>

          <li className="nav-item">
            <Link className="nav-link bg-light icon-md btn btn-light p-0" href="/settings/account">
              <BsGearFill size={15} />
            </Link>
          </li>

          <ProfileDropdown />
        </ul>

        {/* Mobile navigation - hamburger menu and profile on the right side */}
        <div className="d-flex align-items-center d-lg-none" style={{ 
          gap: '0.5rem'
        }}>
          <MessageIconWithBadge />
          <LanguageSwitcher />
          <MobileMenuToggle />
          <ProfileDropdown />
        </div>
      </div>
    </StyledHeader>;
};
export default TopHeader;