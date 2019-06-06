// scrape script
// +++++++++++++++++++

// Require request and cheerio, allowing scrapes
var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
 request("https://www.washingtonpost.com/", (err, res, body) => {
   if (!err && res.statusCode == 200) {
     var $ = cheerio.load(body);
     var articles = [];

     $(".pb-feature").each(function (i, element) {

       var head = $(this).find(".headline").text().trim();

       var sum = $(this).find(".blurb").text().trim();

       var link = $(this).find("a").attr("href");
       console.log(head);
       console.log(sum);
       console.log(link);

       if (head && sum && link) {
         var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
         var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

         var dataToAdd = {
           headline: headNeat,
           summary: sumNeat,
           link: link
         };

         console.log(dataToAdd);
         articles.push(dataToAdd);
       }
     });

     console.log(articles);
     cb(articles);
   };
 });
}



// **********
//     request('https://www.washingtonpost.com/', (error, response, body) => {
//   if (!error && response.statusCode == 200) {
//     const $ = cheerio.load(body);

//     const headline = $('.headline');
//     const blurb = $('.blurb');

//     console.log(headline.text(), blurb.text());
//   }
// });

// ** check this to see if this is the right class in NY Times
// $(".theme-summary").each(function (i, element) {


module.exports = scrape;