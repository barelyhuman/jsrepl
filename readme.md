# jsrepl

![](/docs/screenshot.png)

<p align="center">A Quick and Minimal JS REPL</p>

> [!NOTE]\
> If you find this or any other tool / app by [reaper.is](https://reaper.is)
> useful, please contribute to the projects by either sharing them around or
> donating if you feel like it. All OSS projects are a part of
> [$1 a month](https://reaper.is/supporters)

- [jsrepl](#jsrepl)
  - [Why?](#why)
  - [Highlights](#highlights)
  - [Stack](#stack)
  - [Usages](#usages)
    - [Hosted](#hosted)
    - [Self Host](#self-host)
    - [Future](#future)

## Why?

I needed one. I've used a few of the alternatives in the past and the browser's
console is the most lightweight and quick solution to this. However, it was
easier to setup something that was a little more than just the browser's JS
engine and a little more on the server. I don't need access to all files and
folders but I do need a decent way to install deps and so, you have this.

## Highlights

- Fast
- No Fluff
- No user signup required
- Just does what it's supposed to

## Stack

- [deno](http://deno.land)
- [preact](http://preactjs.com)
- [twind](http://twind.style)
- [Docker](docker.com)

## Usages

### Hosted

You can use the hosted version at [jsrepl.barelyhuman.dev](https://jsrepl.barelyhuman.dev)

### Self Host

The recommended way to host this is by using the docker image, primarily to
reduce the risk of exposing your system to the web.

```sh
docker pull ghcr.io/barelyhuman/jsrepl:main
docker run -p 8000:8000 ghcr.io/barelyhuman/jsrepl:main
```

- Open your browser to `localhost:8000` and you are good to go!

You can look at other tags available for the same on the
[Containers Page](https://github.com/barelyhuman/jsrepl/pkgs/container/jsrepl)

### Future

I don't plan to add a lot of features to this but if there's bugs and
documentation that you wish to fix or add to, please feel free to raise PR's and
issues for the same
