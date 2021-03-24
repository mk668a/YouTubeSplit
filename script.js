window.onload = function () {
  // console.log("start extension");

  // urlからドメイン名を返す関数
  function getDomainName(url) {
    var host_domain;

    if (url.indexOf("://") > -1) {
      host_domain = url.split('/')[2];
    }
    else {
      host_domain = url.split('/')[0];
    }

    host_domain = host_domain.split(':')[0];

    return host_domain;
  }


  // ********** bookmark取得 **********
  chrome.bookmarks.getTree(roots => {
    var bookmarks = [];
    // create new ui
    const unorderedList = document.createElement("ul");

    roots.forEach(parser);

    function parser(node) {
      // create new li
      const listItem = document.createElement("li");
      if (node.children) {
        // 新しいulを作ってliに入れる
        node.children.forEach(parser);
      } else if (node.url) {
        listItem.innerHTML = `<img src="http://www.google.com/s2/favicons?domain=${getDomainName(node.url)}"/><a href="${node.url}">${node.title}</a>`
        unorderedList.appendChild(listItem)
        bookmarks.push(node);
      }
    }

    // console.log(bookmarks);
    // console.log(unorderedList);

    // DOMに挿入
    const BookmarkList = document.getElementById("BookmarkList")
    BookmarkList.appendChild(unorderedList)
  });

  // ********** 検索 **********
  const input = document.getElementById('input');
  input.addEventListener('change', updateValue);

  function updateValue(e) {
    let value = e.srcElement.value;
    // 検索
    chrome.bookmarks.search(value, function (results) {
      // 検索結果
      // console.log(results);

      // DOMに挿入
      let BookmarkList = document.getElementById("BookmarkList")
      BookmarkList.innerHTML = '';
      // create new ui
      const unorderedList = document.createElement("ul");
      results.forEach(node => {
        // console.log(node);
        if (node.url) {
          // create new li
          const listItem = document.createElement("li");
          listItem.innerHTML = `<img src="http://www.google.com/s2/favicons?domain=${getDomainName(node.url)}"/><a href="${node.url}">${node.title}</a>`
          unorderedList.appendChild(listItem)
        }
      })
      // console.log(unorderedList);
      BookmarkList.appendChild(unorderedList)
    });
  }
};
