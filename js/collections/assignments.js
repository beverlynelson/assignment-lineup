var app = app || {};



var AssignmentList = Backbone.Collection.extend({

 model: app.Assignment,

 // Using localStorage
 // Save all of the asignments under the `"assignments-backbone"` namespace.
 localStorage: new Backbone.LocalStorage('assignments-backbone'),

 // Returns an array of assignments completed.
 completed: function() {
   return this.filter(function( assignment ) {
     return assignment.get('completed');
   });
 },

 // Returns an array of assignments remaining.
 remaining: function() {
   return this.without.apply( this, this.completed() );
 },

 nextOrder: function() {
   if ( !this.length ) {
     return 1;
   }
   return this.last().get('order') + 1;
 },

 comparator: function( assignment ) {
   return assignment.get('order');
 }
});

app.Assignments = new AssignmentList();