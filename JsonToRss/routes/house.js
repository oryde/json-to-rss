'use strict';
var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const xml2js = require('xml2js');

const minLand = 1000;
const maxPrice = 180000;
const minHouseArea = 90;

/* GET users listing. */
router.get('/:region', async function (req, res) {
	const url = 'https://www.ss.lv/ru/real-estate/homes-summer-residences/'+req.params['region']+'/sell/rss/';
	
    let response = await fetch(url);
    let data = await response.text();
    
    var rssObj = await xml2js.parseStringPromise(data);
	const landAreaRegex = /Пл. зем.: (<b>)+((\d|\.)+)( м²| га\.)?/gi;
	const priceRegex = /Цена: (<b>)+((\d|,)+)(<\/b>)?  €/gi;
	const houseAreaRegex = /m2: (<b>)+((\d|,)+)(<\/b>)?/gi
	var items = [];
	
	for (var i in rssObj.rss.channel[0].item){
	
		var description = rssObj.rss.channel[0].item[i].description[0];
		console.log(description);
		const landArea = getMatch(description, landAreaRegex, 2); 
		console.log(landArea);
		if (landArea > 10 && landArea < minLand)
			continue;
		
		const price = getMatch(description, priceRegex, 2); 		
		if (price > maxPrice)
			continue;
					
		const houseArea = getMatch(description, houseAreaRegex, 2); 		
		if (houseArea < minHouseArea)
			continue;
			
		items.push(rssObj.rss.channel[0].item[i]);
	}
	
	rssObj.rss.channel[0].item = items;
	
	var builder = new xml2js.Builder();
	var xml = builder.buildObject(rssObj);

	res.type('application/xml');
    res.send(xml);
});

function getMatch(data, regex, index){
	const match = [...data.matchAll(regex)];
	const value = parseFloat(match[0][index].replace(',', '')); 
	return value;
}

module.exports = router;
