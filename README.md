# Blueprint Markdown Renderer

Default parser and set of settings for parsing and rendering of Markdown blocks in API Blueprint

## Examples

### Basic Rendering Of Blueprint Descriptions

TBD


### Basic Rendering Usage

```js
import renderHtml from 'blueprint-markdown-render';

const mdText = '# Heading';

const html = renderHtml(mdText);

console.log("Rendered HTML: ", html);
```


## Motivation

While [API Blueprint](https://apiblueprint.org/) syntax is based on Markdown, it doesn't care about the (Markdown) content of description blocks. The [reference parser](https://github.com/apiaryio/drafter) actually preserves the source Markdown in the produced AST.

This library is intended to provide a consistent API for parsing those Markdown blocks. Use it to get same defaults and consistent rendering with the rest of JavaScript API Blueprint ecosystem.

To get consistent experience accross languages, this library uses [CommonMark](http://commonmark.org) implementation under its hood. Those extensions to default rendering is enabled by default:

* TBD

## Advanced Usage

Note that if you pass in any options, you are potentially diverging from the ecosystem, therefore this is not encouraged. However, it's still better to share the same rendering core with customised behaviour than it is to start for the blank slate.

```js
import renderHtml from 'blueprint-markdown-render';

const mdText = '# Heading';

const renderingOptions = {
	sanitize: false, // Disables HTML sanitization, which is now left up to you. Dangerous, use only if you are triple sure

	// tweaks rendering extensions
	formattingExtensions: {

		noteBlock: true,    // enables :::note block
		warningBlock: true, // enables :::warning block
		noteBlock: true,    // enables :::note block
	},

	//custom plugins to MarkedIt. Try not to use those as you are relying on implementation detail
	markeditPlugins: {

	}

}

const html = renderHtml(mdText, renderingOptions);

console.log("Rendered HTML: ", html);

```

## Installation

```shell
$ npm install blueprint-markdown-renderer
```

## Development

```shell
$ npm install
$ npm test
```

By default, tests are ran on server as well as in the browser, using
[Karma](karma-runner.github.io/). To ran manually just one specific type, use:

```shell
$ npm run server-test
$ npm run browser-test
```

## License


MIT (see `LICENSE` file)

Apiary Czech Republic, s.r.o. <support@apiary.io>
