// Ad Skipper & Speed Booster for YouTube
// Automatically skips ads and plays them at 16x speed

let originalSpeed = 1;
let originalVolume = 1;
let isAdPlaying = false;

// Function to check if an ad is currently playing
function checkForAd() {
  const video = document.querySelector('video');
  if (!video) return false;

  // Primary check: Look for the ad-showing class on the player
  const moviePlayer = document.querySelector('.html5-video-player');
  if (moviePlayer && moviePlayer.classList.contains('ad-showing')) {
    return true;
  }

  // Check if the ad module is actively displaying
  const adModule = document.querySelector('.video-ads.ytp-ad-module');
  if (adModule) {
    const adDisplayStyle = window.getComputedStyle(adModule).display;
    if (adDisplayStyle !== 'none') {
      return true;
    }
  }

  // Check for visible ad player overlay
  const adPlayerOverlay = document.querySelector('.ytp-ad-player-overlay');
  if (adPlayerOverlay) {
    const overlayStyle = window.getComputedStyle(adPlayerOverlay).display;
    if (overlayStyle !== 'none') {
      return true;
    }
  }

  // Check for skip button (strong indicator)
  const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button-slot button');
  if (skipButton && skipButton.offsetParent !== null) {
    return true;
  }

  // Check for ad text/badge that's actually visible
  const adText = document.querySelector('.ytp-ad-text');
  if (adText && adText.offsetParent !== null) {
    return true;
  }

  return false;
}

let lastSkipClick = 0;

// Function to click the skip button
function clickSkipButton() {
  // Prevent clicking too frequently
  const now = Date.now();
  if (now - lastSkipClick < 500) {
    return false;
  }

  const skipButtons = [
    'button.ytp-skip-ad-button',
    '.ytp-skip-ad-button',
    '.ytp-ad-skip-button-modern',
    '.ytp-ad-skip-button',
    'button[id^="skip-button"]',
    '.ytp-ad-skip-button-slot button',
    '.ytp-ad-skip-button-container button'
  ];

  for (const selector of skipButtons) {
    const button = document.querySelector(selector);
    if (button && button.offsetParent !== null) {
      console.log('Ad Skipper: ⏭️ Found skip button, attempting to click:', selector);

      // Try multiple click methods
      try {
        button.click();

        // Also try dispatching a mouse event
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        button.dispatchEvent(clickEvent);

        console.log('Ad Skipper: ✅ Skip button clicked successfully!');
        lastSkipClick = now;
        return true;
      } catch (e) {
        console.log('Ad Skipper: ❌ Error clicking button:', e);
      }
    }
  }
  return false;
}

// Function to set playback speed to 16x during ads
function setAdSpeed() {
  const video = document.querySelector('video');
  if (!video) return;

  const adDetected = checkForAd();

  if (adDetected) {
    if (!isAdPlaying) {
      originalSpeed = video.playbackRate || 1;
      originalVolume = video.volume;
      isAdPlaying = true;
      console.log('Ad Skipper: ✅ Ad detected! Setting 16x speed & muting (was speed:', originalSpeed, ', volume:', originalVolume + ')');
    }

    // Set to maximum speed (16x is the browser limit, but we'll try 16x)
    if (video.playbackRate !== 16) {
      video.playbackRate = 16;
      console.log('Ad Skipper: Speed set to 16x');
    }

    // Mute the ad
    if (video.volume !== 0) {
      video.volume = 0;
      video.muted = true;
      console.log('Ad Skipper: 🔇 Ad muted');
    }

    // Try to skip immediately
    clickSkipButton();
  } else {
    if (isAdPlaying) {
      // Wait a bit to ensure ad is truly finished
      setTimeout(() => {
        // Double-check no ad is playing
        if (!checkForAd()) {
          console.log('Ad Skipper: ✅ Ad finished! Restoring speed to', originalSpeed, 'and volume to', originalVolume);
          video.playbackRate = originalSpeed || 1;
          video.volume = originalVolume;
          video.muted = false;
          isAdPlaying = false;
        }
      }, 500);
    }
  }
}

// Main observer to monitor DOM changes
function initAdSkipper() {
  console.log('🚀 Ad Skipper: Extension loaded and running!');

  // Check for ads periodically (every 250ms)
  setInterval(() => {
    setAdSpeed();
  }, 250);

  // Observer for DOM changes (when skip button appears)
  const observer = new MutationObserver(() => {
    // Immediately try to click skip button when DOM changes
    clickSkipButton();
    setAdSpeed();
  });

  // Start observing after a short delay to ensure page is ready
  setTimeout(() => {
    const targetNode = document.body;
    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true
      });
      console.log('Ad Skipper: Watching for ads...');
    }
  }, 1000);

  // Also listen for video time updates
  const attachVideoListeners = () => {
    const video = document.querySelector('video');
    if (video && !video.hasAttribute('data-ad-skipper-listeners')) {
      video.setAttribute('data-ad-skipper-listeners', 'true');
      video.addEventListener('timeupdate', setAdSpeed);
      video.addEventListener('play', setAdSpeed);
      video.addEventListener('loadeddata', setAdSpeed);
      console.log('Ad Skipper: Video listeners attached');
    }
  };

  // Try to attach immediately
  attachVideoListeners();

  // And retry periodically in case video loads later
  setInterval(attachVideoListeners, 2000);
}

// Wait for page to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdSkipper);
} else {
  initAdSkipper();
}

// Handle dynamic video loading
const videoObserver = new MutationObserver(() => {
  const video = document.querySelector('video');
  if (video && !video.hasAttribute('data-ad-skipper-attached')) {
    video.setAttribute('data-ad-skipper-attached', 'true');
    video.addEventListener('timeupdate', setAdSpeed);
    video.addEventListener('play', setAdSpeed);
  }
});

videoObserver.observe(document.body, {
  childList: true,
  subtree: true
});
