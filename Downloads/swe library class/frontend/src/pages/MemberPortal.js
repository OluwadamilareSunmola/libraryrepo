import React, { useMemo, useState } from 'react';
import { FiSearch, FiLogOut, FiBookOpen, FiCalendar, FiDollarSign, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { membersAPI, loansAPI, feesAPI, searchAPI } from '../services/api';
import './MemberPortal.css';

const MemberPortal = () => {
  const [lookupMode, setLookupMode] = useState('membershipID');
  const [lookupValue, setLookupValue] = useState('');
  const [member, setMember] = useState(null);
  const [loadingMember, setLoadingMember] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [currentLoans, setCurrentLoans] = useState([]);
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [memberFees, setMemberFees] = useState([]);
  const [feeSummary, setFeeSummary] = useState(null);
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogResults, setCatalogResults] = useState([]);
  const [searchingCatalog, setSearchingCatalog] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const quickSearchTopics = [
    { label: 'New Arrivals', query: '2023' },
    { label: 'Fiction', query: 'fiction' },
    { label: 'Mystery', query: 'mystery' },
    { label: 'Science', query: 'science' },
    { label: 'Biography', query: 'biography' },
    { label: 'Young Adult', query: 'young adult' }
  ];

  const [actionMessage, setActionMessage] = useState('');
  const [actionType, setActionType] = useState('success');

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupValue.trim()) {
      setLookupError(`Please enter your ${lookupMode === 'membershipID' ? 'Membership ID' : 'email address'}.`);
      return;
    }

    try {
      setLoadingMember(true);
      setLookupError('');
      setActionMessage('');

      const params = lookupMode === 'membershipID'
        ? { membershipID: lookupValue.trim() }
        : { email: lookupValue.trim().toLowerCase() };

      const response = await membersAPI.lookup(params);
      setMember(response.data);
      await loadMemberData(response.data.userID);
    } catch (error) {
      console.error('Member lookup failed:', error);
      setLookupError(error.response?.data?.error || 'Unable to find member record. Please double-check your information.');
      setMember(null);
    } finally {
      setLoadingMember(false);
    }
  };

  const loadMemberData = async (userID) => {
    try {
      const [loansRes, historyRes, feesRes, summaryRes] = await Promise.all([
        loansAPI.getMemberCurrentLoans(userID),
        membersAPI.getBorrowingHistory(userID),
        feesAPI.getMemberFees(userID),
        feesAPI.getMemberSummary(userID)
      ]);

      setCurrentLoans(loansRes.data || []);
      setBorrowingHistory(historyRes.data || []);
      setMemberFees(feesRes.data || []);
      setFeeSummary(summaryRes.data || null);
    } catch (error) {
      console.error('Error loading member data:', error);
      setActionMessage('Some member data could not be loaded. Please try again.');
      setActionType('error');
    }
  };

  const handleCatalogSearch = async (e, overrideTerm) => {
    if (e) {
      e.preventDefault();
    }
    const term = overrideTerm ?? catalogQuery;
    if (!term.trim()) return;
    try {
      setSearchingCatalog(true);
      const response = await searchAPI.search(term.trim(), 'books', { limit: 40 });
      setCatalogResults(response.data || []);
      if (!overrideTerm) {
        setCatalogQuery(term);
      }
    } catch (error) {
      console.error('Catalog search failed:', error);
      setActionMessage('Unable to search the catalog. Please try again later.');
      setActionType('error');
    } finally {
      setSearchingCatalog(false);
    }
  };

  const handleBorrowBook = async (bookID, title) => {
    if (!member) return;
    try {
      await loansAPI.issue({ userID: member.userID, bookID });
      setActionMessage(`Success! "${title}" has been checked out to you. Enjoy reading!`);
      setActionType('success');
      await loadMemberData(member.userID);
    } catch (error) {
      console.error('Borrow request failed:', error);
      setActionMessage(error.response?.data?.error || 'Unable to borrow this book right now.');
      setActionType('error');
    }
  };

  const handleReturnBook = async (loanID, title) => {
    try {
      await loansAPI.return(loanID);
      setActionMessage(`"${title}" has been marked as returned. Thank you!`);
      setActionType('success');
      await loadMemberData(member.userID);
    } catch (error) {
      console.error('Return failed:', error);
      setActionMessage(error.response?.data?.error || 'Unable to complete the return. Please contact the library.');
      setActionType('error');
    }
  };

  const handleRenewLoan = async (loanID, title) => {
    try {
      const response = await loansAPI.renew(loanID);
      const newDueDate = response.data?.newDueDate
        ? new Date(response.data.newDueDate).toLocaleDateString()
        : 'the new due date';
      setActionMessage(`"${title}" has been renewed. New due date: ${newDueDate}.`);
      setActionType('success');
      await loadMemberData(member.userID);
    } catch (error) {
      console.error('Renewal failed:', error);
      setActionMessage(error.response?.data?.error || 'Unable to renew this loan. Please check with the library.');
      setActionType('error');
    }
  };

  const handlePayFee = async (fineID, amount) => {
    if (!window.confirm(`Pay fee of $${amount.toFixed(2)}?`)) return;
    try {
      await feesAPI.payFee(fineID, { amount });
      setActionMessage('Thank you! Your payment was recorded successfully.');
      setActionType('success');
      await loadMemberData(member.userID);
    } catch (error) {
      console.error('Fee payment failed:', error);
      setActionMessage(error.response?.data?.error || 'Payment failed. Please try again or visit the circulation desk.');
      setActionType('error');
    }
  };

  const handleLogout = () => {
    setMember(null);
    setLookupValue('');
    setCurrentLoans([]);
    setBorrowingHistory([]);
    setMemberFees([]);
    setFeeSummary(null);
    setCatalogResults([]);
    setActionMessage('');
  };

  const renderStatCard = (label, value, IconComponent, accentClass = '') => (
    <div className={`stat-card ${accentClass}`}>
      <div className="stat-icon">
        <IconComponent />
      </div>
      <div>
        <p>{label}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );

  const filteredCatalogResults = useMemo(() => {
    if (availabilityFilter === 'all') return catalogResults;
    return catalogResults.filter(book =>
      availabilityFilter === 'available'
        ? book.availabilityStatus === 'available'
        : book.availabilityStatus !== 'available'
    );
  }, [catalogResults, availabilityFilter]);

  return (
    <div className="member-portal">
      <header className="member-hero">
        <div>
          <p className="tagline">Self-Service Library Portal</p>
          <h1>Welcome to Your Library</h1>
          <p className="subtitle">Check out books, track current loans, and manage any fees — all without needing an admin.</p>
        </div>
        {member && (
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Sign Out
          </button>
        )}
      </header>

      {!member && (
        <section className="lookup-card">
          <h2>Access Your Account</h2>
          <p className="section-text">Use your Membership ID or email to access your personal dashboard.</p>

          <form className="lookup-form" onSubmit={handleLookup}>
            <div className="lookup-mode">
              <label>
                <input
                  type="radio"
                  name="lookupMode"
                  value="membershipID"
                  checked={lookupMode === 'membershipID'}
                  onChange={() => {
                    setLookupMode('membershipID');
                    setLookupValue('');
                    setLookupError('');
                  }}
                />
                Membership ID
              </label>
              <label>
                <input
                  type="radio"
                  name="lookupMode"
                  value="email"
                  checked={lookupMode === 'email'}
                  onChange={() => {
                    setLookupMode('email');
                    setLookupValue('');
                    setLookupError('');
                  }}
                />
                Email Address
              </label>
            </div>

            <div className="form-row">
              <input
                type={lookupMode === 'email' ? 'email' : 'text'}
                placeholder={lookupMode === 'membershipID' ? 'e.g., LIB-00042' : 'you@example.com'}
                value={lookupValue}
                onChange={(e) => setLookupValue(e.target.value)}
              />
              <button type="submit" className="primary-btn" disabled={loadingMember}>
                {loadingMember ? 'Loading...' : 'Access Account'}
              </button>
            </div>
            {lookupError && <p className="error-text">{lookupError}</p>}

            <div className="demo-credentials">
              <p>Need a quick login? Use our demo account:</p>
              <div className="demo-buttons">
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setLookupMode('membershipID');
                    setLookupValue('LIB-00001');
                    setLookupError('');
                  }}
                >
                  Membership ID: LIB-00001
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => {
                    setLookupMode('email');
                    setLookupValue('demo.member@example.com');
                    setLookupError('');
                  }}
                >
                  Email: demo.member@example.com
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {member && (
        <>
          {actionMessage && (
            <div className={`action-banner ${actionType === 'error' ? 'error' : 'success'}`}>
              {actionType === 'error' ? <FiAlertCircle /> : <FiCheckCircle />}
              <span>{actionMessage}</span>
            </div>
          )}

          <section className="member-overview">
            <div className="profile-card">
              <div className="profile-header">
                <div className="avatar">
                  {member.firstName?.[0]}
                  {member.lastName?.[0]}
                </div>
                <div>
                  <h2>{member.firstName} {member.lastName}</h2>
                  <p className="membership-id">{member.membershipID}</p>
                  <span className={`status-pill ${member.status === 'approved' ? 'active' : 'inactive'}`}>
                    {member.status === 'approved' ? 'Active Member' : member.status}
                  </span>
                </div>
              </div>
              <ul className="profile-details">
                <li>
                  <strong>Email:</strong>
                  <span>{member.email}</span>
                </li>
                <li>
                  <strong>Membership Type:</strong>
                  <span>{member.membershipType || 'General'}</span>
                </li>
                <li>
                  <strong>Expiration:</strong>
                  <span>{member.membershipExpiration ? new Date(member.membershipExpiration).toLocaleDateString() : 'N/A'}</span>
                </li>
              </ul>
            </div>

            <div className="stats-grid">
              {renderStatCard('Active Loans', currentLoans.length, FiBookOpen)}
              {renderStatCard('Pending Fees', `$${feeSummary?.pendingAmount?.toFixed(2) || '0.00'}`, FiDollarSign, 'accent-gold')}
              {renderStatCard('Books Read', borrowingHistory.length, FiCheckCircle, 'accent-teal')}
              {renderStatCard('Next Due', currentLoans[0]?.dueDate ? new Date(currentLoans[0].dueDate).toLocaleDateString() : '—', FiCalendar, 'accent-indigo')}
            </div>
          </section>

          <section className="portal-section">
            <div className="section-header">
              <h2>Borrow New Books</h2>
              <p>Search the catalog and borrow instantly.</p>
            </div>
            <form className="catalog-search" onSubmit={handleCatalogSearch}>
              <div className="input-wrap">
                <FiSearch />
                <input
                  type="text"
                  value={catalogQuery}
                  onChange={(e) => setCatalogQuery(e.target.value)}
                  placeholder="Search by title, author, or ISBN"
                />
              </div>
              <button type="submit" className="primary-btn" disabled={searchingCatalog}>
                {searchingCatalog ? 'Searching...' : 'Search'}
              </button>
            </form>

            <div className="quick-searches">
              <span className="helper-text">Or explore popular shelves:</span>
              <div className="chip-row">
                {quickSearchTopics.map(topic => (
                  <button
                    key={topic.label}
                    type="button"
                    className="chip-btn"
                    onClick={() => {
                      setCatalogQuery(topic.query);
                      handleCatalogSearch(null, topic.query);
                    }}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>

            {catalogResults.length > 0 && (
              <div className="results-toolbar">
                <p>
                  Showing <strong>{filteredCatalogResults.length}</strong> of{' '}
                  <strong>{catalogResults.length}</strong> matches
                </p>
                <div className="filter-row">
                  <label>
                    Availability:
                    <select
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="available">Available Now</option>
                      <option value="unavailable">Checked Out / On Hold</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            {filteredCatalogResults.length > 0 && (
              <div className="results-grid">
                {filteredCatalogResults.map(book => (
                  <div key={book.bookID || `${book.isbn}-${book.title}`} className="book-card">
                    <h3>{book.title}</h3>
                    <p className="author">by {book.author}</p>
                    <p className="meta">
                      <span>ISBN: {book.isbn}</span>
                      {book.publicationYear && <span>• {book.publicationYear}</span>}
                      {book.genre && <span>• {book.genre}</span>}
                    </p>
                    {book.description && (
                      <p className="description-truncate">{book.description}</p>
                    )}
                    <span className={`badge ${book.availabilityStatus === 'available' ? 'available' : 'unavailable'}`}>
                      {book.availabilityStatus === 'available' ? 'Available' : book.availabilityStatus?.replace('_', ' ')}
                    </span>
                    <button
                      className="primary-btn block"
                      onClick={() => handleBorrowBook(book.bookID, book.title)}
                      disabled={book.availabilityStatus !== 'available'}
                    >
                      {book.availabilityStatus === 'available' ? 'Borrow Book' : 'Unavailable'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="portal-grid">
            <section className="portal-section">
              <div className="section-header">
                <h2>My Current Loans</h2>
                <p>Keep track of borrowed books and due dates.</p>
              </div>
              {currentLoans.length === 0 ? (
                <p className="muted-text">You have no active loans.</p>
              ) : (
                <div className="loan-list">
                  {currentLoans.map(loan => (
                    <div key={loan.loanID} className="loan-card">
                      <div>
                        <h3>{loan.title}</h3>
                        <p className="author">by {loan.author}</p>
                        <p className="due">
                          Due {new Date(loan.dueDate).toLocaleDateString()}
                          {loan.isOverdue && (
                            <span className="overdue">
                              <FiClock /> {loan.daysOverdue} days overdue
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="loan-actions">
                        <button className="secondary-btn" onClick={() => handleReturnBook(loan.loanID, loan.title)}>
                          Return Book
                        </button>
                        <button className="text-btn" onClick={() => handleRenewLoan(loan.loanID, loan.title)}>
                          Renew
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="portal-section">
              <div className="section-header">
                <h2>Fees & Payments</h2>
                <p>Settle any outstanding balances directly.</p>
              </div>
              {memberFees.length === 0 ? (
                <p className="muted-text">Great news—no fees on your account!</p>
              ) : (
                <div className="fee-list">
                  {memberFees.map(fee => (
                    <div key={fee.fineID} className="fee-card">
                      <div>
                        <h3>{fee.title || 'Library Fee'}</h3>
                        <p className="fee-meta">
                          {new Date(fee.createdAt).toLocaleDateString()}
                          {fee.status === 'paid' && <span className="paid-pill">Paid</span>}
                        </p>
                      </div>
                      <div className="fee-amount">
                        <strong>${fee.amount.toFixed(2)}</strong>
                        {fee.status === 'pending' && (
                          <button className="primary-btn small" onClick={() => handlePayFee(fee.fineID, fee.amount)}>
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <section className="portal-section">
            <div className="section-header">
              <h2>Borrowing History</h2>
              <p>A timeline of everything you’ve read.</p>
            </div>
            {borrowingHistory.length === 0 ? (
              <p className="muted-text">No history yet. Start borrowing to see your reading stats!</p>
            ) : (
              <div className="history-grid">
                {borrowingHistory.slice(0, 6).map(loan => (
                  <div key={loan.loanID} className="history-card">
                    <h3>{loan.title}</h3>
                    <p className="author">by {loan.author}</p>
                    <p className="meta">
                      Borrowed {new Date(loan.borrowDate).toLocaleDateString()}
                      {loan.returnDate && ` • Returned ${new Date(loan.returnDate).toLocaleDateString()}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default MemberPortal;

