let feed = require("feed-read");

feed("http://feeds.tuttojuve.com/rss/?c=6", callbackArticles)

function callbackArticles(err, articles) {
  // Each article has the following properties:
  //
  //   * "title"     - The article title (String).
  //   * "author"    - The author's name (String).
  //   * "link"      - The original article link (String).
  //   * "content"   - The HTML content of the article (String).
  //   * "published" - The date that the article was published (Date).
  //   * "feed"      - {name, source, link}
  //
  if (err) throw err

  articles.forEach((article) => {
    console.log(article.link + " | " + article.published)
  })

}
