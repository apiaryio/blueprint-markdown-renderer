# Blueprint Markdown Renderer

Default parser and set of settings for parsing and rendering of Markdown blocks in API Description Documents.

## Installation

```shell
$ npm install blueprint-markdown-renderer
```

## Usage

## Basic Rendering

```js
import { renderHtml } from 'blueprint-markdown-renderer';

const mdText = '# Heading';

const html = renderHtml(mdText);

console.log("Rendered HTML: ", html);
```


## Advanced Usage

Note that if you alter renderer's settings, you are potentially diverging from the ecosystem, therefore this is not encouraged. However, it's still better to share the same rendering core with customised behaviour than it is to start for the blank slate.

Blueprint Markdown Renderer uses [markdown-it](https://github.com/markdown-it/markdown-it) under the hood. See markdown-it [API Documentation](https://markdown-it.github.io/markdown-it/) to find all available options how to change renderer.

```js
import { renderHtml, rendererFactory } from 'blueprint-markdown-renderer';
import emojiPlugin from 'markdown-it-emoji';

const renderer = rendererFactory();

// alter default options
renderer.set({ langPrefix: 'lang-', breaks: true });

// add own plugin
renderer.use(emojiPlugin);

const mdText = ':smiley:';

const html = renderHtml(mdText, {
  renderer, // custom renderer
  env, // additional data from parsed input (references, for example)
  sanitize: true, // run HTML sanitization
});

console.log("Rendered HTML: ", html);

```


## Motivation

While [API Blueprint](https://apiblueprint.org/) syntax is based on Markdown, it doesn't care about the (Markdown) content of description blocks. The [reference parser](https://github.com/apiaryio/drafter) actually preserves the source Markdown in the produced API Elements. Same logic applies to

This library is intended to provide a consistent API for parsing those Markdown blocks. Use it to get the same defaults and consistent rendering with the rest of JavaScript API Blueprint ecosystem.

To get consistent experience accross languages, this library uses [CommonMark](http://commonmark.org) implementation under its hood. Following extensions to default rendering is enabled by default:

* [Tables](https://help.github.com/articles/organizing-information-with-tables/) (GFM)
* [Strikethrough](https://help.github.com/articles/basic-writing-and-formatting-syntax/#styling-text) (GFM)
* [Subscript](http://pandoc.org/MANUAL.html#superscripts-and-subscripts) (Pandoc)
* [Superscript](http://pandoc.org/MANUAL.html#superscripts-and-subscripts) (Pandoc)
* [Lazy Headers](https://github.com/Galadirith/markdown-it-lazy-headers) (Relaxed ATX Header syntax)


## Development

```shell
$ npm install
$ npm test
```

By default, tests are ran on server as well as in the browser, using
[Karma](http://karma-runner.github.io/). To ran manually just one specific type, use:

```shell
$ npm run server-test
$ npm run browser-test
```

This package is using [Semantic Release](https://github.com/semantic-release/semantic-release).

Please use proper commit [message format](https://github.com/semantic-release/semantic-release#default-commit-message-format).


## License

MIT (see `LICENSE` file)

Apiary Czech Republic, s.r.o. <support@apiary.io>
