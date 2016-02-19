
// Load application once the DOM is ready
$(function() {

  // Create model for blog
  var Blog = Backbone.Model.extend({
    defaults: {
      author: '',
      title: '',
      url: ''
    }
  });

  // Create collection
  var Blogs = Backbone.Collection.extend({});

  // Instantiate two Blogs
  // var blog1 = new Blog({
  //   author: 'Myles Hiatt',
  //   title: 'Myles Blog',
  //   url: 'www.mylesblog.com'
  // });
  //
  // var blog2 = new Blog({
  //   author: 'John Hiatt',
  //   title: 'John Blog',
  //   url: 'www.Johnblog.com'
  // });

  // Instantiate collection
  var blogs = new Blogs();

  // Create backbone view for one blog
  var BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: 'tr',
    initialize: function() {
      this.template = _.template($('.blogs-list-template').html())
    },
    events: {
      'click .edit-blog': 'edit',
      'click .update-blog': 'update',
      'click .cancel': 'cancel',
      'click .delete-blog': 'delete'
    },
    edit: function() {
      var author = this.$('.author').html();
      var title = this.$('.title').html();
      var url = this.$('.url').html();

      $('.edit-blog').hide();
      $('.delete-blog').hide();
      this.$('.update-blog').show();
      this.$('.cancel').show();

      this.$('.author').html('<input type="text" class="form-control author-update" value="' + author + '">');
      this.$('.title').html('<input type="text" class="form-control title-update" value="' + title + '">');
      this.$('.url').html('<input type="text" class="form-control url-update" value="' + url + '">');
    },
    update: function() {
      this.model.set('author', $('.author-update').val());
      this.model.set('title', $('.title-update').val());
      this.model.set('url', $('.url-update').val());
    },
    cancel: function() {
      blogsView.render();
    },
    delete: function() {
      this.model.destroy();
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  // Create backbone view for all blogs
  var BlogsView = Backbone.View.extend({
    model: blogs,
    el: $('.blogs-list'),
    initialize: function() {
  		var self = this;
  		this.model.on('add', this.render, this);
  		this.model.on('change', function() {
  			setTimeout(function() {
  				self.render();
  			}, 30);
  		}, this);
  		this.model.on('remove', this.render, this);
    },
    render: function() {
      var self = this;
      this.$el.html('');
      _.each(this.model.toArray(), function(blog) {
        self.$el.append((new BlogView({model: blog})).render().$el);
      });
      return this;
    }
  });

  var blogsView = new BlogsView();

  $('.add-blog').click(function() {
    var blog = new Blog({
      author: $('.author-input').val(),
      title: $('.title-input').val(),
      url: $('.url-input').val()
    });

    $('.author-input').val('');
    $('.title-input').val('');
    $('.url-input').val('');

    console.log(blog.toJSON());
    blogs.add(blog);
  });

});
