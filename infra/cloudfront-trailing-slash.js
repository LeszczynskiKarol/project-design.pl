// infra/cloudfront-trailing-slash.js
// CloudFront Function (viewer-request) dla dystrybucji www.project-design.pl (E2UJNOA00CF4G8).
//
// Po co: S3 website endpoint sam przekierowuje /sciezka -> /sciezka/ ale kodem 302
// (tymczasowym), czego nie da sie w nim zmienic. 302 nie konsoliduje sygnalow, wiec
// Google trzyma w indeksie adres bez ukosnika. Ta funkcja wyprzedza origin i oddaje 301.
//
// Czego NIE przekierowuje:
//   - "/" (korzen)
//   - adresow juz zakonczonych ukosnikiem
//   - plikow — czyli gdy ostatni segment zawiera kropke (/robots.txt, /sitemap-0.xml,
//     /favicon.ico, /assets/hoisted.abc123.js, /site.webmanifest)
//
// Zachowuje query string, zeby nie gubic utm_* i podobnych.

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri === '/' || uri.charAt(uri.length - 1) === '/') {
    return request;
  }

  var lastSegment = uri.substring(uri.lastIndexOf('/') + 1);
  if (lastSegment.indexOf('.') !== -1) {
    return request;
  }

  var qs = '';
  var keys = Object.keys(request.querystring);
  if (keys.length > 0) {
    var parts = [];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var param = request.querystring[key];
      parts.push(param.value ? key + '=' + param.value : key);
      if (param.multiValue) {
        for (var j = 0; j < param.multiValue.length; j++) {
          var mv = param.multiValue[j];
          parts.push(mv.value ? key + '=' + mv.value : key);
        }
      }
    }
    qs = '?' + parts.join('&');
  }

  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: uri + '/' + qs },
      'cache-control': { value: 'max-age=3600' }
    }
  };
}
