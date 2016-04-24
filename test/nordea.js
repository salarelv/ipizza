var assert = require('assert')
  , path = require('path')

describe('nordea', function() {
  beforeEach(function() {
    var ipizza = require('../ipizza')
    ipizza.set('logLevel', 'error')
  })
  afterEach(function() {
    delete require.cache[require.resolve('../ipizza')]
  })

  it('is on by default', function() {
    var ipizza = require('../ipizza')
    assert.doesNotThrow(function() {
      ipizza.provider('nordea')
    })
  })
  it('has gateway URLs for dev/production', function() {
    var ipizza = require('../ipizza')
    ipizza.set('env', 'production')
    var payment = ipizza.payment('nordea')
    var gw = payment.get('gateway')
    assert.ok(gw.length > 0)
    ipizza.set('env', 'development')
    var payment2 = ipizza.payment('nordea')
    var gw2 = payment2.get('gateway')
    assert.ok(gw2.length > 0)
    assert.notEqual(gw, gw2)
  })

  it('package generation uses string length', function() {
    var ipizza = require('../ipizza')
    var payment = ipizza.payment('nordea', {
      clientId: 'abc'
    , privateKey: path.join(__dirname, '../sample/keys/nordea.key.pem')
    , certificate: path.join(__dirname, '../sample/keys/nordea.cert.pem')
    , id: 10
    , msg: 'öäüõÖÄÜÕ'
    , amount: 10
    })
    payment.json()
    var result = '0041012003008003abc0021000510.00003EUR000008öäüõÖÄÜÕ'
    assert.strictEqual(payment.lastPackage_ , result)

  })
  it('generates valid mac for utf8', function() {
    var ipizza = require('../ipizza')
    var json = ipizza.payment('nordea', {
      clientId: 'abc'
    , privateKey: path.join(__dirname, '../sample/keys/nordea.key.pem')
    , certificate: path.join(__dirname, '../sample/keys/nordea.cert.pem')
    , id: 10
    , msg: 'öäüõÖÄÜÕ'
    , amount: 10
    , encoding: 'utf8'
    }).json()
    var result = 'gqAvFlvlVJLysDdcgAW9043pvtO6Teq6PWifYWQPVvuzAlXHexZePXszIxw4rDwd8t0r8MmED9oAqVoRRgW6QZW3Soy4uESv+rIfS9W2aLa4G5kw7c7IKNjqbDfVgzySzchlLuTJ9bawJ8EIwKEao85ogrmWZpMpbzueKZEpzjtZRQweEMTYaWHJorLLNH8d4WUyNaKy7oz6rdTPRpo8ieJFWwcPLulrippYUcZECvzWHMMkHA2nb29fdoPojeT0L6kS9p+UwHq9x09T+gaqkd3WPKpd5M1Asp/koisbfHIpqhGoyOg2q/GHRaET8Nv+zhDAVFUTIUGzLV4PWPHFWQ=='
    assert.strictEqual(json.VK_MAC, result)
  })

  it('generates valid mac for iso', function() {
    var ipizza = require('../ipizza')
    var json = ipizza.payment('nordea', {
      clientId: 'abc'
    , privateKey: path.join(__dirname, '../sample/keys/nordea.key.pem')
    , certificate: path.join(__dirname, '../sample/keys/nordea.cert.pem')
    , id: 10
    , msg: 'öäüõÖÄÜÕ'
    , amount: 10
    , encoding: 'iso'
    }).json()

    var result = 'gqAvFlvlVJLysDdcgAW9043pvtO6Teq6PWifYWQPVvuzAlXHexZePXszIxw4rDwd8t0r8MmED9oAqVoRRgW6QZW3Soy4uESv+rIfS9W2aLa4G5kw7c7IKNjqbDfVgzySzchlLuTJ9bawJ8EIwKEao85ogrmWZpMpbzueKZEpzjtZRQweEMTYaWHJorLLNH8d4WUyNaKy7oz6rdTPRpo8ieJFWwcPLulrippYUcZECvzWHMMkHA2nb29fdoPojeT0L6kS9p+UwHq9x09T+gaqkd3WPKpd5M1Asp/koisbfHIpqhGoyOg2q/GHRaET8Nv+zhDAVFUTIUGzLV4PWPHFWQ=='
    assert.strictEqual(json.VK_MAC, result)
  })

  it('validates utf8 mac', function() {
    var params = {
      VK_SERVICE: '1101',
      VK_VERSION: '008',
      VK_SND_ID: 'NORDEA',
      VK_REC_ID: 'uid203713',
      VK_STAMP: '10',
      VK_T_NO: '15095',
      VK_AMOUNT: '10.00',
      VK_CURR: 'EUR',
      VK_REC_ACC: '',
      VK_REC_NAME: '',
      VK_REF: '',
      VK_MSG: 'öäüõÖÄÜÕ',
      VK_T_DATE: '16.09.2012',
      VK_LANG: 'ENG',
      VK_AUTO: 'N',
      VK_SND_NAME: 'Tõõger Leõpäöld',
      VK_SND_ACC: '331234567897',
      VK_MAC: 'gqAvFlvlVJLysDdcgAW9043pvtO6Teq6PWifYWQPVvuzAlXHexZePXszIxw4rDwd8t0r8MmED9oAqVoRRgW6QZW3Soy4uESv+rIfS9W2aLa4G5kw7c7IKNjqbDfVgzySzchlLuTJ9bawJ8EIwKEao85ogrmWZpMpbzueKZEpzjtZRQweEMTYaWHJorLLNH8d4WUyNaKy7oz6rdTPRpo8ieJFWwcPLulrippYUcZECvzWHMMkHA2nb29fdoPojeT0L6kS9p+UwHq9x09T+gaqkd3WPKpd5M1Asp/koisbfHIpqhGoyOg2q/GHRaET8Nv+zhDAVFUTIUGzLV4PWPHFWQ=='
    }
    var ipizza = require('../ipizza')
    var payment = ipizza.payment('nordea', {
      certificate: path.join(__dirname, '../sample/keys/nordea.cert.pem')
    })

    console.log("json", payment.json())
    assert.ok(payment.verify_(params))

    params.VK_AMOUNT = '11.00'

    assert.ok(!payment.verify_(params))
  })

  it('validates iso mac', function() {
    var params = {
      VK_SERVICE: '1101',
      VK_VERSION: '008',
      VK_SND_ID: 'NORDEA',
      VK_REC_ID: 'uid203713',
      VK_STAMP: '10',
      VK_T_NO: '15096',
      VK_AMOUNT: '10.00',
      VK_CURR: 'EUR',
      VK_REC_ACC: '',
      VK_REC_NAME: '',
      VK_REF: '',
      VK_MSG: 'öäüõÖÄÜÕ',
      VK_T_DATE: '16.09.2012',
      VK_LANG: 'ENG',
      VK_AUTO: 'N',
      VK_SND_NAME: 'Tõõger Leõpäöld',
      VK_SND_ACC: '331234567897',
      VK_MAC:  'M0ihJnQD545wmk+nihXq7bDsmcxlmEvYkVoA55t3' +
               'vKHqOoXQmgcqumVNoylMaf6Z8Yodr4kYxK0EUMr6' +
               'UI6UEYk+2V1sCAroOJeBiHkPjaafF/nyBFZrp+T/' +
               'OINttJkr8TzeFDhavs2l1n6jzMDMjX/gDnue+wjx' +
               '7mMGcw80dkrpcMRtDtxnTax9mxnPeq+55Z92+Hqg' +
               'W920t//zZ6A+mn+Yqo5dzAd+yJmjlRtLk7/L9Ssy' +
               '8GZSljNtOxseZh4zoFhw78pyq6HszhgA/Aiff9c7' +
               'hZukG9Lcw4fZInib7unoho8UduZ9/Pa2zfSPJF5e' +
               'a3DlT+QiG7M/WqTe9DTUog=='
    }
    var ipizza = require('../ipizza')
    var payment = ipizza.payment('nordea', {
      certificate: path.join(__dirname, '../sample/keys/nordea.cert.pem')
    })
    assert.ok(payment.verify_(params))

    params.VK_AMOUNT = '11.00'
    assert.ok(!payment.verify_(params))

  })

})
