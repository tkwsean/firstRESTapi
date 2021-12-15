const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
}

const Article = new mongoose.model("Article", articleSchema);
////////////////////////////////////////////////Request targeting all articles//////////////////////////////////////////////////////////
app.route("/articles")
  .get((req, res) => {
    Article.find({}, (error, articles) => {
      if (error) {
        console.log(error);
      } else {
        res.send(articles);
      }
    })
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added a new article")
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });
////////////////////////////////////////////////Request targeting a specific article//////////////////////////////////////////////////////////
app.route('/articles/:articleTitle')
  .get((req, res) => {
    Article.findOne({
      title: req.params.articleTitle
    }, (error, result) => {
      if (!error) {
        res.send(result);
      } else {
        res.send(error);
      }
    })
  })
  .put((req, res) => {
    Article.updateOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      },
      (error) => {
        if (error) {
          res.send(error);
        } else {
          res.send("Successfully updated the content of the selected article");
        }
      })
  })
  .patch((req, res) => {
    Article.updateOne({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      (error) => {
        if (error) {
          res.send(error);
        } else {
          res.send("Succesfully updated article");
        }
      }
    )
  })
  .delete((req, res) => {
    Article.deleteOne({
        title: req.params.articleTitle
      },
      (error) => {
        if (error) {
          res.send(error);
        } else {
          res.send("Successfully deleted article");
        }
      });
  });

app.listen('3000', () => {
  console.log('Server running on port 3000');
})
