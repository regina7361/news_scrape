// global bootbox
$(document).ready(function() {
    //Setting a reference to the article-container div where all the content will go
    //adding event listeners to any dynamically generated "save articles" and "scrape article" buttons
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    //run initpage function to start things
    initPage();

    function initPage() {
        //empty article container and run AJAX request for unsaved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
            .then(function(data) {
                //if headlines exist render to page
                if (data && data.length) {
                    renderArticles(data);
                }
                else {
                    //return message if no articles exist
                    renderEmpty();
                }
            });
    }

    function renderArticles(articles) {
        //function handles appending HTML containing our article data to the page
        //Pass an array of JSON containing all articles in DB
        var articlePanels = [];
        //Pass each article JSON object to the createpanel function
        for (var i=0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        //open them in the articles panel container
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        var panel =
        $(["<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        article.headline,
        "<br>",
        "<a class='btn btn-success save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
        ].join(""));

        panel.data("_id", article._id);

        return panel;
    }

    function renderEmpty() {
        var emptyAlert =
        $(["<div class='alert alert-warning text-center'>",
        "<h4>Uh oh!  Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>What would you like to do?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go To Saved Articles</a></h4>",
        "</div>",
        "</div>"
        ].join(""));

        //appending data to the page
        articleContainer.append(emptyAlert);
    }

    function handleArticleSave() {
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;

        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
        .then(function(data){
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleScrape() {
        $.get("/api/fetch")
        .then(function(data) {
            initPage();
            bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>");
        });
    }
});