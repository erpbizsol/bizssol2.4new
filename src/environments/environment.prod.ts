export const environment = {
     production: true,
     BASE_URL: window.location.href.includes('test') == true ? 'https://web.bizsol.in/erpapitest/api' : window.location.href.includes('dev') == true || window.location.href.includes('localhost') == true ? 'https://web.bizsol.in/erpapidev/api' : 'https://web.bizsol.in/erpapi/api'
    };
  