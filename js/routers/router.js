var Workspace = Backbone.Router.extend({
  routes:{
    '*filter': 'setFilter'
  },

  setFilter: function( param ) {
    // Set the current filter to be used
    if (param) {
      param = param.trim();
    }
    app.AssignmentFilter = param || '';

    app.Assignments.trigger('filter');
  }
});

app.AssignmentRouter = new Workspace();
Backbone.history.start();