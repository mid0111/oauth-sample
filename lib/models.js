function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
     
  /**
   * User model
   * 
   * Used for persisting users
   */  
  var User = new Schema({
    userId: { type : String, index: { unique: true, sparse: true }},
    name: { type : String },
    email: { type : String },
    lastlogin: { type : Date, default: Date.now },
    project: [Project]
  });
  
  User.virtual('id').get(function() {
      return this._id.toHexString();
  });
  
  /**
   * Project model
   * 
   * Used for persisting chat messages
   */
  var Project = new Schema({
    posted: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    name: String,
    url: { type : String, index: { unique: true }, match: '/*+/' }
  });
  
  Project.virtual('posteddate')
    .get(function() {
      return date.toReadableDate(this.posted, 'datestamp');
    });

  Project.virtual('updateddate')
    .get(function() {
      return date.toReadableDate(this.updated, 'datestamp');
    });
  
  // register mongoose models
  mongoose.model('Project', Project);
  mongoose.model('User', User);
  fn();
}

exports.defineModels = defineModels;