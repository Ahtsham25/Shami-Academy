export function getBloggerXmlCode(): string {
  return `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:responsive='true' b:version='2' class='v2' expr:dir='data:blog.languageDirection' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
  <meta charset='UTF-8'/>
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=5.0' name='viewport'/>
  <title><data:blog.pageTitle/></title>
  <b:include data='blog' name='all-head-content'/>

  <!-- Google Fonts for WordPress Astra/GeneratePress Aesthetic -->
  <link href='https://fonts.googleapis.com' rel='preconnect'/>
  <link crossorigin='' href='https://fonts.gstatic.com' rel='preconnect'/>
  <link href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=Noto+Nastaliq+Urdu:wght@400;700&amp;display=swap' rel='stylesheet'/>
  <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' rel='stylesheet'/>

  <b:skin><![CDATA[
  /* ========================================================
     SHAMI ACADEMY - 100% MOBILE AND DESKTOP RESPONSIVE THEME
     Designed to fit 100% of phone screen width with 0px horizontal scroll
     ======================================================== */
  #navbar-iframe, #b-navbar, .b-navbar {
    display: none !important;
    height: 0 !important;
    visibility: hidden !important;
  }

  :root {
    --primary: #047857;
    --primary-dark: #065f46;
    --primary-light: #ecfdf5;
    --secondary: #0284c7;
    --accent: #f59e0b;
    --text-main: #1e293b;
    --text-muted: #64748b;
    --bg-main: #f8fafc;
    --surface: #ffffff;
    --border: #e2e8f0;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  }

  html, body {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-text-size-adjust: 100%;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: var(--font-sans);
    background-color: var(--bg-main);
    color: var(--text-main);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  a { color: inherit; text-decoration: none; }
  ul { list-style: none; }
  img { max-width: 100%; height: auto; display: block; }

  /* Top Notice Bar */
  .top-notice-bar {
    background: #0f172a;
    color: #e2e8f0;
    font-size: 12px;
    padding: 8px 14px;
    width: 100%;
    box-sizing: border-box;
  }
  .notice-ticker {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  }
  .notice-badge {
    background: #ef4444;
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
  }

  /* Main Navigation Header */
  .site-header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--shadow-sm);
    width: 100%;
  }
  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    box-sizing: border-box;
  }
  .brand-lockup {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .brand-title {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
  }
  .brand-title span { color: var(--primary); }

  /* Mobile Menu Toggle Button */
  .menu-toggle-btn {
    display: none;
    background: #f1f5f9;
    border: 1px solid var(--border);
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
    cursor: pointer;
  }

  /* Nav Links */
  .nav-menu {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .nav-item { position: relative; }
  .nav-link {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
    padding: 6px 10px;
    border-radius: 6px;
    display: inline-block;
  }
  .nav-link:hover { color: var(--primary); background: var(--primary-light); }
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: var(--shadow-md);
    min-width: 200px;
    padding: 6px 0;
    display: none;
    z-index: 100;
  }
  .nav-item:hover .dropdown-menu { display: block; }
  .dropdown-item {
    display: block;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 500;
    color: #475569;
  }
  .dropdown-item:hover { background: #f1f5f9; color: var(--primary); }

  /* Header CTA */
  .header-cta-btn {
    background: var(--primary);
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 7px 14px;
    border-radius: 6px;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
    color: white;
    padding: 40px 16px;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
  }
  .hero-container { max-width: 800px; margin: 0 auto; width: 100%; }
  .hero-heading {
    font-size: 28px;
    font-weight: 800;
    line-height: 1.3;
    margin-bottom: 12px;
    word-break: break-word;
  }
  .hero-description {
    font-size: 14px;
    color: #a7f3d0;
    max-width: 600px;
    margin: 0 auto 20px;
    line-height: 1.6;
  }
  .grade-quick-pills {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    width: 100%;
  }
  .grade-pill-btn {
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: white;
    padding: 8px 14px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 12px;
  }
  .grade-pill-btn:hover { background: white; color: #065f46; }

  /* Main Wrapper */
  .main-wrapper {
    max-width: 1200px;
    margin: 24px auto;
    padding: 0 16px;
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 24px;
    width: 100%;
    box-sizing: border-box;
  }

  .section-header {
    margin-bottom: 18px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--border);
  }
  .section-title {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
  }

  /* Cards Grid */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    width: 100%;
  }
  .post-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    width: 100%;
    box-sizing: border-box;
  }
  .card-body { padding: 16px; }
  .card-title {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  .card-snippet {
    font-size: 13px;
    color: #475569;
    margin-bottom: 14px;
    line-height: 1.5;
  }
  .card-footer {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid #f1f5f9;
    padding-top: 12px;
    width: 100%;
  }
  .card-drive-btn {
    font-size: 11px;
    font-weight: 700;
    color: #065f46;
    background: #ecfdf5;
    padding: 8px 12px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: 1px solid #a7f3d0;
  }
  .card-drive-btn:hover { background: #d1fae5; }
  .card-btn {
    font-size: 12px;
    font-weight: 600;
    color: var(--primary);
  }

  /* Sidebar */
  .sidebar-widget {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 20px;
    width: 100%;
    box-sizing: border-box;
  }
  .widget-title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--border);
    color: #0f172a;
  }
  .widget-list-item {
    padding: 6px 0;
    border-bottom: 1px solid #f8fafc;
    font-size: 12px;
    color: #475569;
  }

  /* Footer */
  .site-footer {
    background: #0f172a;
    color: #94a3b8;
    padding: 36px 16px 20px;
    margin-top: 40px;
    width: 100%;
    box-sizing: border-box;
  }
  .footer-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 24px;
    padding-bottom: 28px;
    border-bottom: 1px solid #1e293b;
  }
  .footer-heading {
    color: white;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .footer-links li { margin-bottom: 8px; }
  .footer-links a { color: #94a3b8; font-size: 12px; }
  .footer-links a:hover { color: #34d399; }
  .footer-bottom {
    max-width: 1200px;
    margin: 18px auto 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    flex-wrap: wrap;
    gap: 8px;
  }

  /* ========================================================
     MOBILE RESPONSIVENESS OVERRIDES (SCREEN WIDTH < 768px)
     Eliminates horizontal scrolling completely
     ======================================================== */
  @media (max-width: 768px) {
    .menu-toggle-btn { display: inline-flex; }
    .header-container { flex-wrap: wrap; padding: 10px 14px; }
    .nav-menu {
      display: none;
      width: 100%;
      flex-direction: column;
      align-items: stretch;
      gap: 2px;
      padding-top: 10px;
      border-top: 1px solid var(--border);
    }
    .nav-menu.open { display: flex; }
    .nav-link {
      display: block;
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      border-radius: 6px;
    }
    .dropdown-menu {
      position: static;
      display: block;
      box-shadow: none;
      border: none;
      background: #f8fafc;
      padding-left: 14px;
    }
    .header-cta-btn { display: none; }
    
    .hero-section { padding: 30px 14px; }
    .hero-heading { font-size: 22px; }
    .hero-description { font-size: 13px; margin-bottom: 16px; }
    
    .grade-quick-pills {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      width: 100%;
    }
    .grade-pill-btn {
      text-align: center;
      padding: 10px 6px;
      font-size: 12px;
    }
    
    .main-wrapper {
      grid-template-columns: 1fr;
      padding: 0 12px;
      margin: 16px auto;
      gap: 20px;
    }
    .cards-grid { grid-template-columns: 1fr; }
    
    .footer-grid { grid-template-columns: 1fr; gap: 20px; }
    .footer-bottom { flex-direction: column; text-align: center; gap: 6px; }
  }
  ]]></b:skin>
</head>
<body>

  <!-- Top Announcement Bar -->
  <div class='top-notice-bar'>
    <div class='notice-ticker'>
      <span class='notice-badge'>Update</span>
      <span>Annual Examination 2026: Class 9, 10, 11, 12 Pairing Schemes and PDF Notes are now live!</span>
    </div>
  </div>

  <!-- Header Section -->
  <header class='site-header'>
    <div class='header-container'>
      <div class='brand-lockup'>
        <a class='brand-title' href='/'>SHAMI <span>ACADEMY</span></a>
      </div>

      <button class='menu-toggle-btn' id='menu-btn' onclick='var m=document.getElementById("main-nav");m.classList.toggle("open");'>
        <i class='fa fa-bars'></i> Menu
      </button>

      <nav class='nav-menu' id='main-nav'>
        <div class='nav-item'>
          <a class='nav-link' href='/'>Home</a>
        </div>

        <div class='nav-item'>
          <a class='nav-link' href='#notes'>Notes &#9662;</a>
          <div class='dropdown-menu'>
            <a class='dropdown-item' href='/search/label/Class%209%20Notes'>Class 9 Notes (9th)</a>
            <a class='dropdown-item' href='/search/label/Class%2010%20Notes'>Class 10 Notes (10th)</a>
            <a class='dropdown-item' href='/search/label/Class%2011%20Notes'>Class 11 Notes (1st Year)</a>
            <a class='dropdown-item' href='/search/label/Class%2012%20Notes'>Class 12 Notes (2nd Year)</a>
          </div>
        </div>

        <div class='nav-item'>
          <a class='nav-link' href='#schemes'>Scheme &#9662;</a>
          <div class='dropdown-menu'>
            <a class='dropdown-item' href='/search/label/Class%209%20Scheme'>Class 9 Pairing Scheme</a>
            <a class='dropdown-item' href='/search/label/Class%2010%20Scheme'>Class 10 Pairing Scheme</a>
            <a class='dropdown-item' href='/search/label/Class%2011%20Scheme'>Class 11 Pairing Scheme</a>
            <a class='dropdown-item' href='/search/label/Class%2012%20Scheme'>Class 12 Pairing Scheme</a>
          </div>
        </div>

        <div class='nav-item'>
          <a class='nav-link' href='/p/about-us.html'>About Us</a>
        </div>
        <div class='nav-item'>
          <a class='nav-link' href='/p/contact-us.html'>Contact</a>
        </div>
      </nav>

      <div class='header-cta-btn'>
        <a href='#download-zone' style='color:white;'><i class='fa fa-download'></i> Free PDFs</a>
      </div>
    </div>
  </header>

  <!-- Hero Section (Mobile Screen-Fitting) -->
  <section class='hero-section'>
    <div class='hero-container'>
      <h1 class='hero-heading'>Shami Academy Study Portal</h1>
      <p class='hero-description'>Download authentic solved exercise notes, board pairing schemes, and Google Drive PDFs for 9th, 10th, 11th, and 12th classes.</p>
      
      <div class='grade-quick-pills'>
        <a class='grade-pill-btn' href='/search/label/Class%209'>Class 9 (9th)</a>
        <a class='grade-pill-btn' href='/search/label/Class%2010'>Class 10 (10th)</a>
        <a class='grade-pill-btn' href='/search/label/Class%2011'>Class 11 (1st Year)</a>
        <a class='grade-pill-btn' href='/search/label/Class%2012'>Class 12 (2nd Year)</a>
      </div>
    </div>
  </section>

  <!-- Main Content and Sidebar Layout -->
  <div class='main-wrapper'>
    <main>
      <div class='section-header'>
        <h2 class='section-title'>Latest Academic Uploads</h2>
      </div>

      <b:section class='main' id='main' showaddelement='yes'>
        <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog'>
          <b:includable id='main'>
            <div class='cards-grid'>
              <b:loop values='data:posts' var='post'>
                <article class='post-card'>
                  <div class='card-body'>
                    <h3 class='card-title'>
                      <a expr:href='data:post.url'><data:post.title/></a>
                    </h3>
                    <div class='card-snippet'>
                      <data:post.body/>
                    </div>
                    <div class='card-footer'>
                      <a class='card-drive-btn' expr:href='data:post.url'>
                        <i class='fa fa-file-pdf'></i> Google Drive PDF Viewer &#8594;
                      </a>
                      <div>
                        <a class='card-btn' expr:href='data:post.url'>Read Notes and Download &#8594;</a>
                      </div>
                    </div>
                  </div>
                </article>
              </b:loop>
            </div>
          </b:includable>
        </b:widget>
      </b:section>
    </main>

    <!-- Sidebar Section with Widgets Enclosed -->
    <aside>
      <b:section class='sidebar' id='sidebar' showaddelement='yes'>
        <b:widget id='HTML1' locked='false' title='Notes by Class' type='HTML'>
          <b:includable id='main'>
            <div class='sidebar-widget'>
              <h3 class='widget-title'>Notes by Class</h3>
              <ul>
                <li class='widget-list-item'><a href='/search/label/Class%209%20Notes'>Class 9 Physics &amp; Chemistry Notes</a></li>
                <li class='widget-list-item'><a href='/search/label/Class%2010%20Notes'>Class 10 Biology &amp; Math Notes</a></li>
                <li class='widget-list-item'><a href='/search/label/Class%2011%20Notes'>Class 11 (1st Year) Solved Notes</a></li>
                <li class='widget-list-item'><a href='/search/label/Class%2012%20Notes'>Class 12 (2nd Year) Board Notes</a></li>
              </ul>
            </div>
          </b:includable>
        </b:widget>

        <b:widget id='HTML2' locked='false' title='Pairing Schemes 2026' type='HTML'>
          <b:includable id='main'>
            <div class='sidebar-widget'>
              <h3 class='widget-title'>Pairing Schemes 2026</h3>
              <ul>
                <li class='widget-list-item'><a href='/search/label/Class%209%20Scheme'>9th Class Paper Scheme 2026</a></li>
                <li class='widget-list-item'><a href='/search/label/Class%2010%20Scheme'>10th Class Paper Scheme 2026</a></li>
                <li class='widget-list-item'><a href='/search/label/Class%2011%20Scheme'>11th Class Pairing Scheme 2026</a></li>
                <li class='widget-list-item'><a href='/search/label/Class%2012%20Scheme'>12th Class Pairing Scheme 2026</a></li>
              </ul>
            </div>
          </b:includable>
        </b:widget>
      </b:section>
    </aside>
  </div>

  <!-- Footer -->
  <footer class='site-footer'>
    <div class='footer-grid'>
      <div>
        <h4 class='footer-heading'>Shami Academy</h4>
        <p style='font-size: 12px; line-height: 1.6; margin-bottom: 12px;'>
          Shami Academy provides free syllabus-aligned notes, pairing schemes, and Google Drive PDFs for Matric and Intermediate students across Pakistan.
        </p>
      </div>

      <div>
        <h4 class='footer-heading'>Quick Notes</h4>
        <ul class='footer-links'>
          <li><a href='/search/label/Class%209%20Notes'>Class 9 Notes</a></li>
          <li><a href='/search/label/Class%2010%20Notes'>Class 10 Notes</a></li>
          <li><a href='/search/label/Class%2011%20Notes'>Class 11 Notes</a></li>
          <li><a href='/search/label/Class%2012%20Notes'>Class 12 Notes</a></li>
        </ul>
      </div>

      <div>
        <h4 class='footer-heading'>Pairing Schemes</h4>
        <ul class='footer-links'>
          <li><a href='/search/label/Class%209%20Scheme'>9th Class Scheme</a></li>
          <li><a href='/search/label/Class%2010%20Scheme'>10th Class Scheme</a></li>
          <li><a href='/search/label/Class%2011%20Scheme'>11th Class Scheme</a></li>
          <li><a href='/search/label/Class%2012%20Scheme'>12th Class Scheme</a></li>
        </ul>
      </div>

      <div>
        <h4 class='footer-heading'>Important Pages</h4>
        <ul class='footer-links'>
          <li><a href='/p/privacy-policy.html'>Privacy Policy</a></li>
          <li><a href='/p/disclaimer.html'>Disclaimer</a></li>
          <li><a href='/p/about-us.html'>About Us</a></li>
          <li><a href='/p/contact-us.html'>Contact Us</a></li>
        </ul>
      </div>
    </div>

    <div class='footer-bottom'>
      <div>&#169; 2026 Shami Academy. All Rights Reserved.</div>
      <div>100% Mobile and Computer Responsive Theme</div>
    </div>
  </footer>

</body>
</html>`;
}

export function getStandaloneHtmlCode(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Shami Academy - Notes & Pairing Schemes Portal (Class 9, 10, 11, 12)</title>
  <meta name="description" content="Free Class 9, 10, 11, 12 Notes, Pairing Schemes 2026, and Google Drive PDFs by Shami Academy.">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    /* ========================================================
       SHAMI ACADEMY - 100% SCREEN FITTING & RESPONSIVE STYLES
       No horizontal scrolling on any mobile screen (320px-420px)
       ======================================================== */
    #navbar-iframe, #b-navbar, .b-navbar {
      display: none !important;
      height: 0 !important;
      visibility: hidden !important;
    }

    :root {
      --primary: #047857;
      --primary-dark: #065f46;
      --primary-light: #ecfdf5;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --bg: #f8fafc;
      --surface: #ffffff;
    }
    
    html, body {
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-text-size-adjust: 100%;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text-main);
      line-height: 1.6;
    }
    a { color: inherit; text-decoration: none; }
    
    /* Top Bar */
    .top-bar {
      background: #0f172a;
      color: #cbd5e1;
      font-size: 11px;
      padding: 6px 14px;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
    }
    .badge {
      background: #ef4444;
      color: #fff;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 10px;
      margin-right: 6px;
      display: inline-block;
    }
    
    /* Header */
    .header {
      background: #fff;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      width: 100%;
    }
    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
    }
    .logo-box {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .logo-box span { color: var(--primary); }

    /* Mobile Hamburger Menu Button */
    .hamburger-btn {
      display: none;
      background: #f1f5f9;
      border: 1px solid var(--border);
      color: #0f172a;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
    }
    
    /* Nav */
    .nav {
      display: flex;
      gap: 4px;
      align-items: center;
      flex-wrap: wrap;
    }
    .nav-link {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      padding: 6px 12px;
      border-radius: 6px;
    }
    .nav-link:hover { color: var(--primary); background: var(--primary-light); }
    .btn-cta {
      background: var(--primary);
      color: #fff;
      font-weight: 600;
      font-size: 12px;
      padding: 8px 16px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    
    /* Hero */
    .hero {
      background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
      color: #fff;
      text-align: center;
      padding: 36px 16px;
      width: 100%;
      box-sizing: border-box;
    }
    .hero h1 {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
      line-height: 1.3;
    }
    .hero p {
      font-size: 14px;
      color: #a7f3d0;
      max-width: 600px;
      margin: 0 auto 20px;
      line-height: 1.5;
    }
    .pills {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
      width: 100%;
    }
    .pill {
      background: rgba(255,255,255,0.18);
      border: 1px solid rgba(255,255,255,0.3);
      color: #fff;
      padding: 8px 14px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      display: inline-block;
    }
    .pill:hover { background: #fff; color: #065f46; }
    
    /* Main Layout */
    .container {
      max-width: 1200px;
      margin: 24px auto;
      padding: 0 16px;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 24px;
      width: 100%;
      box-sizing: border-box;
    }
    
    /* Grid */
    .section-title {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--border);
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      width: 100%;
    }
    .card {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      width: 100%;
      box-sizing: border-box;
    }
    .card h3 { font-size: 16px; margin: 8px 0; color: #0f172a; line-height: 1.4; }
    .card p { font-size: 13px; color: #64748b; margin-bottom: 14px; line-height: 1.5; }
    .card-footer {
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
      font-size: 12px;
      width: 100%;
    }
    .btn-drive-embed {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 8px 12px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-align: center;
    }
    .btn-drive-embed:hover { background: #d1fae5; }
    .card-footer a.download-link { color: var(--primary); font-weight: 700; font-size: 12px; }
    
    /* Sidebar */
    .widget {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 20px;
      width: 100%;
      box-sizing: border-box;
    }
    .widget h3 {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 12px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 6px;
    }
    .widget ul { list-style: none; }
    .widget li { padding: 6px 0; border-bottom: 1px solid #f8fafc; font-size: 12px; color: #475569; }
    .widget li:hover { color: var(--primary); }
    
    /* Footer */
    .footer {
      background: #0f172a;
      color: #94a3b8;
      padding: 40px 16px 20px;
      margin-top: 40px;
      width: 100%;
      box-sizing: border-box;
    }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 24px;
      padding-bottom: 28px;
      border-bottom: 1px solid #1e293b;
    }
    .footer h4 { color: #fff; font-size: 14px; margin-bottom: 12px; font-weight: 700; }
    .footer ul { list-style: none; }
    .footer li { margin-bottom: 8px; font-size: 12px; }
    .footer a:hover { color: #34d399; }
    .footer-copy {
      max-width: 1200px;
      margin: 16px auto 0;
      font-size: 11px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }

    /* ========================================================
       MOBILE SPECIFIC OVERRIDES (< 768px)
       Guarantees 100% screen fit with zero horizontal scrolling
       ======================================================== */
    @media (max-width: 768px) {
      .hamburger-btn { display: inline-flex; align-items: center; gap: 4px; }
      .header-inner { flex-wrap: wrap; }
      .nav {
        display: none;
        width: 100%;
        flex-direction: column;
        align-items: stretch;
        gap: 2px;
        padding-top: 10px;
        border-top: 1px solid var(--border);
        margin-top: 10px;
      }
      .nav.show-mobile { display: flex; }
      .nav-link {
        display: block;
        width: 100%;
        padding: 10px 12px;
        font-size: 13px;
        background: #f8fafc;
        border-radius: 6px;
      }
      .btn-cta { display: none; }

      .hero { padding: 28px 14px; }
      .hero h1 { font-size: 22px; }
      .hero p { font-size: 13px; margin-bottom: 14px; }
      
      .pills {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        width: 100%;
      }
      .pill {
        width: 100%;
        text-align: center;
        padding: 9px 4px;
        font-size: 11px;
      }

      .container {
        grid-template-columns: 1fr;
        padding: 0 12px;
        margin: 16px auto;
        gap: 20px;
      }
      .cards-grid { grid-template-columns: 1fr; }

      .footer-inner { grid-template-columns: 1fr; gap: 20px; }
      .footer-copy { flex-direction: column; text-align: center; gap: 6px; }
    }
  </style>
</head>
<body>
  <!-- Top Bar -->
  <div class="top-bar">
    <span class="badge">UPDATED 2026</span> Class 9, 10, 11, 12 Notes & Pairing Schemes
  </div>

  <!-- Header -->
  <header class="header">
    <div class="header-inner">
      <div class="logo-box">SHAMI <span>ACADEMY</span></div>
      
      <button class="hamburger-btn" onclick="document.getElementById('nav-menu').classList.toggle('show-mobile');">
        <i class="fa fa-bars"></i> Menu
      </button>

      <nav class="nav" id="nav-menu">
        <a class="nav-link" href="#home">Home</a>
        <a class="nav-link" href="#class-9">Class 9 Notes</a>
        <a class="nav-link" href="#class-10">Class 10 Notes</a>
        <a class="nav-link" href="#class-11">Class 11 (1st Year)</a>
        <a class="nav-link" href="#class-12">Class 12 (2nd Year)</a>
        <a class="nav-link" href="#schemes">Pairing Schemes 2026</a>
      </nav>
      <a class="btn-cta" href="#download"><i class="fa fa-download"></i> Get Notes</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <h1>Shami Academy Study Portal</h1>
    <p>High-quality solved exercise notes, formulas, board pairing schemes, and Google Drive PDFs for 9th, 10th, 11th, and 12th classes.</p>
    <div class="pills">
      <span class="pill">Class 9 Notes & Schemes</span>
      <span class="pill">Class 10 Notes & Schemes</span>
      <span class="pill">Class 11 (1st Year)</span>
      <span class="pill">Class 12 (2nd Year)</span>
    </div>
  </section>

  <!-- Content Grid -->
  <div class="container">
    <div>
      <h2 class="section-title">Popular Study Resources</h2>
      <div class="cards-grid">
        <div class="card">
          <small style="color:var(--primary); font-weight:700;">CLASS 9 · PHYSICS</small>
          <h3>Ch 1: Physical Quantities & Measurement</h3>
          <p>Base & derived quantities, SI units, vernier calipers, screw gauge, and zero error numericals.</p>
          <div class="card-footer">
            <a class="btn-drive-embed" href="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view" target="_blank">
              <i class="fa fa-file-pdf"></i> Open Google Drive PDF &#8594;
            </a>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="color:#64748b; font-size:11px;">14 Pages · 3.4 MB</span>
              <a class="download-link" href="#">Download Notes &#8594;</a>
            </div>
          </div>
        </div>

        <div class="card">
          <small style="color:var(--primary); font-weight:700;">CLASS 10 · PHYSICS</small>
          <h3>Ch 10: Simple Harmonic Motion & Waves</h3>
          <p>Mass-spring system, simple pendulum, wave equation, ripple tank, and board numericals.</p>
          <div class="card-footer">
            <a class="btn-drive-embed" href="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view" target="_blank">
              <i class="fa fa-file-pdf"></i> Open Google Drive PDF &#8594;
            </a>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="color:#64748b; font-size:11px;">16 Pages · 3.8 MB</span>
              <a class="download-link" href="#">Download Notes &#8594;</a>
            </div>
          </div>
        </div>

        <div class="card">
          <small style="color:var(--primary); font-weight:700;">CLASS 11 · PHYSICS</small>
          <h3>Ch 2: Vectors and Equilibrium</h3>
          <p>Rectangular components, dot/cross products, torque, and equilibrium conditions with solved questions.</p>
          <div class="card-footer">
            <a class="btn-drive-embed" href="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view" target="_blank">
              <i class="fa fa-file-pdf"></i> Open Google Drive PDF &#8594;
            </a>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="color:#64748b; font-size:11px;">22 Pages · 5.2 MB</span>
              <a class="download-link" href="#">Download Notes &#8594;</a>
            </div>
          </div>
        </div>

        <div class="card">
          <small style="color:var(--primary); font-weight:700;">CLASS 12 · PHYSICS</small>
          <h3>Ch 12: Electrostatics</h3>
          <p>Coulomb’s law, electric field, Gauss’s law, potential, capacitors, and board long questions.</p>
          <div class="card-footer">
            <a class="btn-drive-embed" href="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view" target="_blank">
              <i class="fa fa-file-pdf"></i> Open Google Drive PDF &#8594;
            </a>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="color:#64748b; font-size:11px;">26 Pages · 6.1 MB</span>
              <a class="download-link" href="#">Download Notes &#8594;</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <aside>
      <div class="widget">
        <h3>Board Pairing Schemes 2026</h3>
        <ul>
          <li>9th Class Physics, Chemistry, Biology Scheme</li>
          <li>10th Class Math, Computer & Physics Scheme</li>
          <li>11th Class FSc 1st Year Pairing Scheme</li>
          <li>12th Class FSc 2nd Year Pairing Scheme</li>
        </ul>
      </div>

      <div class="widget">
        <h3>All Pages</h3>
        <ul>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#disclaimer">Disclaimer</a></li>
          <li><a href="#about">About Shami Academy</a></li>
          <li><a href="#contact">Contact Support</a></li>
        </ul>
      </div>
    </aside>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <div>
        <h4>Shami Academy</h4>
        <p style="font-size: 12px; line-height: 1.6;">Dedicated portal for Pakistani board examinations (Punjab & Federal Boards), providing authentic notes and assessment schemes.</p>
      </div>
      <div>
        <h4>Notes</h4>
        <ul>
          <li><a href="#c9">Class 9 Notes</a></li>
          <li><a href="#c10">Class 10 Notes</a></li>
          <li><a href="#c11">Class 11 Notes</a></li>
          <li><a href="#c12">Class 12 Notes</a></li>
        </ul>
      </div>
      <div>
        <h4>Schemes</h4>
        <ul>
          <li><a href="#s9">Class 9 Scheme</a></li>
          <li><a href="#s10">Class 10 Scheme</a></li>
          <li><a href="#s11">Class 11 Scheme</a></li>
          <li><a href="#s12">Class 12 Scheme</a></li>
        </ul>
      </div>
      <div>
        <h4>Legal Pages</h4>
        <ul>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#disclaimer">Disclaimer</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-copy">
      <div>&copy; 2026 Shami Academy. All rights reserved.</div>
      <div>100% Screen-Fitting Mobile Responsive</div>
    </div>
  </footer>
</body>
</html>`;
}
