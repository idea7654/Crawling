const client = require("cheerio-httpcli");
const csv = require("csv-parser");
const fs = require("fs");

let dataList = [];

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    //console.log(row);
    dataList.push(row);
    const keywords = row["검색키워드"].split(",");
    for (let i in keywords) {
      const point = keywords[i].split(" ")[0];
      ProcessCrawling(keywords[i], point);
    }
  }) //해당 question에 해당하는 csv를 읽고 배열에 넣음
  .on("end", () => {});

function ProcessCrawling(keyword, point) {
  client.fetch("http://www.google.com/search", { q: keyword }, function (
    err,
    $,
    res,
    body
  ) {
    $("a").each(function (idx) {
      const value = $(this).text();
      const hrefVal = $(this).attr("href");
      if (value && hrefVal && value.includes(point)) {
        const data = `title: ${value}\n link: ${hrefVal} \n\n`;
        fs.appendFile("result/" + keyword + ".txt", data, "utf8", (err) => {
          console.log("write end");
        });
      }
    });

    //console.log($("a"));
  });
}
