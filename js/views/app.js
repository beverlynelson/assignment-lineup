var app = app || {};

  app.AppView = Backbone.View.extend({

    el: '#assignmentapp',

    statsTemplate: _.template( $('#stats-template').html() ),

    events: {
      'keypress #new-assignment': 'createOnEnter',
      'click #clear-completed': 'clearCompleted',
      'click #toggle-all': 'toggleAllComplete'
    },

    initialize: function() {
      this.allCheckbox = this.$('#toggle-all')[0];
      this.$input = this.$('#new-assignment');
      this.$footer = this.$('#footer');
      this.$main = this.$('#main');

      this.listenTo(app.Assignments, 'add', this.addOne);
      this.listenTo(app.Assignments, 'reset', this.addAll);

      this.listenTo(app.Assignments, 'change:completed', this.filterOne);
      this.listenTo(app.Assignments,'filter', this.filterAll);
      this.listenTo(app.Assignments, 'all', this.render);

    },

    render: function() {
      var completed = app.Assignments.completed().length;
      var remaining = app.Assignments.remaining().length;

      if ( app.Assignments.length ) {
        this.$main.show();
        this.$footer.show();

        this.$footer.html(this.statsTemplate({
          completed: completed,
          remaining: remaining
        }));

        this.$('#filters li a')
          .removeClass('selected')
          .filter('[href="#/' + ( app.AssignmentFilter || '' ) + '"]')
          .addClass('selected');
      } else {
        this.$main.hide();
        this.$footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    addOne: function( assignment ) {
      var view = new app.AssignmentView({ model: assignment });
      $('#assignment-list').append( view.render().el );
    },

    addAll: function() {
      this.$('#assignment-list').html('');
      app.Assignments.each(this.addOne, this);
    },

    filterOne : function (assignment) {
      assignment.trigger('visible');
    },

    filterAll : function () {
      app.Assignments.each(this.filterOne, this);
    },

    newAttributes: function() {
      return {
        title: this.$input.val().trim(),
        order: app.Assignments.nextOrder(),
        completed: false
      };
    },

    createOnEnter: function( event ) {
      if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
        return;
      }

      app.Assignments.create( this.newAttributes() );
      this.$input.val('');
    },

    clearCompleted: function() {
      _.invoke(app.Assignments.completed(), 'destroy');
      return false;
    },

    toggleAllComplete: function() {
      var completed = this.allCheckbox.checked;

      app.Assignments.each(function( assignment ) {
        assignment.save({
          'completed': completed
        });
      });
    }

  });