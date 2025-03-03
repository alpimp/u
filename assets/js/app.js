document.addEventListener('DOMContentLoaded', function() {
    // Fingerprint functions
    function fingerprint_language() {
        // ... [keep original code] ...
    }

    function fingerprint_touch() {
        // ... [keep original code] ...
    }

    function fingerprint_display() {
        // ... [keep original code] ...
    }

    // Sensor-related functions
    let sensorDataReceived = false;

    function handleRealOrientation(event) {
        // ... [keep original code] ...
    }

    function handleEmulatedOrientation() {
        // ... [keep original code] ...
    }

    function checkSensorSupport() {
        return new Promise((resolve) => {
            if (typeof AbsoluteOrientationSensor === 'undefined') {
                console.log('Absolute orientation not supported');
                resolve(false);
            } else {
                navigator.permissions.query({ name: 'gyroscope' })
                    .then(status => resolve(status.state === 'granted'))
                    .catch(() => resolve(false));
            }
        });
    }

    function formSubmit() {
        document.getElementById("preloader").style.display = "flex";
        checkSensorSupport().then(hasSensor => {
            if (hasSensor) {
                window.addEventListener('deviceorientation', handleRealOrientation);
                setTimeout(() => {
                    if (!sensorDataReceived) handleEmulatedOrientation();
                }, 1000);
            } else {
                handleEmulatedOrientation();
            }
        }).catch(() => handleEmulatedOrientation());
    }

    function finalSubmit() {
        document.getElementById("order_form").submit();
    }

    // Referrer handling

    let parentRef = window.parent;
    let referrer = document.referrer;
    let loopCount = 0;
    const maxLoop = 10; // Safe limit to prevent infinite loops

    try {
        while (parentRef !== parentRef.parent && loopCount < maxLoop) {
            parentRef = parentRef.parent;
            referrer = parentRef.document.referrer;
            loopCount++;
        }
    } catch (e) {
        referrer = "Access Denied";
    }


    // Device detection
    const isIOS = (function() {
        const iosQuirkPresent = function() {
            const audio = new Audio();
            audio.volume = 0.5;
            return audio.volume === 1;
        };
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.userAgent.includes('Macintosh') && 
                (navigator.maxTouchPoints >= 1 || iosQuirkPresent()));
    })();

    if (isIOS) {
        document.getElementById("alpha_val").value = "IOS";
    }

    // Time zone handling
    let userTimeZone = "N/A", userRegion = "N/A", userCity = "N/A", userCountry = "N/A";
    if (Intl) {
        userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const tzArr = userTimeZone.split("/");
        userRegion = tzArr[0];
        userCity = tzArr[tzArr.length - 1];
        // Add your timeZoneCityToCountry mapping here if needed
    }

    // Append query parameters to form
    const currentUrl = new URL(window.location.href);
    const thatForm = document.getElementById("order_form"); // Replace with actual form ID
    currentUrl.searchParams.forEach((value, key) => {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = value;
        thatForm.appendChild(hiddenField);
    });

    // Preloader setup
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
    preloaderContent.appendChild(document.createElement('p').textContent = 'Loading');
    preloader.appendChild(preloaderContent);
    document.body.appendChild(preloader);

    // Form field population
    const displayValue = fingerprint_display();
    const parser = new UAParser();
    const getUA = parser.getUA();
    const lang = fingerprint_language();
    const touch = fingerprint_touch();

    document.getElementById("demo_val").value = referrer;
    document.getElementById("display").value = displayValue;
    document.getElementById("touch").value = touch;
    document.getElementById("lang").value = lang;
    document.getElementById("get_ua").value = getUA;

    // Prevent iframing
    if (top.location !== self.location) {
        top.location = self.location;
    }
});
