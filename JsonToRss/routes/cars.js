'use strict';
var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const xml2js = require('xml2js');

const minYear = 2006;
const maxPrice = 6000;
/* GET users listing. */
router.get('/:make/:model', async function (req, res) {
	
	const model = 'toyota/corolla-verso';
	const url = 'https://www.ss.lv/ru/transport/cars/'+req.params['make']+'/'+req.params['model']+'/sell/riga_f/rss/';
	console.log(url);
    let response = await fetch(url);
    let data = await response.text();
    
	
    var rssObj = await xml2js.parseStringPromise(data);
	const yearRegex = /Год: (<b>)+(\d{4})<\/b>/gi;
	const priceRegex = /Цена: (<b>)+((\d|,)+)(<\/b>)?  €/gi;
	
	var items = [];
	
	for (var i in rssObj.rss.channel[0].item){
	
		const yearMatch = [...rssObj.rss.channel[0].item[i].description[0].matchAll(yearRegex)];
		const year = parseInt(yearMatch[0][2]); 
		if (year < minYear)
			continue;
		const priceMatch = [...rssObj.rss.channel[0].item[i].description[0].matchAll(priceRegex)];
		const price = parseInt(priceMatch[0][2].replace(',', '')); 
		if (price > maxPrice)
			continue;
			
		items.push(rssObj.rss.channel[0].item[i]);
	}
	
	rssObj.rss.channel[0].item = items;
	
	var builder = new xml2js.Builder();
	var xml = builder.buildObject(rssObj);

	res.type('application/xml');
    res.send(xml);
});

module.exports = router;
