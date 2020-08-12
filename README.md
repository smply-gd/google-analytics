# smply.gd Google Analytics
Google Analytics wrapper with event tracking and custom dimenstions and metrics.

## Usage
Include file in your script file and run `SGGoogleAnalytics.init();`. You may use the options below to 
override the base settings.

Further documentation will follow.

### Options
You may provide additional options and overrides via an object passed to the `init({})` 
method. Here is a list of all available options and their default values:

```javascript
window.SGGoogleAnalytics.init({
    trackingVersion: 1,
    trackVersion: true,
    trackClientId: false,
    trackWindowId: false,
    trackIndividualHits: true,
    trackErrors: true,
    trackPerformance: true,
    trackDownloads: false,
    trackOutboundLinks: false,
    trackSGEstateSearchBoxSend: false,
    // map the ga dimension indizes to our internal tracking dimensions
    dimensionTrackingVersion: 'dimension1',
    dimensionClientId: 'dimension2',
    dimensionWindowId: 'dimension3',
    dimensionHitId: 'dimension4',
    dimensionHitTime: 'dimension5',
    dimensionHitType: 'dimension6',
    // map the ga metric indizes to our internal metric identifiers
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
    // map event names
    eventDownloadsCategory: 'download',
    eventDownloadsFileTypes: ['pdf'],
    eventOutboundCategory: 'outbound',
    eventOutboundAction: 'click',
    // GA tracking property
    property: false,
    disableLinkSelector: '.sggoogleanalytics-optout',
    disableLinkIdle: false,
    disableCookieIdentifier: 'ga-disable-',
    textDisableSuccess: 'Optout für diese Seite erfolgreich gesetzt. Google Analytics erfasst in diesem Browser keine Statistiken mehr zu dieser Webseite.',
    debug: false,
});
```