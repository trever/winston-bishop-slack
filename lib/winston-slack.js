var util = require('util')
  , winston = require('winston')
  , superagent = require('superagent')
  , extend = require('extend.js')

var Slack = exports.Slack = function (options) {
  options = options || {};
  if(!options.webhook_url && !options.token) {
      throw new Error("webhook url cannot be null");
  }
  else {
      this.webhook_url     = options.webhook_url;
      this.channel         = options.channel;      
      this.icon_url        = options.icon_url || "https://cldup.com/9M--n6m2F6-3000x3000.jpeg";
      this.username        = options.username || "Winston Bishop";
      this.level           = options.level    || 'info';
      this.silent          = options.silent   || false;
      this.raw             = options.raw      || false;
      this.customFormatter = options.customFormatter;

      // this.sendAsAttachment = options.sendAsAttachment || false;
      this.token           = options.token || false;
      //- Enabled loging of uncaught exceptions
      this.handleExceptions = options.handleExceptions || false
  }
}

util.inherits(Slack, winston.Transport);
winston.transports.Slack = Slack;
Slack.prototype.name = 'slack'

Slack.prototype.log = function (level, msg, meta, callback) {
  //- Use custom formatter for message if set
  if (!this.token || !meta || typeof meta != "object"){
    var message = this.customFormatter
      ? this.customFormatter(level, msg, meta)
      : { text: util.format("[%s] %s", level.toUpperCase(), msg) }

    var base = {
      channel: this.channel,
      username: this.username,
      icon_url: this.icon_url
    }
    message = extend(base, message);

  
    superagent
      .post(this.webhook_url)
      .send(message)
      .end(callback);

  } else {
    var message = this.customFormatter 
      ? this.customFormatter(level, msg, meta) 
      : {title: "["+level+"] "+ msg, content: meta};

    var base = {
      channels: this.channel,
      token: this.token,
      filetype:'javascript'
    };

    message = extend(base,message);

    superagent.post("https://slack.com/api/files.upload")
      .send(message)
      .end(callback);
  };
  
};