import { useEffect, useRef, useState } from "react";
import "./Search.css"; // Import CSS
import searchData from './searchData.json'

export default function Search() {
  const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All"); // default tab
    const [filteredResults,setFilteredResults] = useState([]);
    const [people,setPeople] = useState([]);
    const [files,setFiles]  = useState([]);

    const inputRef = useRef(null);

    // settings dropdown and enabled tabs
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [enabledTabs, setEnabledTabs] = useState({
        people: true,
        files: true,
        chats: false,
        lists: false,
    });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  useEffect(() => {
    if(activeTab === "All") {
          const results = searchData.results.filter((item) =>item.name.toLowerCase().includes(query.toLowerCase()))
            setFilteredResults(results)
    } else if(activeTab === "people") {
        const persons = searchData.results.filter((item) =>item.name.toLowerCase().includes(query.toLowerCase())).filter((item) => item.type === "person");
        setPeople(persons)
    } else if(activeTab === "files") {
        const files = searchData.results.filter((item) =>item.name.toLowerCase().includes(query.toLowerCase())).filter((item) => item.type === "file");
        setFiles(files)
    }
  },[query,activeTab])
  

  const hasResults = query && filteredResults.length > 0;
  console.log("results",filteredResults)

  // Group results by type
  const people_count = filteredResults.filter((item) => item.type === "person");
  const files_count = filteredResults.filter((item) => item.type === "file");

  const getStatusColor = (status) => {
    if (!status) return '#ccc';
    const lower = status.toLowerCase();
    if (lower.includes('unactivated')) return '#E03131';
    if (lower.includes('now')) return '#2F9E44';
    return '#E3A008';
  };

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ').filter(Boolean);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
  };

  const highlight = (text, q) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + q.length);
    const after = text.slice(idx + q.length);
    return (
      <>
        {before}
        <span className="hl">{match}</span>
        {after}
      </>
    );
  };

  const [copiedItemId, setCopiedItemId] = useState(null);

  const copyLink = (item) => {
    const link = `https://example.com/${item.type}/${item.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedItemId(item.id);
      // Hide notification after 2 seconds
      setTimeout(() => {
        setCopiedItemId(null);
      }, 2000);
    });
  };

  const ItemRow = ({ item }) => {
    if (item.type === 'person') {
      return (
        <div className="result-item">
          <div className="item-left avatar">
            <div className="avatar-circle">{getInitials(item.name)}</div>
          </div>
          <div className="item-center">
            <div className="item-title">{highlight(item.name, query)}</div>
            <div className="item-subtitle">
              <span className="status-dot" style={{ backgroundColor: getStatusColor(item.status) }}></span>
              {item.status || '—'}
            </div>
          </div>
          <div className="item-right">
            <button className="link-btn" onClick={() => copyLink(item)} title="Copy link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="new-tab-btn" title="New Tab">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="15,3 21,3 21,9" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="10" y1="14" x2="21" y2="3" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>New Tab</span>
            </button>
            {copiedItemId === item.id && (
              <div className="link-copied-notification">
                Link Copied
              </div>
            )}
          </div>
        </div>
      );
    }
    if (item.type === 'file') {
      return (
        <div className="result-item">
          <div className="item-left icon-square">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#6C6C6C" d="M1 2.25A2.25 2.25 0 013.25 0h4.793c.331 0 .65.132.884.366l3.207 3.207c.076.076.141.161.195.253a.75.75 0 01.201.144l2.104 2.103c.234.235.366.553.366.884v6.793A2.25 2.25 0 0112.75 16h-7A2.75 2.75 0 013 13.25V13H2.75A1.75 1.75 0 011 11.25v-9z"/></svg>
          </div>
          <div className="item-center">
            <div className="item-title">{highlight(item.name, query)}</div>
            <div className="item-subtitle">in {item.category || '—'} • Edited {item.lastEdited || '—'}</div>
          </div>
          <div className="item-right">
            <button className="link-btn" onClick={() => copyLink(item)} title="Copy link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="new-tab-btn" title="New Tab">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="15,3 21,3 21,9" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="10" y1="14" x2="21" y2="3" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>New Tab</span>
            </button>
            {copiedItemId === item.id && (
              <div className="link-copied-notification">
                Link Copied
              </div>
            )}
          </div>
        </div>
      );
    }
    if (item.type === 'folder') {
      return (
        <div className="result-item">
          <div className="item-left icon-square">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h5l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" fill="#6C6C6C"/></svg>
          </div>
          <div className="item-center">
            <div className="item-title">{highlight(item.name, query)}</div>
            <div className="item-subtitle">in {item.category || '—'} {item.fileCount ? <span className="pill">{item.fileCount} Files</span> : null} • Edited {item.lastEdited || '—'}</div>
          </div>
          <div className="item-right">
            <button className="link-btn" onClick={() => copyLink(item)} title="Copy link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="new-tab-btn" title="New Tab">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="15,3 21,3 21,9" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="10" y1="14" x2="21" y2="3" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>New Tab</span>
            </button>
            {copiedItemId === item.id && (
              <div className="link-copied-notification">
                Link Copied
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const handleToggle = (key) => {
    setEnabledTabs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (!updated[activeTab] && activeTab !== "All") {
        setActiveTab("All");
      }
      return updated;
    });
  };

  const visibleTabs = [
    { key: "All", label: "All" },
    enabledTabs.people ? { key: "people", label: "People" } : null,
    enabledTabs.files ? { key: "files", label: "Files" } : null,
    enabledTabs.chats ? { key: "chats", label: "Chats" } : null,
    enabledTabs.lists ? { key: "lists", label: "Lists" } : null,
  ].filter(Boolean);

  return (
      <div className="search-wrapper">
          <div className="search-bar">
              <div className="search-left">
                  <span className="search-icon"><span className="search-icon">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="#999"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                      >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                  </span></span>
                  <input
                      ref={inputRef}
                      type="text"
                      placeholder="Searching is easier"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                  />
              </div>

              {/* Right side: shortcut key + label */}
              {!query ? <div className="search-right" onClick={() => inputRef.current?.focus()}
          style={{ cursor: "pointer" }}>
                  <span className="shortcut">S</span>
                  <span className="label">quick access</span>
              </div> : <span className="clear-label" onClick={() => setQuery("")} style={{ cursor: "pointer" }}>Clear</span>}
          </div>
              {/* Dropdown Panel */}
          <div className={`search-panel ${hasResults ? "open" : ""}`}>
            <div className="search-results">
                  <div className="tabs-wrpr">
                      <div className="tabs">
                          {visibleTabs.map((tab) => (
                              <button
                                  key={tab.key}
                                  className={activeTab === tab.key ? "active" : ""}
                                  onClick={() => setActiveTab(tab.key)}
                              >
                                  {tab.key === "people" && (
                                      <svg width="28px" height="28px" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 7" id="Layer_7"><path d="M19.75,15.67a6,6,0,1,0-7.51,0A11,11,0,0,0,5,26v1H27V26A11,11,0,0,0,19.75,15.67ZM12,11a4,4,0,1,1,4,4A4,4,0,0,1,12,11ZM7.06,25a9,9,0,0,1,17.89,0Z"/></g></svg>
                                  )}
                                  {tab.key === "files" && (
                                      <svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#000000" fillRule="evenodd" d="M1 2.25A2.25 2.25 0 013.25 0h4.793c.331 0 .65.132.884.366l3.207 3.207c.076.076.141.161.195.253a.75.75 0 01.201.144l2.104 2.103c.234.235.366.553.366.884v6.793A2.25 2.25 0 0112.75 16h-7a2.25 2.25 0 01-2.25-2.25v-.25h-.25A2.25 2.25 0 011 11.25v-9zm2.25-.75a.75.75 0 00-.75.75v9c0 .414.336.75.75.75h7a.75.75 0 00.75-.75V6H7.75A.75.75 0 017 5.25V1.5H3.25zm5.25.56V4.5h2.44L8.5 2.06zm4 9.19V6.06l1 1v6.69a.75.75 0 01-.75.75h-7a.75.75 0 01-.75-.75v-.25h5.25a2.25 2.25 0 002.25-2.25z"/></svg>
                                  )}
                                  {tab.key}
                                  <span className="count-wrpr">{
                                      tab.key === "All" ? filteredResults.length :
                                      tab.key === "people" ? people_count.length :
                                      tab.key === "files" ? files_count.length : 0
                                  }</span>
                              </button>
                          ))}
                      </div>
                      <span className="settings" onClick={() => setIsSettingsOpen((v) => !v)}>
                          <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path opacity="0.4" d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" fill="#292D32" />
                              <path d="M12 15.25C13.7949 15.25 15.25 13.7949 15.25 12C15.25 10.2051 13.7949 8.75 12 8.75C10.2051 8.75 8.75 10.2051 8.75 12C8.75 13.7949 10.2051 15.25 12 15.25Z" fill="#292D32" />
                          </svg>
                          {isSettingsOpen && (
                              <div className="settings-dropdown" onClick={(e) => e.stopPropagation()}>
                                  <div className="settings-item">
                                      <span className="settings-icon">📎</span>
                                      <span>Files</span>
                                      <label className="switch">
                                          <input type="checkbox" checked={enabledTabs.files} onChange={() => handleToggle('files')} />
                                          <span className="slider"></span>
                                      </label>
                                  </div>
                                  <div className="settings-item">
                                      <span className="settings-icon">👤</span>
                                      <span>People</span>
                                      <label className="switch">
                                          <input type="checkbox" checked={enabledTabs.people} onChange={() => handleToggle('people')} />
                                          <span className="slider"></span>
                                      </label>
                                  </div>
                                  <div className="settings-item">
                                      <span className="settings-icon">💬</span>
                                      <span>Chats</span>
                                      <label className="switch">
                                          <input type="checkbox" checked={enabledTabs.chats} onChange={() => handleToggle('chats')} />
                                          <span className="slider"></span>
                                      </label>
                                  </div>
                                  <div className="settings-item">
                                      <span className="settings-icon">≡</span>
                                      <span>Lists</span>
                                      <label className="switch">
                                          <input type="checkbox" checked={enabledTabs.lists} onChange={() => handleToggle('lists')} />
                                          <span className="slider"></span>
                                      </label>
                                  </div>
                              </div>
                          )}
                      </span>
                  </div>

            {
                activeTab === "All" ? filteredResults?.map((result) => {
                    return <ItemRow key={result.id} item={result} />
                }) : activeTab === "people" ? people.map((result) => {
                    return <ItemRow key={result.id} item={result} />
                }) : activeTab === "files" ? files.map((result) => {
                    return <ItemRow key={result.id} item={result} />
                }) : activeTab === "chats" ? <span>No chats data</span> : activeTab === "lists" ? <span>No lists data</span> : null
            }

              {!hasResults&& query && <p>No results found</p>}
          </div>
          </div>
      </div>


  );
}