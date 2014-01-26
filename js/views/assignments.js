var app = app || {};

app.AssignmentView = Backbone.View.extend({

  tagName: 'li',

  template: _.template( $('#item-template').html() ),

  events: {
    'dblclick label': 'edit',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    this.$el.html( this.template( this.model.toJSON() ) );
    this.$input = this.$('.edit');
    return this;
  },

  toggleVisible : function () {
    this.$el.toggleClass( 'hidden',  this.isHidden());
  },

  isHidden : function () {
    var isCompleted = this.model.get('completed');
    return ( // hidden cases only
      (!isCompleted && app.AssignmentFilter === 'completed')
      || (isCompleted && app.AssignmentFilter === 'active')
    );
  },

  togglecompleted: function() {
    this.model.toggle();
  },

  edit: function() {
    this.$el.addClass('editing');
    this.$input.focus();
  },


  close: function() {
    var value = this.$input.val().trim();

    if ( value ) {
      this.model.save({ title: value });
    }

    this.$el.removeClass('editing');
  },

  updateOnEnter: function( e ) {
    if ( e.which === ENTER_KEY ) {
      this.close();
    }
  },

  clear: function() {
    this.model.destroy();
  }
});