module.exports = function (pluginConfig, config, cb) {
  const env = config.env;

  if (env.WERCKER !== 'true') {
    return cb(new Error("semantic-release didn't publish because it wasn't triggered from wercker"));
  }
  
  // make semantic-release run, no need for other conditions as they are already set in werker ci
  cb(null);

};
