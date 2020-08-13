# smply.gd Google Analytics Wrapper
Google Analytics wrapper with event tracking and custom dimenstions and metrics.

If initialized the module will load and init Google Analytics automatically. It will also
track useful dimensions and metrics if configured and provide a comprehensive API for event tracking
and automatic javascript error, performance (server response, page load and DOM content loaded), 
outbound links and downloads tracking. It also includes the opt-out snippet and you can provide an opt-out
link by just adding a certain class to it.

## Usage
1. Add the Google Analytics script to the footer of your page:
```html
<script async data-src="https://www.google-analytics.com/analytics.js"></script>
```

2. Add this global variable to specify the Analytics property (or provide via 
options in `init({property:'UA-XXXXXX'});` method):
```html
<script>window.SGGoogleAnalyticsProperty='UA-XXXXXXX';</script>
```

3. Include this script in your main script file and run `SGGoogleAnalytics.init();`. You may use the options below to 
override the base settings. You do not need to run this in a DOM loaded event as we won't be able 
to track performance dimensions then. The script checks whether the Analytics library is present. If not it will check
that periodically again and only runs if the Analytics lib is available.

### Track javascript errors
If you would like to track javascript errors via an Analytics event, you need to set the 
`trackErrors` option to `true` (which is the default). To make this work, you need to add a little
snippet to the head of your site, so it collects all errors and this script can later forward the errors to 
Analytics:

```html
<script>addEventListener('error', window.__e=function f(e){f.q=f.q||[];f.q.push(e)});</script>
```

This creates the global variable `window.__e` which will be populated with all js errors.

### Other public methods
Use `SGGoogleAnalytics.optout( idle );` to set the optout cookie and window var programmatically. Use the 
`idle` parameter (bool) to prevent the display of the confirmation alert.

Use `SGGoogleAnalytics.pushEvent( eventCategory, eventAction, eventLabel, eventFieldObject );` to
send an event. All parameters except `eventCategory` are optional.

### Options
You may provide additional options and overrides via an object passed to the `init({})` 
method. Here is a list of all available options and their default values:

```javascript
SGGoogleAnalytics.init({
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
});
```