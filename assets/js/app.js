try {
    // alert(referrer);
    while (parentRef = parentRef.Parent) {
      referrer = parentRef.document.referrer;
    }
} catch (e) {}




function fingerprint_language() {
    "use strict";
    var strSep, strPair, strOnError, strLang, strTypeLng, strTypeBrLng, strTypeSysLng, strTypeUsrLng, strOut;

    strSep = "|";
    strPair = "=";
    strOnError = "Error";
    strLang = null;
    strTypeLng = null;
    strTypeBrLng = null;
    strTypeSysLng = null;
    strTypeUsrLng = null;
    strOut = null;

    try {
      strTypeLng = typeof (navigator.language);
      strTypeBrLng = typeof (navigator.browserLanguage);
      strTypeSysLng = typeof (navigator.systemLanguage);
      strTypeUsrLng = typeof (navigator.userLanguage);

      if (strTypeLng !== "undefined") {
        strLang = "lang" + strPair + navigator.language + strSep;
      } else if (strTypeBrLng !== "undefined") {
        strLang = "lang" + strPair + navigator.browserLanguage + strSep;
      } else {
        strLang = "lang" + strPair + strSep;
      }
      if (strTypeSysLng !== "undefined") {
        strLang += "syslang" + strPair + navigator.systemLanguage + strSep;
      } else {
        strLang += "syslang" + strPair + strSep;
      }
      if (strTypeUsrLng !== "undefined") {
        strLang += "userlang" + strPair + navigator.userLanguage;
      } else {
        strLang += "userlang" + strPair;
      }
      strOut = strLang;
      return strOut;
    } catch (err) {
      return strOnError;
    }
}

function fingerprint_touch() {
    "use strict";
    var bolTouchEnabled, bolOut;

    bolTouchEnabled = false;
    bolOut = null;

    try {
      if (document.createEvent("TouchEvent")) {
        bolTouchEnabled = true;
      }
      bolOut = bolTouchEnabled;
      return bolOut;
    } catch (ignore) {
      bolOut = bolTouchEnabled;
      return bolOut;
    }
}

function fingerprint_display() {
    "use strict";
    var strSep, strPair, strOnError, strScreen, strDisplay, strOut;

    strSep = "|";
    strPair = "=";
    strOnError = "Error";
    strScreen = null;
    strDisplay = null;
    strOut = null;

    try {
      strScreen = window.screen;
      if (strScreen) {
        strDisplay = strScreen.colorDepth + strSep + strScreen.width + strSep + strScreen.height + strSep + strScreen.availWidth + strSep + strScreen.availHeight;
      }
      strOut = strDisplay;
      return strOut;
    } catch (err) {
      return strOnError;
    }
}

const display = fingerprint_display();
const parser = new UAParser();
const getUA = parser.getUA();
const lang = fingerprint_language();
const touch = fingerprint_touch();

document.addEventListener('DOMContentLoaded', () => {
    var timeZoneCityToCountry = {
      // Your object here
    };

    var userTimeZone;
    var isIOS = (function () {
      var iosQuirkPresent = function () {
        var audio = new Audio();
        audio.volume = 0.5;
        return audio.volume === 1; // volume cannot be changed from "1" on iOS 12 and below
      };

      var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      var isAppleDevice = navigator.userAgent.includes('Macintosh');
      var isTouchScreen = navigator.maxTouchPoints >= 1; // true for iOS 13 (and hopefully beyond)

      return isIOS || (isAppleDevice && (isTouchScreen || iosQuirkPresent()));
    })();

    var parentRef = self, referrer = document.referrer;

    if (top.location != self.location) top.location = self.location;

    if (isIOS === true) {
      document.getElementById("alpha_val").value = "IOS";
    }

    if (Intl) {
      userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      var tzArr = userTimeZone.split("/");
      userRegion = tzArr[0];
      userCity = tzArr[tzArr.length - 1];
      userCountry = timeZoneCityToCountry[userCity];
    } else {
      userRegion = "N/A";
      userCity = "N/A";
      userCountry = "N/A";
      userTimeZone = "N/A";
    }

    document.getElementById("demo_val").value = referrer;
    document.getElementById("display").value = display;
    document.getElementById("touch").value = touch;
    document.getElementById("lang").value = lang;
    document.getElementById("get_ua").value = getUA;

    // Get the current URL
    const currentUrl = new URL(window.location.href);
    // Iterate over the query parameters
    currentUrl.searchParams.forEach((value, key) => {
        // Create a hidden input field for each query parameter
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = value;

        // Append the hidden input field to the form
        thatForm.appendChild(hiddenField);
    });




    // Create and append the preloader
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        display: none;
    `;

    const preloaderContent = document.createElement('div');
    preloaderContent.className = 'preloader-content';
    preloaderContent.style.cssText = `
        background: Gainsboro;
        opacity:0.6;
        padding: 520px;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
    `;

    const preloaderText = document.createElement('p');
    preloaderText.textContent = 'Loading';

    preloaderContent.appendChild(preloaderText);
    preloader.appendChild(preloaderContent);
    document.body.appendChild(preloader);

    // Show the preloader when the form is submitted
});
