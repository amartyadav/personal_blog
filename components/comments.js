function loadComments(pageId, pageTitle) {
  // Get the current page URL
  const pageUrl = window.location.href;
  
  // Create comments container
  const commentsSection = document.createElement('div');
  commentsSection.className = 'comments-section';
  commentsSection.innerHTML = `
    <h3>Comments</h3>
    <div id="cusdis_thread" 
         data-host="https://cusdis.com" 
         data-app-id="78c7cda4-ac7c-477f-93ed-d250f005fb36"
         data-page-id="${pageId}" 
         data-page-url="${pageUrl}" 
         data-page-title="${pageTitle}"
         data-theme="light"></div>
  `;
  
  // Add the comments section to the document
  document.currentScript.parentElement.appendChild(commentsSection);
  
  // Load Cusdis script
  const script = document.createElement('script');
  script.src = "https://cusdis.com/js/cusdis.es.js";
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
  
  // Add a script to handle iframe resizing
  const resizeScript = document.createElement('script');
  resizeScript.textContent = `
    // Monitor for iframe creation and adjust its height
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes) {
          const iframe = document.querySelector('#cusdis_thread iframe');
          if (iframe) {
            // Set initial styles to prevent scrolling
            iframe.style.height = 'auto';
            iframe.style.minHeight = '500px';
            iframe.style.maxHeight = 'none';
            iframe.style.overflow = 'visible';
            
            // Listen for messages from the iframe about its height
            window.addEventListener('message', function(e) {
              if (e.data && typeof e.data === 'object' && e.data.from === 'cusdis') {
                if (e.data.height) {
                  iframe.style.height = (parseInt(e.data.height) + 50) + 'px'; // Add padding
                }
              }
            });
            
            observer.disconnect(); // Stop observing once iframe is found
          }
        }
      });
    });
    
    // Start observing the thread element for changes
    observer.observe(document.getElementById('cusdis_thread'), {
      childList: true,
      subtree: true
    });
  `;
  document.body.appendChild(resizeScript);
}