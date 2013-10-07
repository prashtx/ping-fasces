# ping-fasces

A bundle of sticks with which to assert your control.

## What is this fasces?

Maybe you want to ping some services every 10 minutes, to keep them on their
toes. Well, maybe not, but that's what I want.

Ping-fasces reads a JSON config object from an environment variables. Then it
makes the specified requests, logs a brief and barely helpful message to the
console, and quits.

If you use Heroku, you can set up the scheduler add-on to run ping-fasces every
10 minutes. Or if you want to warm up a bunch of non-production services before
a demo, you can run ping-fasces once to hit them all, so you don't miss one,
and so your fingers don't get tired.

## Configuration

The configuration object should follow the format below.

```
{
  "items": [
    {
      "action": "GET",
      "data": {
        "url": "http://demo-web.amazingservice.com/"
      }
    },
    {
      "action": "GET",
      "data": {
        "url": "http://demo-api.amazingservice.com/foo/bar/foo/bar"
      }
    }
  ]
}
```

Each entry in the `items` array will be processed roughly in parallel. The
`action` value tells ping-fasces what to do, and the `data` object provides the
necessary parameters. Right now, `GET` is the only supported action. `data.url`
specifies the URL to get. Fancy stuff.

To configure ping-fasces, set the `CONFIG` environment variable to the single-line stringified object.

## Heroku pro tip

To configure Heroku, you can keep a `heroku-config.json` file that's a bit more legible, and then use the following two scripts:

### jsonSlim
```
#!/usr/local/bin/node

var orig = '';

process.stdin.on('data', function (data) {
  orig += data.toString();
});

process.stdin.on('close', function () {
  try {
    var slim = JSON.stringify(JSON.parse(orig), null, 0);
    process.stdout.write(slim);
    process.stdout.write('\n');
  } catch (e) {
    console.error('Error parsing JSON: ' + e.message);
  }
});

process.stdin.resume();
```


### heroku-config.sh
```
#!/bin/sh

heroku config:set CONFIG="`cat heroku-config.json | jsonSlim`" --app my-pinger-app 
```
