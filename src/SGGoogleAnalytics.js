/*!
 * SGGoogleAnalytics v0.0.1
 * Google Analytics wrapper with event tracking and custom dimenstions and metrics.
 * MIT License
 */
window.SGGoogleAnalytics = ( function()
{
    var app = {},
        settings = {
            // Use this to indicate bigger changes
            // in your tracking or the app/site your are
            // tracking. May be used as a filter var in Analytics Backend
            trackingVersion: 1,
            // Toggles whether the version should be tracked. Defaults to true
            trackVersion: true,
            // Toggles whether the google client id should
            // be tracked. Defaults to false.
            // Add the unique google client Id to our set of data.
            // Google Analytics uses a client ID to associate individual hits
            // with a particular user. Unless you’ve customized your setup, analytics.js
            // automatically generates this value for you, stores it in the browser’s
            // cookies, and sends it with all hits.
            trackClientId: false,
            // Toggles whether a generated WindowId should be tracked. Defaults to false.
            // Collect window specific data to differ between multiple open windows per user
            // Sometimes users interact with your site with more than one window or tab open at a time.
            // That way every hit sent from the current window context can be later associated with
            // that window context through the Window ID dimension.
            trackWindowId: false,
            // Toggles tracking of individual data to identify the path an individual (anonymously)
            // user took. Defaults to true.
            trackIndividualHits: true,
            // Toggles tracking of all javascript errors that occur and send an 
            // event for each event to ga. Defaults to true.
            trackErrors: true,
            // Toggles tracking of performance metrics as event (server response, 
            // page load, DOM content loaded). Defaults to true.
            trackPerformance: true,
            // Toggles whether downloads should be tracked. Defaults to false.
            trackDownloads: false,
            // Toggles whether outbound links should be tracked. Defaults to false.
            trackOutboundLinks: false,
            trackSGEstateSearchBoxSend: false,
            // map the ga dimension indizes to the internal tracking dimensions. You
            // can adjust the dimensions we use to track individual data to your needs.
            // !!! Please make sure you add the dimensions in the Google Analytics Backend !!!
            dimensionTrackingVersion: 'dimension1',
            dimensionClientId: 'dimension2',
            dimensionWindowId: 'dimension3',
            dimensionHitId: 'dimension4',
            dimensionHitTime: 'dimension5',
            dimensionHitType: 'dimension6',
            // map the ga metric indizes to the internal metric identifiers.
            // !!! Please make sure you add the metrics in the Google Analytics Backend !!!
            metricServerResponseEnd: 'metric1',
            metricDOMContentLoaded: 'metric2',
            metricPageLoaded: 'metric3',
            metricSGEstateSearchBoxSize: 'metric4',
            metricSGEstateSearchBoxRooms: 'metric5',
            metricSGEstateSearchBoxRent: 'metric6',
            sgEstateSearchBoxSizeSelector: '#flatSizeMinField',
            sgEstateSearchBoxRoomsSelector: '#flatRoomsMinField',
            sgEstateSearchBoxRentSelector: '#flatAmountMaxField',
            sgEstateSearchBoxEventTriggerSelector: '#flatSearchForm',
            // Maps the event name for download tracking
            eventDownloadsCategory: 'download',
            // Which file extensions do you want to track as download events?
            eventDownloadsFileTypes: ['pdf'],
            // Map the event category name for outbound links tracking
            eventOutboundCategory: 'outbound',
            // Map the event action for outbound links
            eventOutboundAction: 'click',
            // GA tracking property. You may provide this via the settings object in init()
            // or you may provide the property via the global variable
            // window.SGGoogleAnalyticsProperty = 'UA-XXXXXX';
            property: false,
            // Define the selector which triggers the analytics optout
            disableLinkSelector: '.sggoogleanalytics-optout',
            // Define whether the optout link click should trigger
            // a confirmation alert by default.
            disableLinkIdle: false,
            // The optout cookie prefix
            disableCookieIdentifier: 'ga-disable-',
            // The optout confirmation alert text
            textDisableSuccess: 'Optout für diese Seite erfolgreich gesetzt. Google Analytics erfasst in diesem Browser keine Statistiken mehr zu dieser Webseite.',
            // Whether you'd like to see debug output.
            debug: false,
        },
        clientId = false,
        windowId = false,
        hitId = false,
        hitTime = false,
        disabled = false,
        pagePerformance = {
            serverResponseEnd: false,
            domContentLoaded: false,
            pageLoaded: false
        },
        $sgEstateSearchBoxTrigger = false;

    /**
     * Add a version of a set of tracking dimensions and metrics state to the data set
     *
     * Any time you make changes to software it’s important to version your changes
     * so you can isolate a specific feature set to a specific version number.
     * This is as true with analytics implementations as it is with anything else.
     * If you update your analytics implementation to start tracking a bunch of new dimensions,
     * or if you change the format of the data you’re collecting (for whatever reason),
     * you probably only want to report on data from the subset of users who are
     * running your latest changes.
     */
    var trackVersion = function()
    {
        if( settings.trackVersion )
        {
            if( settings.debug )
            {
                console.log("SGGoogleAnalytics.trackVersion: %i", settings.trackingVersion );
            }
            ga('set', settings.dimensionTrackingVersion, settings.trackingVersion );
        }
    };

    /**
     * Add the unique google client Id to our set of data.
     *
     * Google Analytics uses a client ID to associate individual hits
     * with a particular user. Unless you’ve customized your setup, analytics.js
     * automatically generates this value for you, stores it in the browser’s
     * cookies, and sends it with all hits.
     */
    var trackClientId = function()
    {
        if( settings.trackClientId )
        {
            ga( function (tracker)
            {
                // tracker object in callback function has the client id
                clientId = tracker.get('clientId');
                if( settings.debug )
                {
                    console.log("SGGoogleAnalytics.trackClientId: %s", clientId );
                }
                tracker.set( settings.dimensionClientId, clientId );
            });
        }
    };

    /**
     * Collect window specific data to differ between multiple open windows per user
     *
     * Sometimes users interact with your site with more than one window or tab open at a time.
     * That way every hit sent from the current window context can be later associated with
     * that window context through the Window ID dimension.
     */
    var trackWindowId = function()
    {
        if( settings.trackWindowId )
        {
            windowId = generateUniqueWindowID();
            if( settings.debug )
            {
                console.log("SGGoogleAnalytics.trackWindowId: %s", windowId );
            }
            ga('set', settings.dimensionWindowId, windowId );
        }
    };

    /**
     * Generate a unique number to identify the current window
     * @param a
     * @returns {string}
     */
    var generateUniqueWindowID = function b(a)
    {
        return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) :
            ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
    };

    /**
     *  Track individual data to identify the path an individual (anonymously)
     *  user took.
     */
    var trackIndividualHits = function()
    {
        if( settings.trackIndividualHits )
        {
            hitId = generateUniqueWindowID();
            hitTime = String( +new Date );
            ga( function (tracker)
            {

                var originalBuildHitTask = tracker.get('buildHitTask');
                tracker.set( 'buildHitTask', function( model )
                {
                    model.set( settings.dimensionHitId, hitId, true );
                    model.set( settings.dimensionHitTime, hitTime, true );
                    // hit type is not publicly available in this module (app) due to its scope
                    // it will be tracked anyway
                    var hitType = model.get( 'hitType' );
                    if( settings.debug )
                    {
                        console.log("SGGoogleAnalytics.trackIndividualHits: hitType: %s", hitType );
                    }
                    model.set( settings.dimensionHitType, hitType, true );

                    originalBuildHitTask( model );
                });
            });
            if( settings.debug )
            {
                console.log("SGGoogleAnalytics.trackIndividualHits: hitId:  %s", hitId );
                console.log("SGGoogleAnalytics.trackIndividualHits: hitTime: %s", hitTime );
            }
        }
    };

    /**
     * Track all errors that occur and send an event for each event to ga
     */
    var trackErrors = function()
    {
        if( settings.trackErrors )
        {
            var loadErrorEvents = window.__e && window.__e.q || [];
            var fieldsObj = { eventAction: 'uncaught error' };
            // loop through each of the recorded errors on startup and send event
            for( var i = 0; i < loadErrorEvents.length; i++ )
            {
                trackError( loadErrorEvents[i].error, fieldsObj );
            }
            // track all future errors directly
            window.addEventListener('error', function( event )
            {
                trackError( event.error, fieldsObj );
            });
        }
    };

    /**
     * Track a single error as event.
     * @param error
     * @param fieldsObj
     */
    var trackError = function( error, fieldsObj )
    {
        if( typeof fieldsObj === "undefined" )
        {
            fieldsObj = {};
        }
        ga('send', 'event', Object.assign({
            eventCategory: 'Script',
            eventAction: 'error',
            eventLabel: (error && error.stack) || '(not set)',
            nonInteraction: true,
        }, fieldsObj));
        if( settings.debug )
        {
            console.log("SGGoogleAnalytics.trackError: Script, error, %s, uncaught error", (error && error.stack) || '(not set)' );
        }
    };

    /**
     * Track performance metrics as event
     */
    var trackPerformance = function()
    {
        if( settings.trackPerformance )
        {
            // Only track performance in supporting browsers.
            if (!(window.performance && window.performance.timing)) return;
            // If the window hasn't loaded, run this function after the `load` event.
            if (document.readyState != 'complete')
            {
                window.addEventListener('load', trackPerformance );
                return;
            }

            var nt = performance.timing;
            var navStart = nt.navigationStart;

            pagePerformance.serverResponseEnd = Math.round( nt.responseEnd - navStart );
            pagePerformance.domContentLoaded = Math.round( nt.domContentLoadedEventStart - navStart );
            pagePerformance.pageLoaded = Math.round( nt.loadEventStart - navStart );

            // check if all metric values are somehow valid
            if( isIntegerValueValid( pagePerformance.serverResponseEnd ) &&
                isIntegerValueValid( pagePerformance.domContentLoaded ) &&
                isIntegerValueValid( pagePerformance.pageLoaded ) )
            {
                // now send event
                var fieldObj = {
                    eventCategory: 'Navigation Timing',
                    eventAction: 'track',
                    nonInteraction: true,
                };
                // add metric values
                fieldObj[ settings.metricServerResponseEnd ] = pagePerformance.serverResponseEnd;
                fieldObj[ settings.metricDOMContentLoaded ] = pagePerformance.domContentLoaded;
                fieldObj[ settings.metricPageLoaded ] = pagePerformance.pageLoaded;
                // send event
                ga('send', 'event', fieldObj );
                if( settings.debug )
                {
                    console.log("SGGoogleAnalytics.trackPerformance: Navigation Timing, track, %o", pagePerformance );
                }
            }
        }
    };

    /**
     * Track link clicks of a defined set of file extensions and send an event
     */
    var trackDownloads = function()
    {
        if( settings.trackDownloads )
        {
            if( settings.debug )
            {
                console.log("SGGoogleAnalytics.trackDownloads: enabled");
            }
            // prepare selector
            var trackDownloadsSelector = '';
            var fileTypesLength = settings.eventDownloadsFileTypes.length;
            if( fileTypesLength > 0 )
            {
                for( var i = 0; i < fileTypesLength; i++ )
                {
                    if( i > 0 )
                    {
                        trackDownloadsSelector = trackDownloadsSelector + ', ';
                    }
                    trackDownloadsSelector = trackDownloadsSelector + 'a[href$=".'+settings.eventDownloadsFileTypes[i]+'"]';
                }
            }
            if( trackDownloadsSelector !== '' ) {
                $( trackDownloadsSelector ).on('click', function( e )
                {
                    e.preventDefault();
                    // better use this.href because we always receive the absolute path w/ domain
                    var url = this.href;
                    // clean up url, remove domain
                    var urlNoDomain = url.replace(/https?:\/\/[^\/]+/i, "");
                    var extension = url.substr( (url.lastIndexOf('.') +1) );
                    // send event
                    ga('send', 'event', settings.eventDownloadsCategory, extension, urlNoDomain, {
                        'transport': 'beacon',
                        'hitCallback': function(){document.location = url;}
                    });
                });
            }
        }
    };

    /**
     * Track link clicks that refer to a different domain than this domain and send an event
     */
    var trackOutboundLinks = function()
    {
        if( settings.trackOutboundLinks )
        {
            if( settings.debug )
            {
                console.log("SGGoogleAnalytics.trackOutboundLink: enabled");
            }
            // attach event handler onto each link and check whether we
            // have an external link. Do nothing if internal,
            // track if external link
            $('a').on('click', function( e )
            {
                // differs this host from target host? We have an external link
                var thisHost = (location.hostname === this.hostname || !this.hostname.length);
                if( thisHost === false )
                {
                    // track and prevent default event behaviour
                    e.preventDefault();
                    // better use this.href because we always receive the absolute path w/ domain
                    var url = this.href;
                    // clean up url, remove protocol
                    var urlNoProtocol = url.replace(/http[s]?:\/\//, '');
                    // send event
                    ga('send', 'event', settings.eventOutboundCategory, settings.eventOutboundAction, urlNoProtocol, {
                        'transport': 'beacon',
                        'hitCallback': function(){document.location = url;}
                    });
                }
            });
        }
    };

    /**
     * Check if value is in a suitable integer range
     * @param value
     * @returns {boolean}
     */
    var isIntegerValueValid = function( value )
    {
        return ( value > 0 && value < 1e6 );
    };

    var trackSGEstateSearchBoxSend = function()
    {
        if( settings.trackSGEstateSearchBoxSend )
        {
            if (document.readyState != 'complete')
            {
                window.addEventListener('load', trackSGEstateSearchBoxSend );
                return;
            }

            $sgEstateSearchBoxTrigger = $( settings.sgEstateSearchBoxEventTriggerSelector );
            if( $sgEstateSearchBoxTrigger.length > 0 )
            {
                $sgEstateSearchBoxTrigger.on('submit', function( e )
                {
                    // collect data
                    var fieldObj = {
                        eventCategory: 'SGEstate',
                        eventAction: 'sent',
                        eventLabel: 'Search Box sent'
                    };

                    var h = false;
                    var validMetrics = 0;
                    h = getMetricValueFromInput( settings.sgEstateSearchBoxSizeSelector );
                    if( h !== false )
                    {
                        fieldObj[ settings.metricSGEstateSearchBoxSize ] = h;
                        h = false;
                        validMetrics++;
                    }
                    h = getMetricValueFromInput( settings.sgEstateSearchBoxRoomsSelector );
                    if( h !== false )
                    {
                        fieldObj[ settings.metricSGEstateSearchBoxRooms ] = h;
                        h = false;
                        validMetrics++;
                    }
                    h = getMetricValueFromInput( settings.sgEstateSearchBoxRentSelector );
                    if( h !== false )
                    {
                        fieldObj[ settings.metricSGEstateSearchBoxRent ] = h;
                        h = false;
                        validMetrics++;
                    }

                    if( validMetrics > 0 )
                    {
                        // send event
                        ga('send', 'event', fieldObj );
                        if( settings.debug )
                        {
                            console.log("SGGoogleAnalytics.trackSGEstateSearchBoxSend: SGEstate:sent:SearchBoxSent, %o", fieldObj );
                        }
                    }
                    else
                    {
                        if( settings.debug )
                        {
                            console.warning("SGGoogleAnalytics.trackSGEstateSearchBoxSend: SGEstate:sent:SearchBoxSent, event not sent %o", fieldObj );
                        }
                    }
                });
            }
        }
    };

    /**
     * Retrieve the value of a given input by its selector
     * @param targetSelector
     * @return Value of input or false
     */
    var getMetricValueFromInput = function( targetSelector )
    {
        var r = false;
        var $h = $( targetSelector );
        if( $h.length > 0 )
        {
            var value = $h.val();
            if( value !== '' && value > 0 && value < 1e6 )
            {
                r = value;
            }
        }
        return r;
    };

    /**
     * Returns the glued disable cookie name
     * @returns {string}
     */
    var getAnalyticsDisableCookieIdentifier = function()
    {
        return settings.disableCookieIdentifier+settings.property;
    };

    /**
     * Sets the global disable analytics var if cookie is present
     * @returns {boolean} Analytics should be disabled?
     */
    var setAnalyticsDisableGlobal = function()
    {
        var r = false;
        var disableIdentifier = getAnalyticsDisableCookieIdentifier();
        if (document.cookie.indexOf( disableIdentifier + '=true') > -1)
        {
            window[ disableIdentifier ] = true;
            r = true;
        }
        return r;
    };

    /**
     * Registers click event for optout classes
     */
    var registerOptoutEvent = function()
    {
        // wait until the dom is fully loaded
        if (document.readyState != 'complete')
        {
            window.addEventListener('load', registerOptoutEvent );
            return;
        }
        // now add event listeners if selectors are present
        var $optoutLinks = $( settings.disableLinkSelector );
        if( $optoutLinks.length > 0 )
        {
            $optoutLinks.on('click', function( e )
            {
                e.preventDefault();
                app.optout( settings.disableLinkIdle );
            });
        }
    };

    /**
     * Set the optout cookie and global var
     * @param idle prevent alert output when set to true
     */
    app.optout = function( idle )
    {
        if( typeof idle === "undefined" )
        {
            idle = true;
        }
        disable = true;
        var disableIdentifier = getAnalyticsDisableCookieIdentifier();
        document.cookie = disableIdentifier + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
        window[disableIdentifier] = true;
        if( settings.debug )
        {
            console.log("SGGoogleAnalytics.optout: optout cookie and global var set" );
        }
        if( idle !== true )
        {
            alert( settings.textDisableSuccess );
        }
    };

    /**
     * Sends an Google Analytics event. Makes events publicly available
     *
     * @param eventCategory
     * @param eventAction
     * @param eventLabel
     * @param eventFieldObject
     */
    app.pushEvent = function( eventCategory, eventAction, eventLabel, eventFieldObject )
    {
        eventCategory = typeof eventCategory !== 'undefined' ? eventCategory : false;
        eventAction = typeof eventAction !== 'undefined' ? eventAction : false;
        eventLabel = typeof eventLabel !== 'undefined' ? eventLabel : false;
        eventFieldObject = typeof eventFieldObject !== 'undefined' ? eventFieldObject : {};
        if( eventCategory !== false )
        {
            if( eventAction !== false )
            {
                if( eventLabel !== false )
                {
                    ga('send', 'event', eventCategory, eventAction, eventLabel, eventFieldObject );
                }
                else
                {
                    ga('send', 'event', eventCategory, eventAction, eventFieldObject );
                }
            }
            else
            {
                ga('send', 'event', eventCategory, eventFieldObject );
            }
        }
    };

    /**
     * Initialize module and start analytics script
     */
    app.init = function( options )
    {
        settings = $.extend( settings, options );
        app.active = false;
        if( settings.property !== false )
        {
            // we say an explicitly set property via js settings binds the most
            // and enables the tracking
            app.active = true;
        }
        else
        {
            // only enable tracking if the tracking property was set by some template
            if( typeof window.SGGoogleAnalyticsProperty !== "undefined" )
            {
                settings.property = window.SGGoogleAnalyticsProperty;
                app.active = true;
            }
        }
        if( settings.debug )
        {
            console.log("SGGoogleAnalytics.init: %s", app.active );
        }
        if( app.active )
        {
            // check for disable cookie and set global disable var
            // disabled carries whether ga is disabled or not
            disabled = setAnalyticsDisableGlobal();
            if( settings.debug )
            {
                console.log("SGGoogleAnalytics.init: disabled: %s", disabled );
            }
            //only proceed if not disabled
            if( !disabled ) {
                // initialize GA asynchronously
                // may lead to synchronous loading in older browsers ( < IE10 etc.)
                // but uses full potential of preloading and caching of assets
                window.ga = window.ga || function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;

                // init google analytics global ga queue
                ga('create', settings.property, 'auto');
                if( settings.debug )
                {
                    console.log("SGGoogleAnalytics.init: property: %s", settings.property );
                }
                ga('set', 'anonymizeIp', true);
                // set transport method to beacon to ensure proper sending of data
                // even if the tracking page was left
                ga('set', 'transport', 'beacon');
                // add custom dimensions, metrics and events according to settings
                trackVersion();
                trackClientId();
                trackWindowId();
                trackIndividualHits();
                trackErrors();
                trackPerformance();
                trackDownloads();
                trackOutboundLinks();
                trackSGEstateSearchBoxSend();

                // register optout link events
                registerOptoutEvent();

                // last thing, send pageview
                ga('send', 'pageview');
            }
        }
    };

    return app;
})();
