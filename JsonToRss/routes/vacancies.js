'use strict';
var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

/* GET users listing. */
router.get('/', async function (req, res) {

    let response = await fetch('https://cv.lv/api/v1/vacancies-service/search?limit=20&offset=0&categories[]=INFORMATION_TECHNOLOGY&isHourlySalary=false');
    let json = await response.json();

    
    var result = '<rss version="2.0">';
    result += '<channel>';
    result += '<title>CL.LV</title>';
    result += '<link>https://cv.lv</link>';
    result += '<description>CV.LV</description>';
    result += '<lastBuildDate>'+new Date()+'</lastBuildDate>';
    result += '<ttl>5</ttl>';

    for (var i = 0; i < json.vacancies.length; i++) {
        result += '<item>';
        result += '<title><![CDATA[ ' + json.vacancies[i].positionTitle + ' ]]></title>';
        result += '<link>https://www.cv.lv/vacancy/' + json.vacancies[i].id + '</link>';
        result += '<pubDate>' + json.vacancies[i].publishDate + '</pubDate>';
        result += '<description><![CDATA[ ' + json.vacancies[i].positionContent + ' ]]></description>';
        result += '</item>';
    }
    result += '</channel>';
    result += '</rss>';
    res.type('application/xml');
    res.send(result);
});

module.exports = router;
