###Winston Transport for Slack chat integration

Basic transport that works just like all other winston transports. Sends logged messages to a specified slack chat channel

First install winston...
    
    $ npm install winston

Then install winston-bishop-slack

    $ npm install winston-bishop-slack

#####Additional Options:

* **webhook_url:** *(required) url for your integration (provided by the slack API)*
* **icon_url:** *avatar of the message 'sender' as it appears in slack*
* **channel:** *channel on which the sent message will appear in slack*
* **username:** *name displayed in the chat channel. default "Winston Bishop"*

<code>
    var winston = require('winston');
    var slack = require('winston-bishop-slack').Slack;
    
    winston.add(slack, {
      webhook_url: "https://hooks.slack.com/services/...",
      icon_url: "https://stagefisher.s3.amazonaws.com/images/character/image/519b31da5bf1614f8100000e/Winston-Bishop-New_Girl.jpg",
      channel: "#winston",
      username: "Winston Bishop",
      level: 'error',
      handleExceptions: true,
      customFormatter: function(level, message, meta) {
        return { attachments: [ {
          fallback: "Urgent announcement regarding my cat Ferguson",
          pretext: "Urgent announcement regarding my cat Ferguson",
          color: '#D00000',
          fields: [{
            title: util.format(":scream_cat: %s", message),
            value: meta.detail,
            short: false
          }]
        }]}
      }
    })
  
    winston.error('Ferguson Ran Away!', { detail: "He was last seen at 3pm on Tuesday" }, 
      function(err, res) {
        console.log('Finished 3: (error=%s)', JSON.stringify(err, null, 2));
      }
    );
</code>

![winston](https://cldup.com/ZcEghxatuM-3000x3000.png "Looks like this...")

